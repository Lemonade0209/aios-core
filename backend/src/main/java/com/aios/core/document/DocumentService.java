package com.aios.core.document;

import com.aios.core.ai.AiService;
import com.aios.core.document.DocumentDtos.DocumentRequest;
import com.aios.core.document.DocumentDtos.DocumentResponse;
import com.aios.core.global.exception.ApiException;
import com.aios.core.project.ProjectService;
import com.aios.core.user.AppUser;
import com.aios.core.user.UserService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DocumentService {
    private final DocumentRepository documents;
    private final UserService userService;
    private final ProjectService projectService;
    private final AiService aiService;

    public DocumentService(DocumentRepository documents, UserService userService, ProjectService projectService, AiService aiService) {
        this.documents = documents;
        this.userService = userService;
        this.projectService = projectService;
        this.aiService = aiService;
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> list() {
        return documents.findByUserOrderByUpdatedAtDesc(userService.currentUser()).stream().map(DocumentResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public DocumentResponse get(Long id) {
        return DocumentResponse.from(getOwned(id));
    }

    @Transactional
    public DocumentResponse create(DocumentRequest request) {
        DocumentEntity document = new DocumentEntity();
        document.setUser(userService.currentUser());
        apply(document, request);
        documents.save(document);
        return DocumentResponse.from(document);
    }

    @Transactional
    public DocumentResponse update(Long id, DocumentRequest request) {
        DocumentEntity document = getOwned(id);
        apply(document, request);
        return DocumentResponse.from(document);
    }

    @Transactional
    public DocumentResponse summarize(Long id) {
        DocumentEntity document = getOwned(id);
        document.setSummary(aiService.summarize("document", document.getTitle(), document.getContent()));
        return DocumentResponse.from(document);
    }

    @Transactional
    public void delete(Long id) {
        documents.delete(getOwned(id));
    }

    public DocumentEntity getOwned(Long id) {
        AppUser user = userService.currentUser();
        return documents.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Document not found"));
    }

    private void apply(DocumentEntity document, DocumentRequest request) {
        document.setProject(request.projectId() == null ? null : projectService.getOwned(request.projectId()));
        document.setTitle(request.title().trim());
        document.setContent(request.content());
        document.setSummary(request.summary());
    }
}
