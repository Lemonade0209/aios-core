package com.aios.core.search;

import com.aios.core.search.SearchDtos.SearchRequest;
import com.aios.core.search.SearchDtos.SearchResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @PostMapping("/semantic")
    SearchResponse semantic(@Valid @RequestBody SearchRequest request) {
        return searchService.search(request.query());
    }
}
