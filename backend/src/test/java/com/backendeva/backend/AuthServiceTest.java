package com.backendeva.backend;

import com.backendeva.backend.dto.RegisterDto;
import com.backendeva.backend.dto.LoginDto;
import com.backendeva.backend.model.User;
import com.backendeva.backend.repository.UserRepository;
import com.backendeva.backend.services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SuppressWarnings("null")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUser() {
        // Given
        RegisterDto registerDto = new RegisterDto();
        registerDto.setEmail("test@example.com");
        registerDto.setPassword("password");
        registerDto.setNombre("Test");
        registerDto.setApellido("User");
        registerDto.setRol("ESTUDIANTE");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");

        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.findByEmail(any())).thenReturn(java.util.Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        User result = authService.register(registerDto);

        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        verify(passwordEncoder).encode("password");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testLoginUserSuccess() {
        // Given
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("test@example.com");
        loginDto.setPassword("password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setRol("ESTUDIANTE");

        when(userRepository.findFirstByEmailOrderByIdAsc("test@example.com")).thenReturn(Optional.of(user));

        // When
        User result = authService.login(loginDto);

        // Then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void testLoginUserInvalidCredentials() {
        // Given
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("test@example.com");
        loginDto.setPassword("password");

        when(userRepository.findFirstByEmailOrderByIdAsc("test@example.com")).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            authService.login(loginDto);
        });
    }
}