package Qwerty.mn.edu.num.ToDo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import Qwerty.mn.edu.num.ToDo.model.Todo;
import Qwerty.mn.edu.num.ToDo.repository.TodoRepository;

@Service
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    public List<Todo> getAll() {
        return repository.findAll();
    }

    public Todo getById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Todo add(Todo todo) {
        return repository.save(todo);
    }

    public Todo update(Long id, Todo updated) {
        return repository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setStartDate(updated.getStartDate());
            existing.setEndDate(updated.getEndDate());
            return repository.save(existing);
        }).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
