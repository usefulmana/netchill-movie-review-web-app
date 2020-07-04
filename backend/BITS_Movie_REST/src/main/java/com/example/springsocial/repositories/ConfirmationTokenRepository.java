package com.example.springsocial.repositories;

import com.example.springsocial.model.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {
    ConfirmationToken findByToken(String token);
    ConfirmationToken findByUser_Id(Long id);
}
