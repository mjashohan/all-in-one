package com.shohan.allinone.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class MessageDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {

        @NotBlank(message = "Sender name is required")
        private String senderName;

        @NotBlank(message = "Sender email is required")
        @Email(message = "Invalid email format")
        private String senderEmail;

        @NotBlank(message = "Message content is required")
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private String senderName;
        private String senderEmail;
        private String content;
        private LocalDateTime sentAt;
    }
}
