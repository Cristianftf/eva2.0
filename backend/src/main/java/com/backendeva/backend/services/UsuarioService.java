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

    public List<User> findByRole(String role) {
        return userRepository.findByRol(role);
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

    public int cleanDuplicateUsers() {
        List<User> allUsers = userRepository.findAll();
        List<String> emails = allUsers.stream().map(User::getEmail).distinct().toList();
        int deleted = 0;

        for (String email : emails) {
            List<User> usersWithEmail = userRepository.findAllByEmail(email);
            if (usersWithEmail.size() > 1) {
                // Keep the first one (smallest ID), delete others
                usersWithEmail.stream().skip(1).forEach(user -> {
                    userRepository.deleteById(user.getId());
                });
                deleted += usersWithEmail.size() - 1;
            }
        }

        return deleted;
    }
}
