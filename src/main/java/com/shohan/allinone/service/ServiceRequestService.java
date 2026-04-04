package com.shohan.allinone.service;

import com.shohan.allinone.dto.ServiceRequestDto;
import com.shohan.allinone.entity.ServiceRequest;
import com.shohan.allinone.entity.User;
import com.shohan.allinone.repository.ServiceRequestRepository;
import com.shohan.allinone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository           userRepository;

    @Transactional
    public ServiceRequestDto.Response create(ServiceRequestDto.Request request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        ServiceRequest entity = ServiceRequest.builder()
                .user(user)
                .serviceType(request.getServiceType())
                .description(request.getDescription())
                .status("PENDING")
                .build();

        return toResponse(serviceRequestRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDto.Response> getAll() {
        return serviceRequestRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ServiceRequestDto.Response getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDto.Response> getByCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return serviceRequestRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestDto.Response> getByStatus(String status) {
        return serviceRequestRepository.findByStatus(status.toUpperCase())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ServiceRequestDto.Response updateStatus(Long id, ServiceRequestDto.StatusUpdate update) {
        ServiceRequest entity = findOrThrow(id);
        entity.setStatus(update.getStatus().toUpperCase());
        return toResponse(serviceRequestRepository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!serviceRequestRepository.existsById(id)) {
            throw new NoSuchElementException("ServiceRequest not found with id: " + id);
        }
        serviceRequestRepository.deleteById(id);
    }

    /* ── Helpers ── */

    private ServiceRequest findOrThrow(Long id) {
        return serviceRequestRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ServiceRequest not found with id: " + id));
    }

    private ServiceRequestDto.Response toResponse(ServiceRequest s) {
        return ServiceRequestDto.Response.builder()
                .id(s.getId())
                .userId(s.getUser() != null ? s.getUser().getId() : null)
                .username(s.getUser() != null ? s.getUser().getUsername() : null)
                .serviceType(s.getServiceType())
                .status(s.getStatus())
                .description(s.getDescription())
                .build();
    }
}
