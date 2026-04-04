package com.shohan.allinone.controller;

import com.shohan.allinone.dto.BlogDto;
import com.shohan.allinone.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    /** Public */
    @GetMapping
    public ResponseEntity<List<BlogDto.Response>> getAll() {
        return ResponseEntity.ok(blogService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<BlogDto.Response>> getByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(blogService.getByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BlogDto.Response>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(blogService.search(keyword));
    }

    /** Admin only */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogDto.Response> create(
            @Valid @RequestBody BlogDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogDto.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody BlogDto.Request request) {
        return ResponseEntity.ok(blogService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        blogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
