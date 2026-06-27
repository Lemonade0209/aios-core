package com.aios.core.project;

import com.aios.core.global.exception.ApiException;
import com.aios.core.project.ProjectDtos.ProjectRequest;
import com.aios.core.project.ProjectDtos.ProjectResponse;
import com.aios.core.task.TaskRepository;
import com.aios.core.task.TaskStatus;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final UserService userService;

    public ProjectService(ProjectRepository projects, TaskRepository tasks, UserService userService) {
        this.projects = projects;
        this.tasks = tasks;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> list() {
        AppUser user = userService.currentUser();
        return projects.findByUserOrderByUpdatedAtDesc(user).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse get(Long id) {
        return toResponse(getOwned(id));
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        AppUser user = userService.currentUser();
        Project project = new Project();
        project.setUser(user);
        apply(project, request);
        projects.save(project);
        return toResponse(project);
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = getOwned(id);
        apply(project, request);
        return toResponse(project);
    }

    @Transactional
    public void delete(Long id) {
        projects.delete(getOwned(id));
    }

    public Project getOwned(Long id) {
        AppUser user = userService.currentUser();
        return projects.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private void apply(Project project, ProjectRequest request) {
        project.setTitle(request.title().trim());
        project.setDescription(request.description());
        project.setGoal(request.goal());
        project.setStatus(request.status() == null ? ProjectStatus.PLANNED : request.status());
        project.setStartDate(request.startDate());
        project.setDueDate(request.dueDate());
    }

    private ProjectResponse toResponse(Project project) {
        long total = tasks.countByProject(project);
        long done = tasks.countByProjectAndStatus(project, TaskStatus.DONE);
        int progress = total == 0 ? 0 : (int) Math.round(done * 100.0 / total);
        return ProjectResponse.from(project, progress);
    }
}
