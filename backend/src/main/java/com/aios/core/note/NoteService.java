package com.aios.core.note;

import com.aios.core.global.exception.ApiException;
import com.aios.core.note.NoteDtos.NoteRequest;
import com.aios.core.note.NoteDtos.NoteResponse;
import com.aios.core.project.ProjectService;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteService {
    private final NoteRepository notes;
    private final UserService userService;
    private final ProjectService projectService;

    public NoteService(NoteRepository notes, UserService userService, ProjectService projectService) {
        this.notes = notes;
        this.userService = userService;
        this.projectService = projectService;
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> list() {
        return notes.findByUserOrderByUpdatedAtDesc(userService.currentUser()).stream().map(NoteResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public NoteResponse get(Long id) {
        return NoteResponse.from(getOwned(id));
    }

    @Transactional
    public NoteResponse create(NoteRequest request) {
        Note note = new Note();
        note.setUser(userService.currentUser());
        apply(note, request);
        notes.save(note);
        return NoteResponse.from(note);
    }

    @Transactional
    public NoteResponse update(Long id, NoteRequest request) {
        Note note = getOwned(id);
        apply(note, request);
        return NoteResponse.from(note);
    }

    @Transactional
    public void delete(Long id) {
        notes.delete(getOwned(id));
    }

    public Note getOwned(Long id) {
        AppUser user = userService.currentUser();
        return notes.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Note not found"));
    }

    private void apply(Note note, NoteRequest request) {
        note.setProject(request.projectId() == null ? null : projectService.getOwned(request.projectId()));
        note.setTitle(request.title().trim());
        note.setContent(request.content());
        note.setTags(request.tags());
    }
}
