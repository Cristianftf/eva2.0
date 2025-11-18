package com.backendeva.backend.controller;

import com.backendeva.backend.dto.AuthResponseDto;
import com.backendeva.backend.dto.LoginDto;
import com.backendeva.backend.dto.RegisterDto;
import com.backendeva.backend.model.User;
import com.backendeva.backend.services.AuthService;
import com.backendeva.backend.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody RegisterDto registerDto) {
        User user = authService.register(registerDto);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponseDto(token, user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto) {
        User user = authService.login(loginDto);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponseDto(token, user));
    }
}
