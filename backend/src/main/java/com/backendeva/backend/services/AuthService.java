package com.backendeva.backend.services;

import com.backendeva.backend.dto.LoginDto;
import com.backendeva.backend.dto.RegisterDto;
import com.backendeva.backend.model.User;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    public User register(RegisterDto registerDto) {
        User user = new User();
        user.setNombre(registerDto.getNombre());
        user.setApellido(registerDto.getApellido());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRol(registerDto.getRol());
        user.setActivo(true); // Nuevo campo
        user.setFechaRegistro(java.time.LocalDate.now()); // Nuevo campo
        return userRepository.save(user);
    }

    public User login(LoginDto loginDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        return userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
