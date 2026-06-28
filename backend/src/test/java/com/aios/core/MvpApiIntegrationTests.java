package com.aios.core;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MvpApiIntegrationTests {
    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper objectMapper;

    @Test
    void coreMvpWorkflowUsesJwtAndUserScopedData() throws Exception {
        String token = signup("owner@example.com");
        String otherToken = signup("other@example.com");
        login("owner@example.com");

        mvc.perform(get("/api/users/me").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("owner@example.com"));

        Long projectId = id(mvc.perform(post("/api/projects")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "title", "Alpha Launch",
                                "description", "Launch planning",
                                "goal", "Ship the AIOS MVP",
                                "status", "IN_PROGRESS"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Alpha Launch"))
                .andReturn().getResponse().getContentAsString());

        mvc.perform(get("/api/projects").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mvc.perform(put("/api/projects/" + projectId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "title", "Alpha Launch Updated",
                                "description", "Launch planning",
                                "goal", "Ship the AIOS MVP",
                                "status", "IN_PROGRESS"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Alpha Launch Updated"));

        mvc.perform(get("/api/projects/" + projectId).header("Authorization", bearer(otherToken)))
                .andExpect(status().isNotFound());

        Long taskId = id(mvc.perform(post("/api/tasks")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "projectId", projectId,
                                "title", "Write launch checklist",
                                "priority", "HIGH",
                                "status", "TODO"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.projectId").value(projectId))
                .andReturn().getResponse().getContentAsString());

        mvc.perform(get("/api/tasks").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        mvc.perform(get("/api/tasks/" + taskId).header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Write launch checklist"));

        mvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "projectId", projectId,
                                "title", "Write launch checklist",
                                "priority", "HIGH",
                                "status", "DONE"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"));

        Long noteId = id(mvc.perform(post("/api/notes")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "projectId", projectId,
                                "title", "Alpha notes",
                                "content", "Alpha launch depends on the checklist.",
                                "tags", new String[] {"launch", "alpha"}
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tags", hasSize(2)))
                .andReturn().getResponse().getContentAsString());

        mvc.perform(get("/api/notes").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        mvc.perform(put("/api/notes/" + noteId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "projectId", projectId,
                                "title", "Alpha notes updated",
                                "content", "Alpha launch still depends on the checklist.",
                                "tags", new String[] {"launch", "alpha"}
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Alpha notes updated"));

        Long documentId = id(mvc.perform(post("/api/documents")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "projectId", projectId,
                                "title", "Alpha brief",
                                "content", "This document explains the Alpha launch scope and MVP acceptance criteria."
                        ))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());

        mvc.perform(get("/api/documents").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
        mvc.perform(put("/api/documents/" + documentId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of(
                                "projectId", projectId,
                                "title", "Alpha brief updated",
                                "content", "This document explains the Alpha launch scope and MVP acceptance criteria."
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Alpha brief updated"));

        mvc.perform(post("/api/documents/" + documentId + "/summarize").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.summary", containsString("Alpha launch")));

        mvc.perform(get("/api/dashboard").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projects", hasSize(1)))
                .andExpect(jsonPath("$.recentNotes", hasSize(1)))
                .andExpect(jsonPath("$.recentDocuments", hasSize(1)));

        mvc.perform(post("/api/search/semantic")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("query", "Alpha launch"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mode").value("keyword-fallback"))
                .andExpect(jsonPath("$.results").isArray());

        mvc.perform(post("/api/ai/chat")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("question", "What is the Alpha launch status?"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.relatedRecords").isArray());

        mvc.perform(delete("/api/notes/" + noteId).header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
        mvc.perform(delete("/api/documents/" + documentId).header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
        mvc.perform(delete("/api/tasks/" + taskId).header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
        mvc.perform(delete("/api/projects/" + projectId).header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
    }

    private String signup(String email) throws Exception {
        String body = mvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", email, "password", "password123", "name", email))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).path("accessToken").asText();
    }

    private String login(String email) throws Exception {
        String body = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", email, "password", "password123"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).path("accessToken").asText();
    }

    private Long id(String json) throws Exception {
        JsonNode node = objectMapper.readTree(json);
        return node.path("id").asLong();
    }

    private String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
