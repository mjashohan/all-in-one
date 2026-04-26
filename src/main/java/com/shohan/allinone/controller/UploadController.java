package com.shohan.allinone.controller;

import com.shohan.allinone.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    /**
     * Admin-only. Receives a multipart file, validates it, and returns
     * the public URL to use as the cover image.
     */
    @PostMapping(value = "/blog-covers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UploadResponse> uploadBlogCover(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeBlogCover(file);
        return ResponseEntity.ok(new UploadResponse(url));
    }

    /**
     * Public. Streams a stored cover image with safe response headers:
     *   - Content-Type derived from the (server-controlled) extension
     *   - Content-Disposition: inline so the browser renders, not downloads
     *   - X-Content-Type-Options: nosniff so the browser won't reinterpret it
     *   - Cache-Control: long-lived because filenames are immutable UUIDs
     *
     * The {filename:.+} matcher includes the extension, which Spring would
     * otherwise strip from the path variable.
     */
    @GetMapping("/blog-covers/{filename:.+}")
    public ResponseEntity<Resource> getBlogCover(@PathVariable String filename) {
        Resource resource    = fileStorageService.loadBlogCover(filename);
        String   contentType = fileStorageService.getContentType(filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .header("X-Content-Type-Options", "nosniff")
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000, immutable")
                .body(resource);
    }

    public record UploadResponse(String url) {}
}