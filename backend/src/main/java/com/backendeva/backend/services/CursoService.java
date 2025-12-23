package com.backendeva.backend.services;

import com.backendeva.backend.model.Curso;
import com.backendeva.backend.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CursoService {

    private final CursoRepository cursoRepository;

    @Cacheable(value = "courses", key = "'all'")
    public List<Curso> findAll() {
        log.debug("Obteniendo todos los cursos");
        return cursoRepository.findAll();
    }

    @Cacheable(value = "courses", key = "'page_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<Curso> findAll(@NotNull Pageable pageable) {
        log.debug("Obteniendo cursos paginados: {}", pageable);
        return cursoRepository.findAll(pageable);
    }

    @Cacheable(value = "courses", key = "'single_' + #id")
    public Optional<Curso> findById(@NotNull Long id) {
        log.debug("Buscando curso por ID: {}", id);
        return cursoRepository.findById(id);
    }

    @Transactional
    @CacheEvict(value = "courses", allEntries = true)
    public Curso save(@Valid @NotNull Curso curso) {
        log.debug("Guardando curso: {}", curso.getTitulo());

        // Validaciones adicionales
        validateCurso(curso);

        return cursoRepository.save(curso);
    }

    @Transactional
    @CacheEvict(value = "courses", allEntries = true)
    public void deleteById(@NotNull Long id) {
        log.debug("Eliminando curso por ID: {}", id);

        if (!cursoRepository.existsById(id)) {
            throw new IllegalArgumentException("Curso no encontrado con ID: " + id);
        }

        cursoRepository.deleteById(id);
    }

    @Transactional
    @CacheEvict(value = {"courses", "users"}, allEntries = true)
    public Curso update(@NotNull Long id, @Valid @NotNull Curso cursoDetails) {
        log.debug("Actualizando curso ID: {}", id);

        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado con id: " + id));

        // Validaciones
        validateCurso(cursoDetails);

        // Actualización selectiva de campos
        updateCursoFields(curso, cursoDetails);

        return cursoRepository.save(curso);
    }

    @Cacheable(value = "courses", key = "'profesor_' + #idProfesor")
    public List<Curso> getByProfesor(@NotNull Long idProfesor) {
        log.debug("Obteniendo cursos por profesor ID: {}", idProfesor);
        return cursoRepository.findByProfesorId(idProfesor);
    }

    @Cacheable(value = "courses", key = "'activos_' + #activo")
    public List<Curso> findByActivo(boolean activo) {
        log.debug("Obteniendo cursos por estado activo: {}", activo);
        return cursoRepository.findByActivo(activo);
    }

    @Cacheable(value = "courses", key = "'disponibles_estudiante_' + #estudianteId")
    public List<Curso> findCursosDisponiblesByEstudiante(Long estudianteId) {
        log.debug("Obteniendo cursos disponibles para estudiante ID: {}", estudianteId);
        return cursoRepository.findCursosDisponiblesByEstudianteId(estudianteId);
    }

    @Cacheable(value = "courses", key = "'categoria_' + #categoria")
    public List<Curso> findByCategoria(String categoria) {
        log.debug("Obteniendo cursos por categoría: {}", categoria);
        return cursoRepository.findByCategoria(categoria);
    }

    // Métodos de validación
    private void validateCurso(Curso curso) {
        if (!StringUtils.hasText(curso.getTitulo())) {
            throw new IllegalArgumentException("El título del curso es obligatorio");
        }

        if (curso.getProfesor() == null) {
            throw new IllegalArgumentException("El profesor es obligatorio");
        }

        if (curso.getDuracionEstimada() != null && curso.getDuracionEstimada() <= 0) {
            throw new IllegalArgumentException("La duración estimada debe ser mayor a 0");
        }

        if (curso.getPrecio() != null && curso.getPrecio().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El precio no puede ser negativo");
        }
    }

    private void updateCursoFields(Curso existingCurso, Curso newCurso) {
        if (StringUtils.hasText(newCurso.getTitulo())) {
            existingCurso.setTitulo(newCurso.getTitulo());
        }

        if (StringUtils.hasText(newCurso.getDescripcion())) {
            existingCurso.setDescripcion(newCurso.getDescripcion());
        }

        if (StringUtils.hasText(newCurso.getObjetivos())) {
            existingCurso.setObjetivos(newCurso.getObjetivos());
        }

        if (newCurso.getDuracionEstimada() != null) {
            existingCurso.setDuracionEstimada(newCurso.getDuracionEstimada());
        }

        if (StringUtils.hasText(newCurso.getNivel())) {
            existingCurso.setNivel(newCurso.getNivel());
        }

        if (StringUtils.hasText(newCurso.getCategoria())) {
            existingCurso.setCategoria(newCurso.getCategoria());
        }

        existingCurso.setActivo(newCurso.isActivo());

        // Actualizar campos adicionales si están presentes
        if (StringUtils.hasText(newCurso.getPrerrequisitos())) {
            existingCurso.setPrerrequisitos(newCurso.getPrerrequisitos());
        }

        if (StringUtils.hasText(newCurso.getResultadosAprendizaje())) {
            existingCurso.setResultadosAprendizaje(newCurso.getResultadosAprendizaje());
        }

        if (StringUtils.hasText(newCurso.getHabilidades())) {
            existingCurso.setHabilidades(newCurso.getHabilidades());
        }

        if (StringUtils.hasText(newCurso.getIdioma())) {
            existingCurso.setIdioma(newCurso.getIdioma());
        }

        if (newCurso.getPrecio() != null) {
            existingCurso.setPrecio(newCurso.getPrecio());
        }

        if (StringUtils.hasText(newCurso.getImagenPortada())) {
            existingCurso.setImagenPortada(newCurso.getImagenPortada());
        }

        if (StringUtils.hasText(newCurso.getEtiquetas())) {
            existingCurso.setEtiquetas(newCurso.getEtiquetas());
        }

        if (StringUtils.hasText(newCurso.getMetadataLom())) {
            existingCurso.setMetadataLom(newCurso.getMetadataLom());
        }
    }
}
