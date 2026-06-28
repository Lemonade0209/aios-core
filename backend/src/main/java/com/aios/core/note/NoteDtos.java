package com.aios.core.note;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;

public class NoteDtos {
    public record NoteRequest(
            Long projectId,
            @NotBlank String title,
            @NotBlank String content,
            List<String> tags
    ) {}

    public record NoteResponse(
            Long id,
            Long projectId,
            String projectTitle,
            String title,
            String content,
            List<String> tags,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static NoteResponse from(Note note) {
            return new NoteResponse(
                    note.getId(),
                    note.getProject() == null ? null : note.getProject().getId(),
                    note.getProject() == null ? null : note.getProject().getTitle(),
                    note.getTitle(),
                    note.getContent(),
                    List.copyOf(note.getTags()),
                    note.getCreatedAt(),
                    note.getUpdatedAt()
            );
        }
    }
}
