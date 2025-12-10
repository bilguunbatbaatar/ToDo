package Qwerty.mn.edu.num.ToDo.repository;

import Qwerty.mn.edu.num.ToDo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
