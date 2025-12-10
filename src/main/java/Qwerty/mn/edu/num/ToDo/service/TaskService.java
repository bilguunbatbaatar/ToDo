package Qwerty.mn.edu.num.ToDo.service;

import Qwerty.mn.edu.num.ToDo.model.Task;
import Qwerty.mn.edu.num.ToDo.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Бүх даалгавруудыг жагсаах
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // ID-аар даалгавар олох
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Шинэ даалгавар үүсгэх
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Даалгавар засах
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Даалгавар олдсонгүй: " + id));

        task.setName(taskDetails.getName());
        task.setDescription(taskDetails.getDescription());
        task.setStartDate(taskDetails.getStartDate());
        task.setEndDate(taskDetails.getEndDate());

        return taskRepository.save(task);
    }

    // Даалгавар устгах
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Даалгавар олдсонгүй: " + id);
        }
        taskRepository.deleteById(id);
    }
}
