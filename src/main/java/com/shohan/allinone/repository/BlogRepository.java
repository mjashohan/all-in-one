package com.shohan.allinone.repository;

import com.shohan.allinone.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(exported = false)
public interface BlogRepository extends JpaRepository<Blog, Long> {

    List<Blog> findByCategory(String category);

    List<Blog> findByTitleContainingIgnoreCase(String keyword);

    List<Blog> findAllByOrderByPublishedDateDesc();

    Optional<Blog> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
