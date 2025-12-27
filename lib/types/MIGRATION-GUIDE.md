# Guía de Migración - Tipos de Datos Normalizados

Esta guía帮助你迁移现有代码以使用新的标准化类型系统。

## 🚨 Cambios Críticos

### 1. Tipos de ID
**Antes**:
```typescript
const userId: string = "123";
const cursoId: string = "456";
```

**Después**:
```typescript
import { backendIdToString } from '@/lib/utils/type-converters';

const userId: string | number = backendIdToString(123) || "123";
const cursoId: string | number = backendIdToString(456) || "456";
```

### 2. Conversiones de Fecha
**Antes**:
```typescript
const fecha: string = new Date().toISOString();
```

**Después**:
```typescript
import { backendDateToString } from '@/lib/utils/type-converters';

const fecha: string = backendDateToString(new Date());
```

### 3. Enums Normalizados
**Antes**:
```typescript
const tipo: "multiple" | "verdadero_falso" = "multiple";
```

**Después**:
```typescript
import { normalizeTipoPregunta } from '@/lib/utils/type-converters';

const tipoBackend = "OPCION_MULTIPLE";
const tipo: "multiple" | "verdadero_falso" = normalizeTipoPregunta(tipoBackend);
```

## 🔧 Patrones de Migración

### Migración de APIs

#### Obtener datos del backend:
```typescript
// ANTES - Código existente
const fetchUser = async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

// DESPUÉS - Con mappers
import { backendUserToFrontend } from '@/lib/utils/dto-mappers';

const fetchUser = async (id: string | number) => {
  const response = await fetch(`/api/users/${id}`);
  const backendUser = await response.json();
  return backendUserToFrontend(backendUser);
};
```

#### Enviar datos al backend:
```typescript
// ANTES - Código existente
const createCurso = async (curso: Curso) => {
  return fetch('/api/cursos', {
    method: 'POST',
    body: JSON.stringify(curso)
  });
};

// DESPUÉS - Con mappers
import { frontendCursoToBackend } from '@/lib/utils/dto-mappers';

const createCurso = async (curso: Curso) => {
  const backendCurso = frontendCursoToBackend(curso);
  return fetch('/api/cursos', {
    method: 'POST',
    body: JSON.stringify(backendCurso)
  });
};
```

### Migración de Componentes

#### Componente de Usuario:
```typescript
// ANTES - Código existente
interface UserCardProps {
  user: {
    id: string;
    nombre: string;
    email: string;
  };
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div>
      <p>ID: {user.id}</p>
      <p>Nombre: {user.nombre}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

// DESPUÉS - Con tipos normalizados
interface UserCardProps {
  user: {
    id: string | number;  // Normalizado
    nombre: string;
    email: string;
    lastSeen?: string;    // Campo adicional
  };
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div>
      <p>ID: {String(user.id)}</p>
      <p>Nombre: {user.nombre}</p>
      <p>Email: {user.email}</p>
      {user.lastSeen && (
        <p>Última vez visto: {new Date(user.lastSeen).toLocaleDateString()}</p>
      )}
    </div>
  );
};
```

#### Componente de Pregunta:
```typescript
// ANTES - Código existente
interface PreguntaProps {
  pregunta: {
    id: string;
    texto: string;
    tipo: "multiple" | "verdadero_falso";
    opciones?: { id: string; texto: string; esCorrecta: boolean }[];
  };
}

// DESPUÉS - Con tipos normalizados
import { TipoPregunta } from '@/lib/types/pregunta';

interface PreguntaProps {
  pregunta: {
    id: string | number;  // Normalizado
    texto: string;        // Alias para textoPregunta
    textoPregunta: string; // Campo original del backend
    tipo: TipoPregunta;   // Enum normalizado
    tipoDescripcion: string;
    opciones?: {
      id: string | number;        // Normalizado
      texto: string;              // Alias para textoRespuesta
      textoRespuesta: string;     // Campo original del backend
      valor?: string;             // Campo adicional
      esCorrecta: boolean;
    }[];
  };
}
```

### Migración de Hooks

