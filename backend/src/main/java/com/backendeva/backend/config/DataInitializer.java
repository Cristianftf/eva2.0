package com.backendeva.backend.config;

import com.backendeva.backend.model.*;
import com.backendeva.backend.repository.*;
import com.backendeva.backend.services.*;
import com.backendeva.backend.services.CuestionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CursoService cursoService;

    @Autowired
    private TemaService temaService;

    @Autowired
    private MultimediaService multimediaService;

    @Autowired
    private CuestionarioService cuestionarioService;

    @Override
    public void run(String... args) throws Exception {
        // Crear usuario administrador si no existe
        if (userRepository.findByEmail("admin@eva.edu").isEmpty()) {
            User admin = new User();
            admin.setNombre("Admin");
            admin.setApellido("Sistema");
            admin.setEmail("admin@eva.edu");
            admin.setPassword(passwordEncoder.encode("12344321"));
            admin.setRol("ADMIN");
            admin.setActivo(true);
            admin.setFechaRegistro(LocalDate.now());

            userRepository.save(admin);
            System.out.println("Usuario administrador creado: admin@eva.edu / 12344321");
        }

        // Crear usuarios de prueba si no existen
        if (userRepository.count() <= 1) {
            createSampleUsers();
            System.out.println("Usuarios de prueba creados");
        }

        // Crear datos de ejemplo
        createSampleData();
    }

    private void createSampleUsers() {
        // Profesores
        createUser("María", "González", "maria.prof@eva.edu", "PROFESOR");
        createUser("Carlos", "Rodríguez", "carlos.prof@eva.edu", "PROFESOR");
        createUser("Ana", "López", "ana.prof@eva.edu", "PROFESOR");

        // Estudiantes
        createUser("Juan", "Pérez", "juan.est@eva.edu", "ESTUDIANTE");
        createUser("María", "García", "maria.garcia@eva.edu", "ESTUDIANTE");
        createUser("Pedro", "Martínez", "pedro.martinez@eva.edu", "ESTUDIANTE");
        createUser("Laura", "Sánchez", "laura.sanchez@eva.edu", "ESTUDIANTE");
        createUser("Carlos", "López", "carlos.lopez@eva.edu", "ESTUDIANTE");
        createUser("Ana", "Hernández", "ana.hernandez@eva.edu", "ESTUDIANTE");
        createUser("Miguel", "Gómez", "miguel.gomez@eva.edu", "ESTUDIANTE");
        createUser("Isabel", "Díaz", "isabel.diaz@eva.edu", "ESTUDIANTE");
        createUser("David", "Moreno", "david.moreno@eva.edu", "ESTUDIANTE");
        createUser("Carmen", "Ruiz", "carmen.ruiz@eva.edu", "ESTUDIANTE");
    }

    private void createSampleData() {
        // Crear cursos, temas y multimedia de ejemplo
        // Esto se ejecutará después de crear usuarios
        if (userRepository.count() > 5) {
            createSampleCoursesAndContent();
        }
    }

    private void createSampleCoursesAndContent() {
        try {
            // Obtener profesores
            List<User> profesores = userRepository.findByRol("PROFESOR");
            if (profesores.isEmpty()) return;

            User profesor = profesores.get(0);

            // Crear curso de ejemplo
            Curso curso = new Curso();
            curso.setTitulo("Introducción a la Competencia Informacional");
            curso.setDescripcion("Curso básico sobre conceptos fundamentales de la búsqueda y evaluación de información");
            curso.setObjetivos("Comprender los conceptos básicos de la competencia informacional");
            curso.setDuracionEstimada(20);
            curso.setNivel("principiante");
            curso.setCategoria("Competencia Informacional");
            curso.setActivo(true);
            curso.setFechaCreacion(LocalDate.now());
            curso.setProfesor(profesor);
            curso.setMetadataLom("{\"title\": \"Introducción a la CI\", \"language\": \"es\", \"description\": \"Curso introductorio\"}");

            curso = cursoService.save(curso);

            // Crear temas para el curso
            Tema tema1 = new Tema();
            tema1.setTitulo("¿Qué es la Competencia Informacional?");
            tema1.setDescripcion("Definición y importancia de la CI en la sociedad actual");
            tema1.setOrden(1);
            tema1.setCurso(curso);
            tema1 = temaService.save(tema1);

            Tema tema2 = new Tema();
            tema2.setTitulo("El proceso de búsqueda de información");
            tema2.setDescripcion("Pasos para realizar una búsqueda efectiva");
            tema2.setOrden(2);
            tema2.setCurso(curso);
            tema2 = temaService.save(tema2);

            // Crear cuestionario para el curso
            Cuestionario cuestionario = new Cuestionario();
            cuestionario.setTitulo("Evaluación de Conceptos Básicos");
            cuestionario.setDescripcion("Cuestionario sobre conceptos fundamentales de competencia informacional");
            cuestionario.setActivo(true);
            cuestionario.setCurso(curso);
            cuestionario.setQtiPayload("<?xml version=\"1.0\"?><assessmentItem><itemBody><p>¿Qué es la competencia informacional?</p></itemBody></assessmentItem>");

            // Crear preguntas para el cuestionario
            Pregunta pregunta1 = new Pregunta();
            pregunta1.setTextoPregunta("¿Qué es la competencia informacional?");
            pregunta1.setCuestionario(cuestionario);

            Respuesta respuesta1 = new Respuesta();
            respuesta1.setTextoRespuesta("La capacidad de identificar, localizar, evaluar y usar información de manera efectiva");
            respuesta1.setEsCorrecta(true);
            respuesta1.setPregunta(pregunta1);

            Respuesta respuesta2 = new Respuesta();
            respuesta2.setTextoRespuesta("Solo saber usar Google");
            respuesta2.setEsCorrecta(false);
            respuesta2.setPregunta(pregunta1);

            pregunta1.setRespuestas(List.of(respuesta1, respuesta2));
            cuestionario.setPreguntas(List.of(pregunta1));

            cuestionarioService.create(cuestionario);

            System.out.println("Datos de ejemplo creados: curso, temas y cuestionario");

        } catch (Exception e) {
            System.err.println("Error creando datos de ejemplo: " + e.getMessage());
        }
    }

    private void createUser(String nombre, String apellido, String email, String rol) {
        User user = new User();
        user.setNombre(nombre);
        user.setApellido(apellido);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("password"));
        user.setRol(rol);
        user.setActivo(true);
        user.setFechaRegistro(LocalDate.now());
        userRepository.save(user);
    }
}