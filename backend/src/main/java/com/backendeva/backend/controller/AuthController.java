package com.backendeva.backend.controller;

import com.backendeva.backend.config.RateLimited;
import com.backendeva.backend.dto.AuthResponseDto;
import com.backendeva.backend.dto.LoginDto;
import com.backendeva.backend.dto.RegisterDto;
import com.backendeva.backend.model.User;
import com.backendeva.backend.services.AuthService;
import com.backendeva.backend.services.JwtService;
import com.backendeva.backend.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterDto registerDto) {
        User user = authService.register(registerDto);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponseDto(token, user));
    }

    @PostMapping("/login")
    @RateLimited
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            User user = authService.login(loginDto);
            user.setLastSeen(LocalDateTime.now());
            usuarioService.updateUser(user);
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(new AuthResponseDto(token, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Credenciales inválidas"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // En JWT, logout se maneja del lado cliente eliminando el token
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = authService.getCurrentUser(email);
        user.setLastSeen(LocalDateTime.now());
        usuarioService.updateUser(user);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refreshToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        AuthResponseDto response = authService.refreshToken(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<User> actualizarPerfil(@RequestBody User updatedUser) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = authService.actualizarPerfil(email, updatedUser);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<Void> cambiarPassword(@RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        authService.cambiarPassword(email, request.getPasswordActual(), request.getPasswordNueva());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/subir-foto")
    public ResponseEntity<User> subirFotoPerfil(@RequestBody UploadPhotoRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = authService.subirFotoPerfil(email, request.getFotoUrl());
        return ResponseEntity.ok(user);
    }

    public static class ChangePasswordRequest {
        private String passwordActual;
        private String passwordNueva;

        // Getters and setters
        public String getPasswordActual() { return passwordActual; }
        public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }
        public String getPasswordNueva() { return passwordNueva; }
        public void setPasswordNueva(String passwordNueva) { this.passwordNueva = passwordNueva; }
    }

    public static class UploadPhotoRequest {
        private String fotoUrl;

        // Getters and setters
        public String getFotoUrl() { return fotoUrl; }
        public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }
    }
}
