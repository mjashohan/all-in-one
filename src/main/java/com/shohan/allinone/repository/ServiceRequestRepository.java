package com.shohan.allinone.repository;

import com.shohan.allinone.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByUserId(Long userId);

    List<ServiceRequest> findByStatus(String status);

    List<ServiceRequest> findByServiceType(String serviceType);
}
