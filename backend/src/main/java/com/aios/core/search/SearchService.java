package com.aios.core.search;

import com.aios.core.document.DocumentRepository;
import com.aios.core.note.NoteRepository;
import com.aios.core.project.ProjectRepository;
import com.aios.core.search.SearchDtos.SearchResponse;
import com.aios.core.search.SearchDtos.SearchResult;
import com.aios.core.task.TaskRepository;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserService;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {
    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final NoteRepository notes;
    private final DocumentRepository documents;
    private final UserService userService;

    public SearchService(ProjectRepository projects, TaskRepository tasks, NoteRepository notes, DocumentRepository documents, UserService userService) {
        this.projects = projects;
        this.tasks = tasks;
        this.notes = notes;
        this.documents = documents;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public SearchResponse search(String query) {
        AppUser user = userService.currentUser();
        String q = query.toLowerCase(Locale.ROOT).trim();
        List<SearchResult> results = Stream.of(
                        projects.findByUserOrderByUpdatedAtDesc(user).stream()
                                .map(p -> score("PROJECT", p.getId(), p.getTitle(), join(p.getDescription(), p.getGoal()), q)),
                        tasks.findByUserOrderByUpdatedAtDesc(user).stream()
                                .map(t -> score("TASK", t.getId(), t.getTitle(), t.getDescription(), q)),
                        notes.findByUserOrderByUpdatedAtDesc(user).stream()
                                .map(n -> score("NOTE", n.getId(), n.getTitle(), n.getContent(), q)),
                        documents.findByUserOrderByUpdatedAtDesc(user).stream()
                                .map(d -> score("DOCUMENT", d.getId(), d.getTitle(), join(d.getContent(), d.getSummary()), q))
                )
                .flatMap(s -> s)
                .filter(r -> r.score() > 0)
                .sorted(Comparator.comparingDouble(SearchResult::score).reversed())
                .limit(10)
                .toList();
        return new SearchResponse("keyword-fallback", results);
    }

    private SearchResult score(String type, Long id, String title, String text, String query) {
        String haystack = (title + " " + text).toLowerCase(Locale.ROOT);
        double score = haystack.contains(query) ? 1.0 : 0.0;
        for (String token : query.split("\\s+")) {
            if (!token.isBlank() && haystack.contains(token)) {
                score += 0.25;
            }
        }
        return new SearchResult(type, id, title, excerpt(text), score);
    }

    private String excerpt(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        return value.length() <= 180 ? value : value.substring(0, 177) + "...";
    }

    private String join(String left, String right) {
        return (left == null ? "" : left) + " " + (right == null ? "" : right);
    }
}
