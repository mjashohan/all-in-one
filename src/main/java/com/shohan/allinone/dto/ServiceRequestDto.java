package com.shohan.allinone.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ServiceRequestDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {

        @NotBlank(message = "Service type is required")
        private String serviceType;

        @NotBlank(message = "Description is required")
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long userId;
        private String username;
        private String serviceType;
        private String status;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdate {
        @NotBlank(message = "Status is required")
        private String status;
    }
}
