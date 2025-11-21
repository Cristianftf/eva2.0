package com.backendeva.backend.services;

import com.backendeva.backend.model.User;
import com.backendeva.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    public User update(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setNombre(userDetails.getNombre());
        user.setApellido(userDetails.getApellido());
        user.setEmail(userDetails.getEmail());
        user.setRol(userDetails.getRol());
        user.setActivo(userDetails.isActivo());
        user.setFechaRegistro(userDetails.getFechaRegistro());

        return userRepository.save(user);
    }
}
