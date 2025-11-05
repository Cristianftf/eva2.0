# Guía de Integración con Backend Spring Framework

Este documento describe cómo integrar el frontend React/TypeScript con tu backend de Spring Framework.

## Configuración del Backend

### 1. URL Base de la API

El frontend está configurado para conectarse a:
\`\`\`
http://localhost:8080/api
\`\`\`

Puedes cambiar esta URL en el archivo `.env.local`:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### 2. Autenticación JWT

El sistema espera que tu backend de Spring implemente autenticación JWT con los siguientes endpoints:

#### POST /api/auth/register
**Request Body:**
\`\`\`json
{
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "password": "string",
  "rol": "ESTUDIANTE" | "PROFESOR" | "ADMIN"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "jwt_token_here",
  "usuario": {
    "id": "string",
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "rol": "ESTUDIANTE" | "PROFESOR" | "ADMIN",
    "fechaRegistro": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

#### POST /api/auth/login
**Request Body:**
\`\`\`json
{
  "email": "string",
  "password": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "token": "jwt_token_here",
  "usuario": {
    "id": "string",
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "rol": "ESTUDIANTE" | "PROFESOR" | "ADMIN",
    "fechaRegistro": "2025-01-01T00:00:00Z"
  }
}
\`\`\`

#### GET /api/auth/me
**Headers:**
\`\`\`
Authorization: Bearer {token}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "string",
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "rol": "ESTUDIANTE" | "PROFESOR" | "ADMIN",
  "fechaRegistro": "2025-01-01T00:00:00Z"
}
\`\`\`

### 3. Configuración CORS

Tu backend de Spring debe permitir peticiones desde el frontend. Configura CORS en Spring:

\`\`\`java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
\`\`\`

### 4. Formato de Respuestas

Todas las respuestas del backend deben seguir este formato estándar:

**Éxito:**
\`\`\`json
{
  "data": { ... }
}
\`\`\`

**Error:**
\`\`\`json
{
  "error": "Mensaje de error descriptivo",
  "message": "Mensaje alternativo"
}
\`\`\`

### 5. Endpoints Requeridos

Consulta el archivo `lib/config/api.config.ts` para ver todos los endpoints que el frontend espera del backend.

Principales categorías:
- `/api/auth/*` - Autenticación
- `/api/usuarios/*` - Gestión de usuarios
- `/api/cursos/*` - Gestión de cursos
- `/api/temas/*` - Temas de cursos
- `/api/multimedia/*` - Archivos multimedia
- `/api/cuestionarios/*` - Cuestionarios y evaluaciones
- `/api/inscripciones/*` - Inscripciones a cursos
- `/api/mensajes/*` - Sistema de chat
- `/api/notificaciones/*` - Notificaciones
- `/api/recursos/*` - Recursos confiables
- `/api/informes/*` - Informes y reportes

### 6. Base de Datos PostgreSQL

El backend debe implementar el siguiente esquema de base de datos:

#### Tabla: usuarios
\`\`\`sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ESTUDIANTE', 'PROFESOR', 'ADMIN')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);
\`\`\`

#### Tabla: cursos
\`\`\`sql
CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    profesor_id UUID REFERENCES usuarios(id),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);
\`\`\`

#### Tabla: temas
\`\`\`sql
CREATE TABLE temas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    orden INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Tabla: multimedia
\`\`\`sql
CREATE TABLE multimedia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tema_id UUID REFERENCES temas(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Tabla: cuestionarios
\`\`\`sql
CREATE TABLE cuestionarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Tabla: preguntas
\`\`\`sql
CREATE TABLE preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cuestionario_id UUID REFERENCES cuestionarios(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    opciones JSONB,
    respuesta_correcta TEXT,
    puntos INTEGER DEFAULT 1
);
\`\`\`

#### Tabla: inscripciones
\`\`\`sql
CREATE TABLE inscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID REFERENCES usuarios(id),
    curso_id UUID REFERENCES cursos(id),
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progreso DECIMAL(5,2) DEFAULT 0,
    UNIQUE(estudiante_id, curso_id)
);
\`\`\`

#### Tabla: mensajes
\`\`\`sql
CREATE TABLE mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remitente_id UUID REFERENCES usuarios(id),
    destinatario_id UUID REFERENCES usuarios(id),
    curso_id UUID REFERENCES cursos(id),
    contenido TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Tabla: notificaciones
\`\`\`sql
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    leida BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Tabla: recursos_confiables
\`\`\`sql
CREATE TABLE recursos_confiables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    url TEXT NOT NULL,
    categoria VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 7. Seguridad

Implementa las siguientes medidas de seguridad en Spring:

1. **Encriptación de contraseñas** con BCrypt
2. **Validación de JWT** en cada petición protegida
3. **Validación de roles** para endpoints específicos
4. **Rate limiting** para prevenir ataques
5. **Sanitización de inputs** para prevenir SQL injection

### 8. Ejemplo de Configuración Spring Security

\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors()
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/profesor/**").hasAnyRole("PROFESOR", "ADMIN")
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        return http.build();
    }
}
\`\`\`

## Pruebas de Integración

1. Inicia tu backend de Spring en `http://localhost:8080`
2. Inicia el frontend con `npm run dev`
3. Prueba el registro de un nuevo usuario
4. Prueba el inicio de sesión
5. Verifica que el token JWT se guarde correctamente
6. Prueba las rutas protegidas

## Solución de Problemas

### Error de CORS
- Verifica que CORS esté configurado correctamente en Spring
- Asegúrate de que la URL del frontend esté en `allowedOrigins`

### Token no válido
- Verifica que el formato del JWT sea correcto
- Asegúrate de que el token se envíe en el header `Authorization: Bearer {token}`

### Errores 404
- Verifica que todos los endpoints estén implementados en Spring
- Revisa que las rutas coincidan con las definidas en `api.config.ts`
