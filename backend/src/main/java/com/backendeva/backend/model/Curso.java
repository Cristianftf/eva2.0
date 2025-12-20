package com.backendeva.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cursos", indexes = {
    @Index(name = "idx_curso_profesor", columnList = "profesor_id"),
    @Index(name = "idx_curso_activo", columnList = "activo"),
    @Index(name = "idx_curso_categoria", columnList = "categoria"),
    @Index(name = "idx_curso_nivel", columnList = "nivel"),
    @Index(name = "idx_curso_fecha_creacion", columnList = "fecha_creacion")
})
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"profesor", "inscripciones", "temas"})
@EqualsAndHashCode(of = "id")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, max = 200, message = "El título debe tener entre 3 y 200 caracteres")
    @Column(name = "titulo", nullable = false, length = 200)
    private String titulo;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(name = "descripcion", length = 1000)
    private String descripcion;

    @Column(name = "objetivos", columnDefinition = "TEXT")
    private String objetivos;

    @Min(value = 1, message = "La duración debe ser al menos 1 hora")
    @Max(value = 1000, message = "La duración no puede exceder 1000 horas")
    @Column(name = "duracion_estimada")
    private Integer duracionEstimada; // en horas

    @Pattern(regexp = "^(principiante|intermedio|avanzado)$",
             message = "El nivel debe ser: principiante, intermedio o avanzado")
    @Column(name = "nivel", length = 20)
    private String nivel;

    @Size(max = 50, message = "La categoría no puede exceder 50 caracteres")
    @Column(name = "categoria", length = 50)
    private String categoria;

    @Column(name = "activo", nullable = false)
    private boolean activo = true;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    // Nuevos campos para cursos más ricos
    @Column(name = "prerrequisitos", columnDefinition = "TEXT")
    private String prerrequisitos;

    @Column(name = "resultados_aprendizaje", columnDefinition = "TEXT")
    private String resultadosAprendizaje;

    @Column(name = "habilidades", columnDefinition = "TEXT")
    private String habilidades;

    @Size(max = 10, message = "El idioma debe tener máximo 10 caracteres")
    @Column(name = "idioma", length = 10)
    private String idioma;

    @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
    @DecimalMax(value = "99999.99", message = "El precio no puede exceder 99999.99")
    @Column(name = "precio", precision = 10, scale = 2)
    private BigDecimal precio;

    @Size(max = 500, message = "La URL de la imagen no puede exceder 500 caracteres")
    @Column(name = "imagen_portada", length = 500)
    private String imagenPortada;

    @Column(name = "etiquetas", columnDefinition = "TEXT")
    private String etiquetas; // separados por comas

    @Column(name = "metadata_lom", columnDefinition = "TEXT")
    private String metadataLom; // JSON string con metadata LOM

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profesor_id", nullable = false)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private User profesor;

    // Relaciones bidireccionales optimizadas
    @OneToMany(mappedBy = "curso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @Builder.Default
    private List<Inscripcion> inscripciones = new ArrayList<>();

    @OneToMany(mappedBy = "curso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @Builder.Default
    private List<Tema> temas = new ArrayList<>();

    // Métodos de conveniencia
    public void addInscripcion(Inscripcion inscripcion) {
        inscripciones.add(inscripcion);
        inscripcion.setCurso(this);
    }

    public void removeInscripcion(Inscripcion inscripcion) {
        inscripciones.remove(inscripcion);
        inscripcion.setCurso(null);
    }

    public void addTema(Tema tema) {
        temas.add(tema);
        tema.setCurso(this);
    }

    public void removeTema(Tema tema) {
        temas.remove(tema);
        tema.setCurso(null);
    }

    public int getTotalInscripciones() {
        return inscripciones.size();
    }

    public int getTotalTemas() {
        return temas.size();
    }

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDate.now();
        }
    }
}
