package com.aios.core.search;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class SearchDtos {
    public record SearchRequest(@NotBlank String query) {}

    public record SearchResult(String sourceType, Long sourceId, String title, String excerpt, double score) {}

    public record SearchResponse(String mode, List<SearchResult> results) {}
}
