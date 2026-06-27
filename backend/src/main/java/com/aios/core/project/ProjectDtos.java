package com.aios.core.project;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.time.LocalDate;

public class ProjectDtos {
    public record ProjectRequest(
            @NotBlank String title,
            String description,
            String goal,
            ProjectStatus status,
            LocalDate startDate,
            LocalDate dueDate
    ) {}

    public record ProjectResponse(
            Long id,
            String title,
            String description,
            String goal,
            ProjectStatus status,
            LocalDate startDate,
            LocalDate dueDate,
            int progress,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static ProjectResponse from(Project project, int progress) {
            return new ProjectResponse(
                    project.getId(),
                    project.getTitle(),
                    project.getDescription(),
                    project.getGoal(),
                    project.getStatus(),
                    project.getStartDate(),
                    project.getDueDate(),
                    progress,
                    project.getCreatedAt(),
                    project.getUpdatedAt()
            );
        }
    }
}
