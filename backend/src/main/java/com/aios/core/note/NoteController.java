package com.aios.core.note;

import com.aios.core.note.NoteDtos.NoteRequest;
import com.aios.core.note.NoteDtos.NoteResponse;
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
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    List<NoteResponse> list() {
        return noteService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    NoteResponse create(@Valid @RequestBody NoteRequest request) {
        return noteService.create(request);
    }

    @GetMapping("/{noteId}")
    NoteResponse get(@PathVariable Long noteId) {
        return noteService.get(noteId);
    }

    @PutMapping("/{noteId}")
    NoteResponse update(@PathVariable Long noteId, @Valid @RequestBody NoteRequest request) {
        return noteService.update(noteId, request);
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long noteId) {
        noteService.delete(noteId);
    }
}
