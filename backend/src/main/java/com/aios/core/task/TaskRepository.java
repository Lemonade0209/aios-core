package com.aios.core.task;

import com.aios.core.project.Project;
import com.aios.core.user.AppUser;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<TaskItem, Long> {
    List<TaskItem> findByUserOrderByUpdatedAtDesc(AppUser user);

    List<TaskItem> findTop10ByUserOrderByUpdatedAtDesc(AppUser user);

    List<TaskItem> findByUserAndDueDateAndStatusNotOrderByDueDateAsc(AppUser user, LocalDate dueDate, TaskStatus status);

    List<TaskItem> findByUserAndDueDateBeforeAndStatusNotOrderByDueDateAsc(AppUser user, LocalDate dueDate, TaskStatus status);

    Optional<TaskItem> findByIdAndUser(Long id, AppUser user);

    long countByProject(Project project);

    long countByProjectAndStatus(Project project, TaskStatus status);
}
