package com.aios.core.dashboard;

import com.aios.core.dashboard.DashboardDtos.DashboardResponse;
import com.aios.core.document.DocumentDtos.DocumentResponse;
import com.aios.core.document.DocumentRepository;
import com.aios.core.note.NoteDtos.NoteResponse;
import com.aios.core.note.NoteRepository;
import com.aios.core.project.ProjectDtos.ProjectResponse;
import com.aios.core.project.ProjectRepository;
import com.aios.core.task.TaskDtos.TaskResponse;
import com.aios.core.task.TaskRepository;
import com.aios.core.task.TaskStatus;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final TaskRepository tasks;
    private final ProjectRepository projects;
    private final NoteRepository notes;
    private final DocumentRepository documents;
    private final UserService userService;

    public DashboardService(TaskRepository tasks, ProjectRepository projects, NoteRepository notes, DocumentRepository documents, UserService userService) {
        this.tasks = tasks;
        this.projects = projects;
        this.notes = notes;
        this.documents = documents;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public DashboardResponse get() {
        AppUser user = userService.currentUser();
        LocalDate today = LocalDate.now();
        List<TaskResponse> todaysTasks = tasks.findByUserAndDueDateAndStatusNotOrderByDueDateAsc(user, today, TaskStatus.DONE)
                .stream().map(TaskResponse::from).toList();
        List<TaskResponse> overdueTasks = tasks.findByUserAndDueDateBeforeAndStatusNotOrderByDueDateAsc(user, today, TaskStatus.DONE)
                .stream().map(TaskResponse::from).toList();
        List<ProjectResponse> projectResponses = projects.findByUserOrderByUpdatedAtDesc(user).stream()
                .map(project -> {
                    long total = tasks.countByProject(project);
                    long done = tasks.countByProjectAndStatus(project, TaskStatus.DONE);
                    int progress = total == 0 ? 0 : (int) Math.round(done * 100.0 / total);
                    return ProjectResponse.from(project, progress);
                })
                .toList();
        List<String> recommendations = recommendations(todaysTasks, overdueTasks, projectResponses);
        return new DashboardResponse(
                todaysTasks,
                overdueTasks,
                projectResponses,
                notes.findTop10ByUserOrderByUpdatedAtDesc(user).stream().map(NoteResponse::from).toList(),
                documents.findTop10ByUserOrderByUpdatedAtDesc(user).stream().map(DocumentResponse::from).toList(),
                recommendations
        );
    }

    private List<String> recommendations(List<TaskResponse> today, List<TaskResponse> overdue, List<ProjectResponse> projects) {
        List<String> values = new ArrayList<>();
        if (!overdue.isEmpty()) {
            values.add("Clear or reschedule " + overdue.size() + " overdue task(s) before taking on new work.");
        }
        if (!today.isEmpty()) {
            values.add("Focus on today's " + today.size() + " due task(s).");
        }
        projects.stream()
                .filter(project -> project.progress() < 50)
                .findFirst()
                .ifPresent(project -> values.add("Review project \"" + project.title() + "\" because progress is below 50%."));
        if (values.isEmpty()) {
            values.add("No urgent recommendations yet. Add tasks with due dates to improve planning signals.");
        }
        return values;
    }
}
