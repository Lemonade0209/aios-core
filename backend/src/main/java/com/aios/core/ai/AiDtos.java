package com.aios.core.ai;

import com.aios.core.search.SearchDtos.SearchResult;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AiDtos {
    public record ChatRequest(@NotBlank String question) {}

    public record ChatResponse(String answer, List<SearchResult> relatedRecords, boolean usedOpenAi) {}

    public record SummaryRequest(
            @NotBlank String sourceType,
            @NotBlank String title,
            @NotBlank String content
    ) {}

    public record SummaryResponse(String summary, boolean usedOpenAi) {}
}
