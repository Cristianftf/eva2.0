package com.backendeva.backend.services;

import com.backendeva.backend.model.User;
import com.backendeva.backend.model.Curso;
import com.backendeva.backend.repository.UserRepository;
import com.backendeva.backend.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        return userRepository.findById(java.util.Objects.requireNonNull(id));
    }

    public User save(User user) {
        return userRepository.save(java.util.Objects.requireNonNull(user));
    }

    public List<User> findByRole(String role) {
        return userRepository.findByRol(role);
    }

    @Autowired
    private CursoRepository cursoRepository;

    /**
     * Elimina un usuario con validación de integridad referencial
     * @param id ID del usuario a eliminar
     * @throws DataIntegrityViolationException si el usuario tiene cursos asociados
     */
    @Transactional
    @SuppressWarnings("null")
    public void deleteById(Long id) {
        java.util.Objects.requireNonNull(id, "ID no puede ser null");
         
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
         
        // Verificar si el usuario es profesor de cursos
        List<Curso> cursosAsociados = cursoRepository.findByProfesorId(id);
         
        if (!cursosAsociados.isEmpty()) {
            // Opción 1: Soft delete - marcar como inactivo
            marcarComoInactivo(user);
            
            // Log para auditoría
            System.out.println("Usuario " + id + " marcado como inactivo porque tiene " +
                             cursosAsociados.size() + " cursos asociados");
        } else {
            // Solo eliminar si no tiene dependencias
            userRepository.delete(user);
        }
    }
    
    /**
     * Marca un usuario como inactivo (soft delete)
     * @param user Usuario a marcar
     */
    private void marcarComoInactivo(User user) {
        user.setActivo(false);
        // Modificar email para evitar duplicados futuros
        if (user.getEmail() != null && !user.getEmail().contains("_inactive_")) {
            user.setEmail(user.getEmail() + "_inactive_" + System.currentTimeMillis());
        }
        userRepository.save(user);
    }
    
    /**
     * Verifica si un usuario tiene cursos asociados
     * @param userId ID del usuario
     * @return true si tiene cursos asociados
     */
    public boolean tieneCursosAsociados(Long userId) {
        return !cursoRepository.findByProfesorId(userId).isEmpty();
    }
    
    /**
     * Transfiere todos los cursos de un profesor a otro
     * @param profesorActualId ID del profesor actual
     * @param nuevoProfesorId ID del nuevo profesor
     */
    @Transactional
    @SuppressWarnings("null")
    public void transferirCursos(Long profesorActualId, Long nuevoProfesorId) {
        java.util.Objects.requireNonNull(profesorActualId, "profesorActualId no puede ser null");
        java.util.Objects.requireNonNull(nuevoProfesorId, "nuevoProfesorId no puede ser null");
        
        User nuevoProfesor = userRepository.findById(nuevoProfesorId)
                .orElseThrow(() -> new RuntimeException("Nuevo profesor no encontrado con id: " + nuevoProfesorId));
        
        List<Curso> cursos = cursoRepository.findByProfesorId(profesorActualId);
        
        if (cursos.isEmpty()) {
            throw new RuntimeException("No se encontraron cursos para transferir");
        }
        
        // Transferir cursos
        for (Curso curso : cursos) {
            curso.setProfesor(nuevoProfesor);
        }
        
        cursoRepository.saveAll(cursos);
        
        System.out.println("Se transfirieron " + cursos.size() + " cursos del profesor " + 
                         profesorActualId + " al profesor " + nuevoProfesorId);
    }

    public User update(Long id, User userDetails) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setNombre(userDetails.getNombre());
        user.setApellido(userDetails.getApellido());
        user.setEmail(userDetails.getEmail());
        user.setRol(userDetails.getRol());
        user.setActivo(userDetails.isActivo());
        user.setFechaRegistro(userDetails.getFechaRegistro());
        user.setLastSeen(userDetails.getLastSeen());
        user.setLastSeen(userDetails.getLastSeen());

        return userRepository.save(user);
    }

    @SuppressWarnings("null")
    public User updateUser(User user) {
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
                    userRepository.deleteById(java.util.Objects.requireNonNull(user.getId()));
                });
                deleted += usersWithEmail.size() - 1;
            }
        }

        return deleted;
    }
}
