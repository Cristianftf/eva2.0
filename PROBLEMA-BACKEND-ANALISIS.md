# 🚨 Análisis del Error de Base de Datos en Backend

## ❌ Error Identificado

```
ERROR: update or delete on table "users" violates foreign key constraint "fk4btl2bfxchudkesfjny09h8ff" on table "curso"
Detail: Key (id)=(2) is still referenced from table "curso".
```

## 🔍 Causa del Problema

**Tipo**: Violación de Integridad Referencial
**Contexto**: Intento de eliminación de usuario
**Tablas Involucradas**: 
- `users` (tabla padre)
- `curso` (tabla hijo)

**Problema Específico**: 
- Se está intentando eliminar un usuario con ID=2
- Este usuario es profesor de uno o más cursos (campo `profesor_id`)
- PostgreSQL impide la eliminación porque violaría la integridad referencial

## 🎯 Diagnóstico

### 1. Relación Problemática
```java
// En Curso.java
@ManyToOne
@JoinColumn(name = "profesor_id")
private User profesor;
```

### 2. Flujo del Error
1. **Request**: DELETE `/api/usuarios/2`
2. **UsuarioService.deleteById(2)** 
3. **Hibernate** intenta ejecutar: `DELETE FROM users WHERE id = 2`
4. **PostgreSQL** detecta la violación de FK
5. **Error**: `DataIntegrityViolationException`

## 💡 Soluciones Recomendadas

### Opción 1: Soft Delete (RECOMENDADA)
Modificar el modelo User para usar soft delete en lugar de hard delete.

```java
// En User.java
@Entity
public class User {
    // ... otros campos
    private boolean activo = true;  // Campo existente
    
    // ✅ Nuevo método para "eliminar"
    public void marcarComoEliminado() {
        this.activo = false;
        this.email = this.email + "_deleted_" + System.currentTimeMillis();
    }
}
```

### Opción 2: Cascade Delete
Permitir eliminación en cascada (eliminar cursos junto con el usuario).

```java
// En Curso.java
@ManyToOne
@JoinColumn(name = "profesor_id")
@OnDelete(action = OnDeleteAction.CASCADE)  // ⚠️ PELIGROSO
private User profesor;
```

### Opción 3: Set Null
Al eliminar usuario, poner NULL en cursos (no recomendado).

```java
// En Curso.java  
@ManyToOne
@JoinColumn(name = "profesor_id")
@OnDelete(action = OnDeleteAction.SET_NULL)  // ❌ NO RECOMENDADO
private User profesor;
```

## 🔧 Solución Inmediata

### 1. Modificar UsuarioService
```java
// En UsuarioService.java
@Service
public class UsuarioService {
    
    public void deleteById(Long id) {
        // ✅ Nueva lógica: Soft delete en lugar de hard delete
        User user = findById(id);
        if (user != null) {
            // Verificar si es profesor de cursos
            List<Curso> cursos = cursoService.findByProfesorId(id);
            if (!cursos.isEmpty()) {
                // Opción A: Marcar como inactivo
                user.setActivo(false);
                user.setEmail(user.getEmail() + "_inactive_" + System.currentTimeMillis());
                save(user);
                
                // Opción B: Transferir cursos a otro profesor
                // transferCursosAOtroProfesor(user.getId());
                
                return;
            }
            
            // Solo eliminar si no tiene cursos
            repository.delete(user);
        }
    }
    
    // ✅ Nuevo método para verificación
    public boolean tieneCursosAsociados(Long userId) {
        return !cursoService.findByProfesorId(userId).isEmpty();
    }
}
```

### 2. Modificar UsuarioController
```java
// En UsuarioController.java
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUsuario(@PathVariable Long id) {
    try {
        // ✅ Verificar dependencias antes de eliminar
        if (usuarioService.tieneCursosAsociados(id)) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "No se puede eliminar el usuario porque es profesor de cursos activos",
                "cursos", cursoService.findByProfesorId(id).size()
            ));
        }
        
        usuarioService.deleteById(id);
        return ResponseEntity.noContent().build();
        
    } catch (DataIntegrityViolationException e) {
        return ResponseEntity.badRequest().body(Map.of(
            "error", "No se puede eliminar el usuario debido a dependencias",
            "message", "El usuario tiene cursos asociados"
        ));
    }
}
```

### 3. Crear Endpoint de Transferencia
```java
// Nuevo endpoint para transferir cursos
@PostMapping("/{id}/transferir-cursos")
public ResponseEntity<?> transferirCursos(@PathVariable Long id, 
                                        @RequestParam Long nuevoProfesorId) {
    try {
        usuarioService.transferirCursos(id, nuevoProfesorId);
        return ResponseEntity.ok(Map.of("message", "Cursos transferidos exitosamente"));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
```

### 4. Modificar CursoService
```java
// En CursoService.java
public List<Curso> findByProfesorId(Long profesorId) {
    return cursoRepository.findByProfesorId(profesorId);
}

public void transferirCursos(Long profesorActualId, Long nuevoProfesorId) {
    User nuevoProfesor = usuarioService.findById(nuevoProfesorId);
    if (nuevoProfesor == null) {
        throw new IllegalArgumentException("Nuevo profesor no encontrado");
    }
    
    List<Curso> cursos = findByProfesorId(profesorActualId);
    cursos.forEach(curso -> curso.setProfesor(nuevoProfesor));
    saveAll(cursos);
}
```

## 📋 Plan de Acción Inmediato

### 1. Corrección de Emergencia (5 minutos)
```bash
# Detener el backend temporalmente
# Implementar soft delete en UsuarioService
# Reiniciar backend
```

### 2. Implementación Completa (30 minutos)
- [ ] Modificar UsuarioService con lógica de soft delete
- [ ] Actualizar UsuarioController con validaciones
- [ ] Crear endpoint de transferencia de cursos
- [ ] Actualizar CursoService con métodos de búsqueda
- [ ] Probar funcionalidad

### 3. Testing (15 minutos)
- [ ] Probar eliminación de usuario sin cursos
- [ ] Probar eliminación de usuario con cursos (debe dar error)
- [ ] Probar transferencia de cursos
- [ ] Verificar integridad de datos

## ⚠️ Prevención Futura

### 1. Validaciones en Frontend
```typescript
// En el frontend, antes de enviar DELETE
const puedeEliminar = !usuario.tieneCursosAsociados;
if (!puedeEliminar) {
  alert('No se puede eliminar: usuario tiene cursos asociados');
  return;
}
```

### 2. Documentación
- Documentar reglas de negocio para eliminación de usuarios
- Crear guía de transferencia de cursos
- Actualizar API documentation

### 3. Tests Automatizados
- Test de eliminación de usuario sin dependencias
- Test de error al eliminar usuario con cursos
- Test de transferencia de cursos

## 🎯 Conclusión

**Problema**: Error de integridad referencial al eliminar usuario con cursos asociados
**Solución**: Implementar soft delete + validación de dependencias
**Urgencia**: ALTA - Impide operaciones básicas de administración
**Tiempo estimado de solución**: 30-45 minutos

El problema es típico en aplicaciones con relaciones JPA y se resuelve fácilmente con validaciones apropiadas y soft delete.
