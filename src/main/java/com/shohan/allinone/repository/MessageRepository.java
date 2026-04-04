package com.shohan.allinone.repository;

import com.shohan.allinone.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderEmail(String senderEmail);

    List<Message> findAllByOrderBySentAtDesc();
}
