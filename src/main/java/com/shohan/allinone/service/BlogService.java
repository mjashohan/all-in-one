package com.shohan.allinone.service;

import com.shohan.allinone.dto.BlogDto;
import com.shohan.allinone.entity.Blog;
import com.shohan.allinone.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    @Transactional
    public BlogDto.Response create(BlogDto.Request request) {
        Blog blog = Blog.builder()
                .title(request.getTitle())
                .slug(generateUniqueSlug(request.getTitle()))
                .content(request.getContent())
                .category(request.getCategory())
                .coverImageUrl(request.getCoverImageUrl())
                .excerpt(request.getExcerpt())
                .build();
        return toResponse(blogRepository.save(blog));
    }

    @Transactional(readOnly = true)
    public List<BlogDto.Response> getAll() {
        return blogRepository.findAllByOrderByPublishedDateDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BlogDto.Response getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<BlogDto.Response> getByCategory(String category) {
        return blogRepository.findByCategory(category)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BlogDto.Response> search(String keyword) {
        return blogRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BlogDto.Response update(Long id, BlogDto.Request request) {
        Blog blog = findOrThrow(id);
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setCategory(request.getCategory());
        blog.setCoverImageUrl(request.getCoverImageUrl());
        blog.setExcerpt(request.getExcerpt());
        // Slug is intentionally NOT regenerated. Stable URLs are an SEO contract —
        // once a post is live, its URL shouldn't change just because the title was tweaked.
        return toResponse(blogRepository.save(blog));
    }

    @Transactional
    public void delete(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new NoSuchElementException("Blog not found with id: " + id);
        }
        blogRepository.deleteById(id);
    }

    /* ──────────────────────────────────────────────────────────────────────
       Helpers
       ────────────────────────────────────────────────────────────────────── */

    private Blog findOrThrow(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Blog not found with id: " + id));
    }

    private BlogDto.Response toResponse(Blog b) {
        return BlogDto.Response.builder()
                .id(b.getId())
                .title(b.getTitle())
                .slug(b.getSlug())
                .content(b.getContent())
                .category(b.getCategory())
                .coverImageUrl(b.getCoverImageUrl())
                .excerpt(b.getExcerpt())
                .publishedDate(b.getPublishedDate())
                .build();
    }

    /**
     * Generate a URL-friendly, unique slug from a title.
     * "Hello, World! 2026" → "hello-world-2026"
     * Collisions get "-2", "-3", etc. appended. Pathological cases get a UUID suffix.
     */
    private String generateUniqueSlug(String title) {
        String base = slugify(title);
        if (base.isEmpty()) base = "post";

        String candidate = base;
        int counter = 2;
        while (blogRepository.existsBySlug(candidate)) {
            candidate = base + "-" + counter++;
            if (counter > 100) {
                // Should never realistically happen — bail out with a guaranteed-unique suffix.
                candidate = base + "-" + UUID.randomUUID().toString().substring(0, 8);
                break;
            }
        }
        return candidate;
    }

    private String slugify(String input) {
        if (input == null) return "";
        // Normalize accented characters (é → e, ñ → n, etc.) before stripping.
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String slug = normalized.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")  // strip non-alphanumeric
                .replaceAll("\\s+", "-")            // spaces → hyphens
                .replaceAll("-+", "-")              // collapse hyphen runs
                .replaceAll("^-|-$", "");           // trim leading/trailing hyphens
        // Leave headroom for a "-N" or UUID suffix without exceeding the 200-char column.
        return slug.length() > 180 ? slug.substring(0, 180) : slug;
    }
}