package com.aios.core.dashboard;

import com.aios.core.document.DocumentDtos.DocumentResponse;
import com.aios.core.note.NoteDtos.NoteResponse;
import com.aios.core.project.ProjectDtos.ProjectResponse;
import com.aios.core.task.TaskDtos.TaskResponse;
import java.util.List;

public class DashboardDtos {
    public record DashboardResponse(
            List<TaskResponse> todaysTasks,
            List<TaskResponse> overdueTasks,
            List<ProjectResponse> projects,
            List<NoteResponse> recentNotes,
            List<DocumentResponse> recentDocuments,
            List<String> aiRecommendations
    ) {}
}
