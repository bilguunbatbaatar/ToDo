const API_BASE_URL = '/api/tasks';
let editingTaskId = null;

// DOM элементүүд
const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const loading = document.getElementById('loading');
const cancelEditBtn = document.getElementById('cancelEdit');

// Аппликейшн эхлэх үед
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupFormHandlers();
});

// Форм handler-ууд
function setupFormHandlers() {
    taskForm.addEventListener('submit', handleFormSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
}

// Форм илгээх
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('taskName').value,
        description: document.getElementById('taskDescription').value,
        startDate: document.getElementById('startDate').value || null,
        endDate: document.getElementById('endDate').value || null
    };
    
    try {
        if (editingTaskId) {
            await updateTask(editingTaskId, formData);
        } else {
            await createTask(formData);
        }
        taskForm.reset();
        cancelEdit();
        loadTasks();
    } catch (error) {
        alert('Алдаа гарлаа: ' + error.message);
    }
}

// Бүх даалгавруудыг ачаалах
async function loadTasks() {
    try {
        showLoading(true);
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Даалгавруудыг ачаалахад алдаа гарлаа');
        
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Алдаа:', error);
        tasksList.innerHTML = '<div class="empty-state"><p>Даалгавруудыг ачаалахад алдаа гарлаа</p></div>';
    } finally {
        showLoading(false);
    }
}

// Даалгавруудыг харуулах
function displayTasks(tasks) {
    if (tasks.length === 0) {
        tasksList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    tasksList.style.display = 'grid';
    emptyState.style.display = 'none';
    
    tasksList.innerHTML = tasks.map(task => createTaskCard(task)).join('');
    
    // Устгах, засах товчнуудын event listener-ууд
    tasks.forEach(task => {
        document.getElementById(`delete-${task.id}`).addEventListener('click', () => deleteTask(task.id));
        document.getElementById(`edit-${task.id}`).addEventListener('click', () => editTask(task));
    });
}

// Даалгаврын карт үүсгэх
function createTaskCard(task) {
    const startDate = task.startDate ? formatDate(task.startDate) : 'Тодорхойгүй';
    const endDate = task.endDate ? formatDate(task.endDate) : 'Тодорхойгүй';
    
    return `
        <div class="task-card">
            <div class="task-header">
                <div class="task-name">${escapeHtml(task.name)}</div>
                <div class="task-actions">
                    <button class="btn btn-edit" id="edit-${task.id}">Засах</button>
                    <button class="btn btn-danger" id="delete-${task.id}">Устгах</button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
            <div class="task-dates">
                <div class="date-item">
                    <span class="date-label">Эхлэх:</span>
                    <span>${startDate}</span>
                </div>
                <div class="date-item">
                    <span class="date-label">Дуусах:</span>
                    <span>${endDate}</span>
                </div>
            </div>
        </div>
    `;
}

// Шинэ даалгавар үүсгэх
async function createTask(taskData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Даалгавар үүсгэхэд алдаа гарлаа');
    }
    
    return await response.json();
}

// Даалгавар засах
async function updateTask(id, taskData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Даалгавар засахад алдаа гарлаа');
    }
    
    return await response.json();
}

// Даалгавар устгах
async function deleteTask(id) {
    if (!confirm('Та энэ даалгаврыг устгахдаа итгэлтэй байна уу?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Даалгавар устгахад алдаа гарлаа');
        }
        
        loadTasks();
    } catch (error) {
        alert('Алдаа: ' + error.message);
    }
}

// Даалгавар засах горимд оруулах
function editTask(task) {
    editingTaskId = task.id;
    
    document.getElementById('taskName').value = task.name;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('startDate').value = task.startDate || '';
    document.getElementById('endDate').value = task.endDate || '';
    
    document.querySelector('.task-form h2').textContent = 'Даалгавар засах';
    document.querySelector('button[type="submit"]').textContent = 'Хадгалах';
    cancelEditBtn.style.display = 'inline-block';
    
    // Форм руу scroll хийх
    document.querySelector('.task-form').scrollIntoView({ behavior: 'smooth' });
}

// Засах горимоос гарах
function cancelEdit() {
    editingTaskId = null;
    taskForm.reset();
    document.querySelector('.task-form h2').textContent = 'Шинэ даалгавар нэмэх';
    document.querySelector('button[type="submit"]').textContent = 'Даалгавар нэмэх';
    cancelEditBtn.style.display = 'none';
}

// Огноо форматлах
function formatDate(dateString) {
    if (!dateString) return 'Тодорхойгүй';
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// HTML-ээс хамгаалах
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Loading state харуулах/нуух
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    tasksList.style.display = show ? 'none' : 'grid';
}

