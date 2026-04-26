package com.shohan.allinone.service;

import com.shohan.allinone.dto.BlogDto;
import com.shohan.allinone.entity.Blog;
import com.shohan.allinone.repository.BlogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;

    @Transactional
    public BlogDto.Response create(BlogDto.Request request) {
        Blog blog = Blog.builder()
                .title(request.getTitle())
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
        return toResponse(blogRepository.save(blog));
    }

    @Transactional
    public void delete(Long id) {
        if (!blogRepository.existsById(id)) {
            throw new NoSuchElementException("Blog not found with id: " + id);
        }
        blogRepository.deleteById(id);
    }

    /* ── Helpers ── */

    private Blog findOrThrow(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Blog not found with id: " + id));
    }

    private BlogDto.Response toResponse(Blog b) {
        return BlogDto.Response.builder()
                .id(b.getId())
                .title(b.getTitle())
                .content(b.getContent())
                .category(b.getCategory())
                .coverImageUrl(b.getCoverImageUrl())
                .excerpt(b.getExcerpt())
                .publishedDate(b.getPublishedDate())
                .build();
    }
}
