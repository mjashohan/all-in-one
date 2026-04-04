package com.shohan.allinone.controller;

import com.shohan.allinone.dto.ServiceRequestDto;
import com.shohan.allinone.service.ServiceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    /** Any authenticated user can submit a request */
    @PostMapping
    public ResponseEntity<ServiceRequestDto.Response> create(
            @Valid @RequestBody ServiceRequestDto.Request request,
            @AuthenticationPrincipal UserDetails currentUser) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceRequestService.create(request, currentUser.getUsername()));
    }

    /** Authenticated user sees their own requests */
    @GetMapping("/my")
    public ResponseEntity<List<ServiceRequestDto.Response>> getMyRequests(
            @AuthenticationPrincipal UserDetails currentUser) {
        return ResponseEntity.ok(
                serviceRequestService.getByCurrentUser(currentUser.getUsername()));
    }

    /** Admin: view all requests */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ServiceRequestDto.Response>> getAll() {
        return ResponseEntity.ok(serviceRequestService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceRequestDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getById(id));
    }

    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ServiceRequestDto.Response>> getByStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(serviceRequestService.getByStatus(status));
    }

    /** Admin: update status (PENDING → IN_PROGRESS → DONE etc.) */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceRequestDto.Response> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequestDto.StatusUpdate update) {
        return ResponseEntity.ok(serviceRequestService.updateStatus(id, update));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceRequestService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
