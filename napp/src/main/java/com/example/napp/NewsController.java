package com.example.napp;


import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")  // Allows requests from the browser extension
public class NewsController {

    private final NewsSummarizerService newsSummarizerService;

    public NewsController(NewsSummarizerService newsSummarizerService) {
        this.newsSummarizerService = newsSummarizerService;
    }

    @GetMapping("/summarize")
    public Map<String, String> summarizeNews(@RequestParam String url) throws IOException {
        String summary = newsSummarizerService.summarizeNews(url);
        return Map.of("summary", summary);
    }
}
