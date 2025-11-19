package com.backendeva.backend.services;

import com.backendeva.backend.dto.EstadisticasDto;
import com.backendeva.backend.repository.CursoRepository;
import com.backendeva.backend.repository.RecursoRepository;
import com.backendeva.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EstadisticasService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    public EstadisticasDto getEstadisticasGenerales() {
        int totalUsuarios = (int) usuarioRepository.count();
        int totalCursos = (int) cursoRepository.count();
        int totalRecursos = (int) recursoRepository.count();
        // Aquí se podría calcular la actividad mensual, pero por ahora se deja como 0
        int actividadMensual = 0;

        return new EstadisticasDto(totalUsuarios, totalCursos, totalRecursos, actividadMensual);
    }
}
