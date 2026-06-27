package com.aios.core.task;

import com.aios.core.global.exception.ApiException;
import com.aios.core.project.Project;
import com.aios.core.project.ProjectService;
import com.aios.core.task.TaskDtos.TaskRequest;
import com.aios.core.task.TaskDtos.TaskResponse;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserService;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {
    private final TaskRepository tasks;
    private final UserService userService;
    private final ProjectService projectService;

    public TaskService(TaskRepository tasks, UserService userService, ProjectService projectService) {
        this.tasks = tasks;
        this.userService = userService;
        this.projectService = projectService;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> list() {
        return tasks.findByUserOrderByUpdatedAtDesc(userService.currentUser()).stream().map(TaskResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse get(Long id) {
        return TaskResponse.from(getOwned(id));
    }

    @Transactional
    public TaskResponse create(TaskRequest request) {
        TaskItem task = new TaskItem();
        task.setUser(userService.currentUser());
        apply(task, request);
        tasks.save(task);
        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse update(Long id, TaskRequest request) {
        TaskItem task = getOwned(id);
        apply(task, request);
        return TaskResponse.from(task);
    }

    @Transactional
    public void delete(Long id) {
        tasks.delete(getOwned(id));
    }

    public TaskItem getOwned(Long id) {
        AppUser user = userService.currentUser();
        return tasks.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    private void apply(TaskItem task, TaskRequest request) {
        task.setProject(request.projectId() == null ? null : projectService.getOwned(request.projectId()));
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setPriority(request.priority() == null ? TaskPriority.MEDIUM : request.priority());
        TaskStatus previous = task.getStatus();
        TaskStatus next = request.status() == null ? TaskStatus.TODO : request.status();
        task.setStatus(next);
        task.setDueDate(request.dueDate());
        if (next == TaskStatus.DONE && previous != TaskStatus.DONE) {
            task.setCompletedAt(Instant.now());
        } else if (next != TaskStatus.DONE) {
            task.setCompletedAt(null);
        }
    }
}
