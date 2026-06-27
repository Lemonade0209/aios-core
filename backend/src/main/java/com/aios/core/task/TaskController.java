package com.aios.core.task;

import com.aios.core.task.TaskDtos.TaskRequest;
import com.aios.core.task.TaskDtos.TaskResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    List<TaskResponse> list() {
        return taskService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    TaskResponse create(@Valid @RequestBody TaskRequest request) {
        return taskService.create(request);
    }

    @GetMapping("/{taskId}")
    TaskResponse get(@PathVariable Long taskId) {
        return taskService.get(taskId);
    }

    @PutMapping("/{taskId}")
    TaskResponse update(@PathVariable Long taskId, @Valid @RequestBody TaskRequest request) {
        return taskService.update(taskId, request);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long taskId) {
        taskService.delete(taskId);
    }
}
