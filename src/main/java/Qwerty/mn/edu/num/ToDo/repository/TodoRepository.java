package Qwerty.mn.edu.num.ToDo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import Qwerty.mn.edu.num.ToDo.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}
