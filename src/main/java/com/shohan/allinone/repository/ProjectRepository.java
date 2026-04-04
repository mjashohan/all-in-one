package com.shohan.allinone.repository;

import com.shohan.allinone.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByTitleContainingIgnoreCase(String keyword);
}
