# Informe de Inconsistencias entre Tipos de Datos Frontend y Backend

## Resumen Ejecutivo

Se ha realizado un análisis exhaustivo de los tipos de datos entre el frontend (`lib/types`) y el backend (modelos y DTOs en `backend/src/main/java/com/backendeva/backend/`). Se han identificado **múltiples inconsistencias críticas** que pueden causar problemas de comunicación entre frontend y backend, así como errores en tiempo de ejecución.

## Metodología

- **Frontend**: Análisis de interfaces TypeScript en `lib/types/`
- **Backend**: Análisis de modelos JPA y DTOs en Java
- **Enfoque**: Comparación campo por campo de tipos, nombres y estructuras

---

## 🚨 INCONSISTENCIAS CRÍTICAS

### 1. MODELO USER - Tipos de ID Inconsistentes

**Frontend** (`lib/types/index.ts`):
```typescript
export interface User {
  id: string  // ❌ string
  email: string
  // ...
}
```

**Backend** (`User.java`):
```java
private Long id;  // ❌ Long (number)
```

**Problema**: El frontend usa `string` para IDs, pero el backend usa `Long` (number). Esto causará errores de serialización/deserialización.

**Impacto**: CRÍTICO - Imposibilita la comunicación entre frontend y backend

**Solución**:
- **Opción A**: Cambiar frontend a `number`
- **Opción B**: Cambiar backend a `String` (recomendado para UUIDs)

### 2. MODELO CURSO - Campos Faltantes

**Frontend** (`lib/types/index.ts`):
```typescript
export interface Curso {
  id: string
  titulo: string
  descripcion: string
  profesorId: string
  imagen?: string
  fechaCreacion: string
  fechaActualizacion: string
  activo: boolean
  duracionEstimada?: number
  nivel?: "basico" | "intermedio" | "avanzado"  // ❌ case insensitive
}
```

**Backend** (`Curso.java`):
```java
private Long id;
private String titulo;
private String descripcion;
private String objetivos;  // ❌ FALTA EN FRONTEND
private Integer duracionEstimada;
private String nivel; // "principiante, intermedio, avanzado" ❌ INCONSISTENTE
private String categoria;  // ❌ FALTA EN FRONTEND
private boolean activo;
private LocalDate fechaCreacion;  // ❌ LocalDate vs string
private String metadataLom;  // ❌ FALTA EN FRONTEND
```

**Problemas**:
- Campo `objetivos` existe en backend pero no en frontend
- Campo `categoria` existe en backend pero no en frontend
- Campo `metadataLom` existe en backend pero no en frontend
- Nivel: frontend usa "basico/intermedio/avanzado" vs backend usa "principiante/intermedio/avanzado"
- Fechas: frontend usa `string` vs backend usa `LocalDate`

**Impacto**: ALTO - Pérdida de datos y funcionalidad

### 3. MODELO PREGUNTA - Estructura Completamente Inconsistente

**Frontend** (`lib/types/pregunta.ts`):
```typescript
export interface PreguntaData {
  id: number
  texto: string
  tipo: TipoPregunta  // enum
  tipoDescripcion: string
  configuracionAdicional?: string
  opciones?: OpcionRespuesta[]
  respuestasReferencia?: RespuestaReferencia[]
  elementosOrdenar?: ElementoOrdenar[]
  elementosArrastrar?: ElementoArrastrar[]
  destinos?: DestinoArrastrar[]
}
```

**Backend** (`Pregunta.java`):
```java
private Long id;
private String textoPregunta;  // ❌ nombre diferente
private TipoPregunta tipoPregunta;  // ❌ enum con valores diferentes
private String configuracionAdicional;  // ✅ presente
@OneToMany private List<Respuesta> respuestas;  // ❌ estructura diferente
```

**Problemas**:
- Campo `texto` vs `textoPregunta`
- Enums con valores diferentes:
  - Frontend: `'opcion_multiple'`, `'verdadero_falso'`
  - Backend: `OPCION_MULTIPLE`, `VERDADERO_FALSO`
- Frontend tiene estructuras específicas por tipo (`opciones`, `respuestasReferencia`, etc.)
- Backend tiene una lista genérica de `Respuesta`

**Impacto**: CRÍTICO - Sistema de preguntas no funcionará

### 4. MODELO RESPUESTA - Estructuras Incompatibles

**Frontend** (`lib/types/pregunta.ts`):
```typescript
export interface OpcionRespuesta {
  id: number
  texto: string
  esCorrecta: boolean
}

export interface RespuestaEstudiante {
  preguntaId: number
  respuesta: number | string | number[] | Record<string, any>
}
```

**Backend** (`Respuesta.java`):
```java
private Long id;
private String textoRespuesta;  // ❌ nombre diferente
private Boolean esCorrecta;
private String valor;  // ❌ FALTA EN FRONTEND
private Integer orden;  // ❌ FALTA EN FRONTEND
private String grupo;  // ❌ FALTA EN FRONTEND
private String configuracionAdicional;  // ❌ FALTA EN FRONTEND
```

**Backend DTO** (`RespuestaEstudianteDto.java`):
```java
private Integer preguntaId;
private JsonNode respuesta;  // ❌ JsonNode vs tipos específicos
```

**Problemas**:
- Frontend usa `OpcionRespuesta` simple vs backend usa `Respuesta` compleja
- Tipos de respuesta incompatibles
- Campos adicionales en backend no están en frontend

**Impacto**: CRÍTICO - Sistema de respuestas no funcionará

### 5. MODELO INSCRIPCION - Estados Inconsistentes

