package com.example.napp;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import java.io.IOException;


@Service
public class NewsSummarizerService {
    private final ChatModel chatModel;

    public NewsSummarizerService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String summarizeNews(String url) throws IOException {
        String articleText = extractNewsContent(url);
        return generateSummary(articleText);
    }


    private String extractNewsContent(String url) throws IOException {
        // Ensure the URL starts with "http" to prevent processing invalid URLs
        if (!url.startsWith("http")) {
            throw new IllegalArgumentException("Invalid URL: " + url);
        }

        Document doc = Jsoup.connect(url).get();
        return doc.body().text();
    }


    private String generateSummary(String articleText) {
        String promptText = "Summarize the following news article in about 100 words. Remove any '<think>' sections and keep it concise:\n\n" + articleText;

        Prompt chatPrompt = new Prompt(promptText);
        String fullResponse = chatModel.call(chatPrompt).getResult().getOutput().getContent();

        // Remove the <think> section if it appears in the response
        String cleanedSummary = fullResponse.replaceAll("(?s)<think>.*?</think>", "").trim();

        // Ensure the summary is around 100 words
        String[] words = cleanedSummary.split("\\s+");
        if (words.length > 100) {
            cleanedSummary = String.join(" ", java.util.Arrays.copyOfRange(words, 0, 100)) + "...";
        }

        return cleanedSummary;
    }
}
