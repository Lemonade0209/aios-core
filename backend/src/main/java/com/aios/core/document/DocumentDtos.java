package com.aios.core.document;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;

public class DocumentDtos {
    public record DocumentRequest(
            Long projectId,
            @NotBlank String title,
            @NotBlank String content,
            String summary
    ) {}

    public record DocumentResponse(
            Long id,
            Long projectId,
            String projectTitle,
            String title,
            String content,
            String summary,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static DocumentResponse from(DocumentEntity document) {
            return new DocumentResponse(
                    document.getId(),
                    document.getProject() == null ? null : document.getProject().getId(),
                    document.getProject() == null ? null : document.getProject().getTitle(),
                    document.getTitle(),
                    document.getContent(),
                    document.getSummary(),
                    document.getCreatedAt(),
                    document.getUpdatedAt()
            );
        }
    }
}
