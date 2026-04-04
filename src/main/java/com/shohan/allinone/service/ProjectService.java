package com.shohan.allinone.service;

import com.shohan.allinone.dto.ProjectDto;
import com.shohan.allinone.entity.Project;
import com.shohan.allinone.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public ProjectDto.Response create(ProjectDto.Request request) {
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .link(request.getLink())
                .build();
        return toResponse(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public List<ProjectDto.Response> getAll() {
        return projectRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDto.Response getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<ProjectDto.Response> search(String keyword) {
        return projectRepository.findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProjectDto.Response update(Long id, ProjectDto.Request request) {
        Project project = findOrThrow(id);
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setImageUrl(request.getImageUrl());
        project.setLink(request.getLink());
        return toResponse(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new NoSuchElementException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    /* ── Helpers ── */

    private Project findOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Project not found with id: " + id));
    }

    private ProjectDto.Response toResponse(Project p) {
        return ProjectDto.Response.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .imageUrl(p.getImageUrl())
                .link(p.getLink())
                .build();
    }
}
