package com.backendeva.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "multimedia")
@Getter
@Setter
public class MultimediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreArchivo;

    @Column(nullable = false)
    private String tipo; // video, audio, imagen, documento

    @Column(nullable = false)
    private String urlArchivo;

    @Column
    private String urlSubtitulos;

    @Column
    private String urlThumbnail;

    @Column
    private Long tamanioBytes;

    @Column
    private Integer duracionSegundos;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "tema_id", nullable = false)
    private Tema tema;

    @Column(nullable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();
}