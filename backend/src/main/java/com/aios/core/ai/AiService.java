package com.aios.core.ai;

import com.aios.core.ai.AiDtos.ChatResponse;
import com.aios.core.document.DocumentRepository;
import com.aios.core.note.NoteRepository;
import com.aios.core.project.ProjectRepository;
import com.aios.core.search.SearchDtos.SearchResult;
import com.aios.core.task.TaskRepository;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiService {
    private final ProjectRepository projects;
    private final TaskRepository tasks;
    private final NoteRepository notes;
    private final DocumentRepository documents;
    private final AIChatMessageRepository chatMessages;
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;
    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

    public AiService(
            ProjectRepository projects,
            TaskRepository tasks,
            NoteRepository notes,
            DocumentRepository documents,
            AIChatMessageRepository chatMessages,
            UserService userService,
            ObjectMapper objectMapper,
            @Value("${aios.openai.api-key:}") String apiKey,
            @Value("${aios.openai.model:gpt-4o-mini}") String model
    ) {
        this.projects = projects;
        this.tasks = tasks;
        this.notes = notes;
        this.documents = documents;
        this.chatMessages = chatMessages;
        this.userService = userService;
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    @Transactional
    public ChatResponse chat(String question) {
        AppUser user = userService.currentUser();
        List<SearchResult> context = collectContext(user, question, 8);
        if (context.isEmpty()) {
            String answer = "I could not find enough project, task, note, or document context to answer that. Add or search for relevant internal records first.";
            saveChat(user, question, answer);
            return new ChatResponse(answer, context, false);
        }

        String contextText = context.stream()
                .map(r -> r.sourceType() + " #" + r.sourceId() + " " + r.title() + ": " + r.excerpt())
                .reduce("", (a, b) -> a + "\n" + b);
        String prompt = """
                Answer using only the internal AIOS records below. Do not invent records.
                If the context is insufficient, say what is missing.

                Internal records:
                %s

                Question: %s
                """.formatted(contextText, question);
        String answer = callOpenAi(prompt);
        boolean usedOpenAi = answer != null;
        if (answer == null) {
            answer = "Based on matching internal records, these items look relevant:\n" + contextText;
        }
        saveChat(user, question, answer);
        return new ChatResponse(answer, context, usedOpenAi);
    }

    public String summarize(String sourceType, String title, String content) {
        String prompt = "Summarize this " + sourceType + " for a productivity dashboard. Keep it concise.\nTitle: "
                + title + "\nContent:\n" + content;
        String answer = callOpenAi(prompt);
        if (answer != null) {
            return answer;
        }
        String normalized = content == null ? "" : content.strip().replaceAll("\\s+", " ");
        if (normalized.isBlank()) {
            return "No content available to summarize.";
        }
        return normalized.length() <= 240 ? normalized : normalized.substring(0, 237) + "...";
    }

    @Transactional(readOnly = true)
    public List<SearchResult> collectContext(AppUser user, String query, int limit) {
        String q = query.toLowerCase(Locale.ROOT);
        List<SearchResult> results = new ArrayList<>();
        projects.findByUserOrderByUpdatedAtDesc(user).forEach(p -> results.add(score("PROJECT", p.getId(), p.getTitle(), join(p.getDescription(), p.getGoal()), q)));
        tasks.findByUserOrderByUpdatedAtDesc(user).forEach(t -> results.add(score("TASK", t.getId(), t.getTitle(), t.getDescription(), q)));
        notes.findByUserOrderByUpdatedAtDesc(user).forEach(n -> results.add(score("NOTE", n.getId(), n.getTitle(), n.getContent(), q)));
        documents.findByUserOrderByUpdatedAtDesc(user).forEach(d -> results.add(score("DOCUMENT", d.getId(), d.getTitle(), join(d.getContent(), d.getSummary()), q)));
        return results.stream()
                .filter(r -> r.score() > 0)
                .sorted(Comparator.comparingDouble(SearchResult::score).reversed())
                .limit(limit)
                .toList();
    }

    private SearchResult score(String type, Long id, String title, String text, String query) {
        String safeText = text == null ? "" : text;
        String haystack = (title + " " + safeText).toLowerCase(Locale.ROOT);
        double score = haystack.contains(query) ? 1.0 : 0.0;
        for (String token : query.split("\\s+")) {
            if (!token.isBlank() && haystack.contains(token)) {
                score += 0.25;
            }
        }
        String excerpt = safeText.length() <= 220 ? safeText : safeText.substring(0, 217) + "...";
        return new SearchResult(type, id, title, excerpt, score);
    }

    private String callOpenAi(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            return null;
        }
        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", "You are AIOS-Core's assistant. Use provided context only."),
                            Map.of("role", "user", "content", prompt)
                    ),
                    "temperature", 0.2
            );
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body), StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return null;
            }
            JsonNode root = objectMapper.readTree(response.body());
            return root.path("choices").path(0).path("message").path("content").asText(null);
        } catch (Exception ex) {
            return null;
        }
    }

    private void saveChat(AppUser user, String question, String answer) {
        AIChatMessage message = new AIChatMessage();
        message.setUser(user);
        message.setQuestion(question);
        message.setAnswer(answer);
        chatMessages.save(message);
    }

    private String join(String left, String right) {
        return (left == null ? "" : left) + " " + (right == null ? "" : right);
    }
}
