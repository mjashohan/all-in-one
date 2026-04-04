package com.shohan.allinone.service;

import com.shohan.allinone.dto.MessageDto;
import com.shohan.allinone.entity.Message;
import com.shohan.allinone.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    @Transactional
    public MessageDto.Response send(MessageDto.Request request) {
        Message message = Message.builder()
                .senderName(request.getSenderName())
                .senderEmail(request.getSenderEmail())
                .content(request.getContent())
                .build();
        return toResponse(messageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public List<MessageDto.Response> getAll() {
        return messageRepository.findAllByOrderBySentAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MessageDto.Response getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<MessageDto.Response> getBySenderEmail(String email) {
        return messageRepository.findBySenderEmail(email)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        if (!messageRepository.existsById(id)) {
            throw new NoSuchElementException("Message not found with id: " + id);
        }
        messageRepository.deleteById(id);
    }

    /* ── Helpers ── */

    private Message findOrThrow(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Message not found with id: " + id));
    }

    private MessageDto.Response toResponse(Message m) {
        return MessageDto.Response.builder()
                .id(m.getId())
                .senderName(m.getSenderName())
                .senderEmail(m.getSenderEmail())
                .content(m.getContent())
                .sentAt(m.getSentAt())
                .build();
    }
}
