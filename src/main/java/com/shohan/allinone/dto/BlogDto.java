package com.shohan.allinone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class BlogDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Content is required")
        private String content;

        private String category;
        private String coverImageUrl;
        private String excerpt;
        // No slug here — the server generates it from the title.
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private String slug;
        private String content;
        private String category;
        private String coverImageUrl;
        private String excerpt;
        private LocalDateTime publishedDate;
    }
}