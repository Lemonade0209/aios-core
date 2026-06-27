package com.aios.core.document;

import com.aios.core.document.DocumentDtos.DocumentRequest;
import com.aios.core.document.DocumentDtos.DocumentResponse;
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
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    List<DocumentResponse> list() {
        return documentService.list();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    DocumentResponse create(@Valid @RequestBody DocumentRequest request) {
        return documentService.create(request);
    }

    @GetMapping("/{documentId}")
    DocumentResponse get(@PathVariable Long documentId) {
        return documentService.get(documentId);
    }

    @PutMapping("/{documentId}")
    DocumentResponse update(@PathVariable Long documentId, @Valid @RequestBody DocumentRequest request) {
        return documentService.update(documentId, request);
    }

    @PostMapping("/{documentId}/summarize")
    DocumentResponse summarize(@PathVariable Long documentId) {
        return documentService.summarize(documentId);
    }

    @DeleteMapping("/{documentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void delete(@PathVariable Long documentId) {
        documentService.delete(documentId);
    }
}
