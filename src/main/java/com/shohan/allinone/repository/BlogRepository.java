package com.shohan.allinone.repository;

import com.shohan.allinone.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface BlogRepository extends JpaRepository<Blog, Long> {

    List<Blog> findByCategory(String category);

    List<Blog> findByTitleContainingIgnoreCase(String keyword);

    List<Blog> findAllByOrderByPublishedDateDesc();
}
