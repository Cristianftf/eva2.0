package com.backendeva.backend.services;

import com.backendeva.backend.dto.AuthResponseDto;
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

    @Autowired
    private JwtService jwtService;

    public User register(RegisterDto registerDto) {
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }
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

        return userRepository.findFirstByEmailOrderByIdAsc(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getCurrentUser(String email) {
        return userRepository.findFirstByEmailOrderByIdAsc(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AuthResponseDto refreshToken(String email) {
        User user = getCurrentUser(email);
        String token = jwtService.generateToken(user);
        return new AuthResponseDto(token, user);
    }

    public User actualizarPerfil(String email, User updatedUser) {
        User user = getCurrentUser(email);
        user.setNombre(updatedUser.getNombre());
        user.setApellido(updatedUser.getApellido());
        user.setEmail(updatedUser.getEmail());
        // No actualizar password aquí
        return userRepository.save(user);
    }

    public void cambiarPassword(String email, String passwordActual, String passwordNueva) {
        User user = getCurrentUser(email);
        if (!passwordEncoder.matches(passwordActual, user.getPassword())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }
        user.setPassword(passwordEncoder.encode(passwordNueva));
        userRepository.save(user);
    }

    public User subirFotoPerfil(String email, String fotoUrl) {
        User user = getCurrentUser(email);
        user.setFotoPerfil(fotoUrl);
        return userRepository.save(user);
    }
}
