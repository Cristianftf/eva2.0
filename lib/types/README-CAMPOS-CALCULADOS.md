# Documentación de Campos Calculados y Relaciones

Este documento describe los campos que son calculados automáticamente en el frontend a partir de datos del backend, así como las relaciones entre diferentes tipos de datos.

## 🎯 Campos Calculados

### 1. Usuario (User)
- **`nombreCompleto`**: Se calcula como `${nombre} ${apellido}`
- **`iniciales`**: Se calculan como las primeras letras del nombre y apellido

### 2. Curso
- **`profesor`**: Objeto User completo (incluye relaciones anidadas)
- **`fechaActualizacion`**: Calculada automáticamente en el backend

### 3. Inscripcion
- **`estudianteNombre`**: Se calcula como `${estudiante.nombre} ${estudiante.apellido}`
- **`cursoTitulo`**: Se obtiene del objeto curso relacionado
- **`cursoDescripcion`**: Se obtiene del objeto curso relacionado
- **`completado`**: Se calcula a partir del campo `estado` del backend
- **`fechaCompletado`**: Se calcula a partir de `fechaAprobacion` si el estado es completado

### 4. Pregunta
- **`texto`**: Alias para `textoPregunta` del backend
- **`tipo`**: Normalizado desde `tipoPregunta` del backend
- **`opciones`**: Mapeadas desde la lista `respuestas` del backend

### 5. ContenidoEducativo
- **`cursoTitulo`**: Se obtiene del objeto curso relacionado

### 6. Mensaje
- **`tipo`**: Determinado por la presencia de `cursoId`
  - `'curso'` si tiene `cursoId`
  - `'directo'` si no tiene `cursoId`

### 7. MultimediaItem
- **`titulo`**: Alias para `nombreArchivo` del backend
- **`url`**: Alias para `urlArchivo` del backend

## 🔗 Relaciones entre Tipos

### User
- **Cursos**: Profesor de múltiples cursos
- **Mensajes**: Remitente y destinatario de mensajes
- **Inscripciones**: Estudiante en inscripciones
- **Notificaciones**: Usuario destinatario de notificaciones

### Curso
- **User**: Pertenece a un profesor
- **Tema**: Contiene múltiples temas
- **Cuestionario**: Puede tener cuestionarios asociados
- **Inscripcion**: Múltiples estudiantes inscritos
- **ContenidoEducativo**: Puede tener contenido educativo

### Tema
- **Curso**: Pertenece a un curso
- **MultimediaItem**: Contiene elementos multimedia

### Pregunta
- **Cuestionario**: Pertenece a un cuestionario
- **Respuesta**: Tiene múltiples respuestas (opciones)

### Respuesta
- **Pregunta**: Pertenece a una pregunta

## 📋 Convenciones de Normalización

### IDs
- **Frontend**: `string | number` (permite ambos tipos)
- **Backend**: Principalmente `Long` (number)
- **Conversión**: Usar utility functions `backendIdToString()` y `frontendIdToNumber()`

### Fechas
- **Frontend**: `string` en formato ISO 8601
- **Backend**: `LocalDateTime` o `LocalDate`
- **Conversión**: Usar utility functions `backendDateToString()` y `stringToFrontendDate()`

### Enums
- **Frontend**: Valores normalizados (ej: `'basico'`)
- **Backend**: Valores en mayúsculas (ej: `'BASICO'`)
- **Conversión**: Usar utility functions `normalizeXxx()` y `denormalizeXxx()`

## 🔧 Uso de Utility Functions

### Conversiones de ID
```typescript
import { backendIdToString, frontendIdToNumber } from '@/lib/utils/type-converters';

// Backend a Frontend
const frontendId = backendIdToString(backendUser.id);

// Frontend a Backend  
const backendId = frontendIdToNumber(frontendUserId);
```

### Conversiones de Fecha
```typescript
import { backendDateToString, stringToFrontendDate } from '@/lib/utils/type-converters';

// Backend a Frontend
const fechaFrontend = backendDateToString(backendFecha);

// Frontend a Display
const fechaDisplay = stringToFrontendDate(fechaFrontend);
```

### Mappers Completos
```typescript
import { 
  backendUserToFrontend, 
  frontendUserToBackend,
  backendCursoToFrontend 
} from '@/lib/utils/dto-mappers';

// Conversión completa de objetos
const frontendUser = backendUserToFrontend(backendUser);
const backendUser = frontendUserToBackend(frontendUser);
const frontendCurso = backendCursoToFrontend(backendCurso);
```

## 🚨 Consideraciones Importantes

### Campos Requeridos vs Opcionales
- **Frontend**: Marcar campos como opcionales (`?`) cuando pueden no estar presentes
- **Backend**: Usar `@Nullable` para campos que pueden ser null

### Validación
- **Frontend**: Validar tipos usando TypeScript
- **Backend**: Validar usando annotations JSR-380 (`@NotNull`, `@Size`, etc.)

### Performance
- **Eager Loading**: Usar para relaciones que siempre se necesitan
- **Lazy Loading**: Usar para relaciones que pueden no ser accedidas
- **DTOs**: Crear DTOs específicos para diferentes casos de uso

### Serialización
- **JSON**: Asegurar que los mappers manejen la serialización/deserialización correctamente
- **Circular References**: Evitar referencias circulares en JSON
- **Infinite Recursion**: Usar `@JsonIgnore` o `@JsonBackReference` en backend

## 📝 Próximos Pasos

1. **Testing**: Implementar tests unitarios para todos los mappers
2. **Documentación**: Mantener esta documentación actualizada
3. **Refactoring**: Revisar y actualizar mappers cuando cambien los modelos
4. **Performance**: Optimizar queries para minimizar la necesidad de campos calculados

---

*Documentación generada automáticamente - Última actualización: 2025-12-26*