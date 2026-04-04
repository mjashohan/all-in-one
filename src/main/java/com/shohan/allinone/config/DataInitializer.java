package com.shohan.allinone.config;

import com.shohan.allinone.entity.Role;
import com.shohan.allinone.entity.User;
import com.shohan.allinone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedAdminUser() {
        return args -> {
            if (userRepository.existsByUsername("admin")) {
                log.info("Admin user already exists — skipping seed.");
                return;
            }

            User admin = User.builder()
                    .username("admin")
                    .email("admin@allinone.com")
                    .password(passwordEncoder.encode("amishohan"))
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(admin);
            log.info("Default admin user created  →  username: admin  |  password: amishohan");
        };
    }
}
