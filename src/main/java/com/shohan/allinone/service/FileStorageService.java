package com.shohan.allinone.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

/**
 * Handles all file I/O for user-uploaded content.
 *
 * <p>Security guarantees:
 * <ul>
 *   <li>Filenames are generated server-side as UUIDs — the client's filename is never trusted or stored.</li>
 *   <li>Content type is detected from magic bytes, not from the client's Content-Type header.</li>
 *   <li>Only JPEG, PNG, GIF, and WebP are accepted. SVG is explicitly excluded (can carry JS).</li>
 *   <li>A hard server-side size cap (5 MB) backstops the multipart limit in application.properties.</li>
 *   <li>All resolved paths are verified to live inside the configured upload root (path-traversal defense).</li>
 *   <li>Files are written with CREATE_NEW, so a colliding UUID will fail rather than overwrite.</li>
 * </ul>
 */
@Slf4j
@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024; // 5 MB

    private static final int  MIN_FILE_SIZE = 12;

    private final Path coversDir;

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        Path root = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.coversDir = root.resolve("blog-covers");
    }

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(coversDir);
        log.info("Blog cover upload directory initialized at: {}", coversDir);
    }

    public String storeBlogCover(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No file was uploaded.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.CONTENT_TOO_LARGE,
                    "Image must be 5 MB or smaller.");
        }
        if (file.getSize() < MIN_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "File is too small to be a valid image.");
        }

        byte[] bytes;

        try {
            bytes = file.getBytes();
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not read uploaded file.", ex);
        }

        ImageType type = detectImageType(bytes);

        // Generate the filename ourselves; the client never gets to pick it.
        String filename = UUID.randomUUID() + "." + type.extension;
        Path target = coversDir.resolve(filename).normalize();

        if (!target.startsWith(coversDir)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file path.");
        }

        try {
            Files.write(target, bytes,
                    StandardOpenOption.CREATE_NEW,
                    StandardOpenOption.WRITE);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save file.", ex);
        }

        log.debug("Stored blog cover: {}", target);
        return "/api/uploads/blog-covers/" + filename;
    }

    public Resource loadBlogCover(String filename) {
        // Reject anything that isn't a plain filename. Legitimate values are "<uuid>.<ext>".
        if (filename == null
                || filename.isBlank()
                || filename.contains("/")
                || filename.contains("\\")
                || filename.contains("..")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filename.");
        }

        Path file = coversDir.resolve(filename).normalize();
        if (!file.startsWith(coversDir)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filename.");
        }
        if (!Files.exists(file) || !Files.isRegularFile(file)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found.");
        }

        try {
            return new UrlResource(file.toUri());
        } catch (MalformedURLException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not load file.", ex);
        }
    }

    public String getContentType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png"))                            return "image/png";
        if (lower.endsWith(".gif"))                            return "image/gif";
        if (lower.endsWith(".webp"))                           return "image/webp";
        return "application/octet-stream";
    }

    private ImageType detectImageType(byte[] b) {
        // JPEG: FF D8 FF
        if ((b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF) {
            return ImageType.JPEG;
        }
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if ((b[0] & 0xFF) == 0x89 && b[1] == 0x50 && b[2] == 0x4E && b[3] == 0x47
                && b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A) {
            return ImageType.PNG;
        }
        // GIF: "GIF87a" or "GIF89a"
        if (b[0] == 'G' && b[1] == 'I' && b[2] == 'F' && b[3] == '8'
                && (b[4] == '7' || b[4] == '9') && b[5] == 'a') {
            return ImageType.GIF;
        }
        // WebP: "RIFF"....(4 size bytes)..."WEBP"
        if (b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P') {
            return ImageType.WEBP;
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Unsupported image format. Allowed: JPEG, PNG, GIF, WebP.");
    }

    private enum ImageType {
        JPEG("jpg"),
        PNG("png"),
        GIF("gif"),
        WEBP("webp");

        final String extension;
        ImageType(String extension) { this.extension = extension; }
    }
}