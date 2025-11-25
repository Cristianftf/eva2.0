package com.backendeva.backend.repository;

import com.backendeva.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findFirstByEmailOrderByIdAsc(String email);
    List<User> findAllByEmail(String email);
    List<User> findByRol(String rol);
    long countByFechaRegistroAfter(LocalDate fecha);
}