#### Hook de API:
```typescript
// ANTES - Código existente
const useUser = (id: string) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(setUser);
  }, [id]);
  
  return user;
};

// DESPUÉS - Con mappers
import { backendUserToFrontend } from '@/lib/utils/dto-mappers';

const useUser = (id: string | number) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(backendUser => setUser(backendUserToFrontend(backendUser)));
  }, [id]);
  
  return user;
};
```

#### Hook de Formulario:
```typescript
// ANTES - Código existente
const useCreateCurso = () => {
  const [loading, setLoading] = useState(false);
  
  const createCurso = async (data: {
    titulo: string;
    descripcion: string;
    profesorId: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/cursos', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.json();
    } finally {
      setLoading(false);
    }
  };
  
  return { createCurso, loading };
};

// DESPUÉS - Con mappers
import { frontendCursoToBackend } from '@/lib/utils/dto-mappers';

const useCreateCurso = () => {
  const [loading, setLoading] = useState(false);
  
  const createCurso = async (data: {
    titulo: string;
    descripcion: string;
    profesorId: string | number;
  }) => {
    setLoading(true);
    try {
      const backendData = frontendCursoToBackend(data);
      const response = await fetch('/api/cursos', {
        method: 'POST',
        body: JSON.stringify(backendData)
      });
      return response.json();
    } finally {
      setLoading(false);
    }
  };
  
  return { createCurso, loading };
};
```

## 📋 Lista de Verificación de Migración

### Archivos a Revisar:
- [ ] `components/**/*` - Todos los componentes React
- [ ] `hooks/**/*` - Todos los hooks personalizados
- [ ] `lib/services/**/*` - Servicios de API
- [ ] `pages/**/*` - Páginas (si las hay)
- [ ] `utils/**/*` - Utilidades existentes
- [ ] `types/**/*` - Definiciones de tipos

### Cambios Comunes:
- [ ] Reemplazar `id: string` por `id: string | number`
- [ ] Añadir imports de utility functions
- [ ] Usar mappers en conversiones API
- [ ] Actualizar tipos de fecha a ISO 8601 strings
- [ ] Normalizar enums usando utility functions
- [ ] Documentar campos calculados

### Testing:
- [ ] Actualizar tests unitarios
- [ ] Actualizar tests de integración
- [ ] Verificar serialización/deserialización
- [ ] Probar casos edge (null, undefined)

## 🚨 Errores Comunes

### Error: Tipo incompatible
```typescript
// ❌ Error
const userId: string = backendUser.id; // backendUser.id puede ser number

// ✅ Correcto
const userId: string | number = backendUser.id;
const userIdStr: string = String(backendUser.id);
```

### Error: Fecha mal formateada
```typescript
// ❌ Error
const fecha = new Date(backendDate); // backendDate puede ser string ISO

// ✅ Correcto
import { backendDateToString } from '@/lib/utils/type-converters';
const fecha = backendDateToString(backendDate);
```

### Error: Enum no normalizado
```typescript
// ❌ Error
const tipo: "multiple" = backendPregunta.tipo; // Puede ser "OPCION_MULTIPLE"

// ✅ Correcto
import { normalizeTipoPregunta } from '@/lib/utils/type-converters';
const tipo = normalizeTipoPregunta(backendPregunta.tipo);
```

## 🔄 Estrategia de Migración Gradual

### Fase 1: Dependencias
1. Añadir utility functions
2. Crear mappers básicos
3. Actualizar tipos base

### Fase 2: Servicios
1. Migrar servicios de API
2. Actualizar hooks de datos
3. Probar integración

### Fase 3: Componentes
1. Migrar componentes críticos
2. Actualizar formularios
3. Probar UI/UX

### Fase 4: Refinamiento
1. Optimizar performance
2. Limpiar código obsoleto
3. Documentar cambios

## 📞 Soporte

Si encuentras problemas durante la migración:

1. **Revisa esta guía** para patrones comunes
2. **Consulta los utility functions** para conversiones
3. **Usa los mappers** para casos complejos
4. **Actualiza los tests** para verificar funcionamiento

---

*Guía de migración - Última actualización: 2025-12-26*