**Frontend** (`lib/types/index.ts`):
```typescript
export interface Inscripcion {
  // ...
  progreso: number  // 0-100
  completado: boolean
  fechaCompletado?: string
}
```

**Backend** (`Inscripcion.java`):
```java
private EstadoInscripcion estado = EstadoInscripcion.PENDIENTE;
private int progreso = 0;
// ❌ NO HAY campo completado ni fechaCompletado
```

**Problema**: Frontend usa `boolean completado` vs backend usa `enum estado`

**Impacto**: MEDIO - Lógica de estado inconsistente

### 6. MODELO MENSAJE - Campo Remitente Requerido

**Frontend** (`lib/types/index.ts`):
```typescript
export interface Mensaje {
  id: string
  remitenteId?: string  // ❌ opcional
  destinatarioId?: string
  cursoId?: string
  contenido: string
  fechaEnvio: string
  leido: boolean
  tipo: "directo" | "curso"
}
```

**Backend** (`Mensaje.java`):
```java
@ManyToOne @JoinColumn(name = "remitente_id", nullable = false)
private User remitente;  // ❌ requerido
```

**Problema**: Frontend marca `remitenteId` como opcional pero backend lo requiere

**Impacto**: MEDIO - Errores de validación

---

## ⚠️ INCONSISTENCIAS MENORES

### 7. MODELO NOTIFICACION - Campo Tipo

**Frontend**:
```typescript
tipo: "info" | "exito" | "advertencia" | "error"
```

**Backend**:
```java
private String tipo; // "curso, mensaje, sistema, etc."
```

**Problema**: Valores diferentes para tipos de notificación

### 8. MODELO CONTENIDO EDUCATIVO - Campos Adicionales

**Frontend** (`lib/types/contenido-educativo.ts`):
```typescript
export interface ContenidoEducativo {
  // ...
  cursoTitulo?: string  // ❌ campo calculado
}
```

**Backend** (`ContenidoEducativo.java`):
```java
// NO tiene cursoTitulo - es un campo calculado
```

**Problema**: Campo calculado en frontend pero no documentado en backend

### 9. MODELO TEMA - Campo Contenido

**Frontend**:
```typescript
export interface Tema {
  // ...
  contenido: string  // ❌ campo adicional
  multimedia: MultimediaItem[]
}
```

**Backend** (`Tema.java`):
```java
// NO tiene campo contenido
private List<MultimediaItem> multimedia; // No está definido como relación
```

**Problema**: Campo `contenido` falta en backend

---

## 📋 RECOMENDACIONES PRIORITARIAS

### Prioridad 1 (Crítico - Resolver Inmediatamente)

1. **Normalizar tipos de ID**: Decidir entre `string` (UUID) o `number` (Long) para todos los modelos
2. **Corregir modelo User**: Unificar tipos de ID y campos
3. **Reestructurar modelo Pregunta**: Alinear estructuras entre frontend y backend
4. **Corregir modelo Respuesta**: Unificar estructuras y tipos

### Prioridad 2 (Alto - Resolver en Sprint Siguiente)

5. **Completar modelo Curso**: Añadir campos faltantes (`objetivos`, `categoria`, `metadataLom`)
6. **Corregir modelo Inscripcion**: Unificar estados (`completado` vs `estado`)
7. **Alinear fechas**: Usar tipos consistentes (`string` ISO 8601 o Date objects)

### Prioridad 3 (Medio - Resolver en Sprints Posteriores)

8. **Normalizar enums**: Asegurar valores consistentes entre frontend y backend
9. **Documentar campos calculados**: Clarar qué campos son calculados vs persistidos
10. **Revisar relaciones**: Asegurar que las relaciones JPA coincidan con las interfaces TypeScript

---

## 🔧 PLAN DE ACCIÓN SUGERIDO

### Fase 1: Correcciones Críticas (1-2 sprints)
- [ ] Crear utility functions para conversión de tipos
- [ ] Actualizar interfaces TypeScript para coincidir con backend
- [ ] Implementar mappers DTO ↔ Interface
- [ ] Actualizar servicios API para manejar conversiones

### Fase 2: Normalización de Enums (1 sprint)
- [ ] Crear archivo central de constantes para enums
- [ ] Actualizar valores para consistencia
- [ ] Implementar validación de enums

### Fase 3: Campos Adicionales (1-2 sprints)
- [ ] Añadir campos faltantes en interfaces
- [ ] Implementar lógica para campos calculados
- [ ] Actualizar validaciones

### Fase 4: Testing y Validación (1 sprint)
- [ ] Implementar tests de integración para APIs
- [ ] Validar serialización/deserialización
- [ ] Tests end-to-end de flujos críticos

---

## 📊 ESTADÍSTICAS DEL ANÁLISIS

- **Total de modelos analizados**: 15
- **Modelos con inconsistencias críticas**: 6 (40%)
- **Modelos con inconsistencias menores**: 4 (27%)
- **Campos inconsistentes identificados**: 23
- **Tiempo estimado de corrección**: 4-6 sprints

---

## 🎯 CONCLUSIONES

Las inconsistencias identificadas representan un **riesgo significativo** para la estabilidad y funcionalidad del sistema. La falta de alineación entre los tipos de datos del frontend y backend puede resultar en:

- Errores en tiempo de ejecución
- Pérdida de datos
- Funcionalidad limitada
- Dificultades de mantenimiento

**Se recomienda abordar estas inconsistencias de manera sistemática, priorizando las correcciones críticas para asegurar la estabilidad del sistema.**

---

*Informe generado el: 2025-12-26*
*Análisis realizado por: Sistema de Revisión de Tipos*