package com.aios.core.task;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;

public class TaskDtos {
    public record TaskRequest(
            Long projectId,
            @NotBlank String title,
            String description,
            TaskPriority priority,
            TaskStatus status,
            LocalDate dueDate
    ) {}

    public record TaskResponse(
            Long id,
            Long projectId,
            String projectTitle,
            String title,
            String description,
            TaskPriority priority,
            TaskStatus status,
            LocalDate dueDate,
            Instant completedAt,
            boolean overdue,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static TaskResponse from(TaskItem task) {
            return new TaskResponse(
                    task.getId(),
                    task.getProject() == null ? null : task.getProject().getId(),
                    task.getProject() == null ? null : task.getProject().getTitle(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getPriority(),
                    task.getStatus(),
                    task.getDueDate(),
                    task.getCompletedAt(),
                    task.getDueDate() != null && task.getDueDate().isBefore(LocalDate.now()) && task.getStatus() != TaskStatus.DONE,
                    task.getCreatedAt(),
                    task.getUpdatedAt()
            );
        }
    }
}
