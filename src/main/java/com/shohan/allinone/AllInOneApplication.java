package com.shohan.allinone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.shohan.allinone.entity")
@EnableJpaRepositories(basePackages = "com.shohan.allinone.repository")
public class AllInOneApplication {

    public static void main(String[] args) {
        SpringApplication.run(AllInOneApplication.class, args);
    }

}
