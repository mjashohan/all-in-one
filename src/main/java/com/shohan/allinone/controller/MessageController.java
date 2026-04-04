package com.shohan.allinone.controller;

import com.shohan.allinone.dto.MessageDto;
import com.shohan.allinone.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    /** Public — contact form submission */
    @PostMapping
    public ResponseEntity<MessageDto.Response> send(
            @Valid @RequestBody MessageDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(messageService.send(request));
    }

    /** Admin only */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MessageDto.Response>> getAll() {
        return ResponseEntity.ok(messageService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.getById(id));
    }

    @GetMapping("/by-email")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MessageDto.Response>> getBySenderEmail(
            @RequestParam String email) {
        return ResponseEntity.ok(messageService.getBySenderEmail(email));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        messageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
