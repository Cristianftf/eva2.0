package com.backendeva.backend.config;

import com.backendeva.backend.model.User;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario administrador si no existe
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = new User();
            admin.setNombre("admin");
            admin.setApellido("");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("12344321"));
            admin.setRol("ADMIN");
            admin.setActivo(true);
            admin.setFechaRegistro(LocalDate.now());

            userRepository.save(admin);
            System.out.println("Usuario administrador creado: admin@gmail.com / 12344321");
        }
    }
}