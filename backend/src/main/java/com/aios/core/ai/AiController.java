package com.aios.core.ai;

import com.aios.core.ai.AiDtos.ChatRequest;
import com.aios.core.ai.AiDtos.ChatResponse;
import com.aios.core.ai.AiDtos.SummaryRequest;
import com.aios.core.ai.AiDtos.SummaryResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiController {
    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return aiService.chat(request.question());
    }

    @PostMapping("/summarize")
    SummaryResponse summarize(@Valid @RequestBody SummaryRequest request) {
        String summary = aiService.summarize(request.sourceType(), request.title(), request.content());
        return new SummaryResponse(summary, false);
    }
}
