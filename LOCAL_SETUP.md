# Configuración Local - HealthConnect (Plataforma Integral de Salud)

## Estado del Proyecto

### ✅ Optimizaciones Completadas

#### 1. **Transformación a Plataforma de Salud**
- **Enfoque cambiado**: De educativo a plataforma médica integral
- **Terminología actualizada**: Cursos → Programas, Estudiantes → Pacientes
- **APIs de salud integradas**: PubMed, WHO, CDC con fallback local
- **Biblioteca médica**: 5 recursos de salud básicos incluidos

#### 2. **Optimizaciones de Rendimiento Frontend**
- **Lazy Loading**: Componentes cargados bajo demanda
- **Code Splitting**: Chunks separados por funcionalidad
- **Memoización**: Componentes optimizados con React.memo
- **Cache inteligente**: React Query con estrategias específicas

#### 3. **Optimizaciones de Backend**
- **Cache Caffeine**: Reemplaza ConcurrentMap por implementación de alto rendimiento
- **Pool de conexiones**: HikariCP optimizado (20 max, 5 min)
- **Índices de BD**: Optimizados para consultas frecuentes
- **Transacciones**: Manejo adecuado con @Transactional
- **Validaciones**: Jakarta Validation en entidades

#### 4. **Mejores Prácticas Implementadas**
- **Inyección de dependencias**: Constructor injection en lugar de @Autowired
- **Logging estructurado**: SLF4J con niveles apropiados
- **Manejo de errores**: Excepciones específicas y mensajes claros
- **DTOs optimizados**: Separación clara entre entidades y respuestas

#### 5. **Configuración Multi-entorno**
- **Desarrollo**: Configurado para desarrollo local
- **Producción**: Archivo `application-production.properties` optimizado
- **JVM tuning**: Configuración de GC y memoria optimizada

---

## Requisitos del Sistema Local

### Backend (Spring Boot Optimizado)
- **Ubicación**: `./backend/`
- **Puerto**: 8080
- **DB**: PostgreSQL en `localhost:5432`
- **Credenciales**: usuario=`postgres`, password=`postgres`
- **Base de datos**: `eva_db`
- **Comando recomendado**:
  ```bash
  # Usar script optimizado
  chmod +x scripts/start-backend.sh
  ./scripts/start-backend.sh

  # O manualmente
  cd backend
  mvn spring-boot:run
  ```

### Frontend (Next.js Optimizado)
- **Ubicación**: `./`
- **Puerto**: 3000
- **Node**: v21+ (recomendado)
- **Comando para arrancar**:
  ```bash
  npm run dev
  ```

---

## URLs Locales

| Componente | URL |
|-----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Health Check | http://localhost:8080/api/auth/health |
| Página de inicio | http://localhost:3000 |
| Login | http://localhost:3000/auth/login |
| Registro | http://localhost:3000/auth/register |
| Dashboard Profesional | http://localhost:3000/profesor/dashboard |

---

## Solución de Problemas

### Error: `EPERM: operation not permitted, mkdir '.next/dev/types'`

**Causas comunes**:
1. Procesos Node.js todavía en ejecución
2. Permisos NTFS dañados
3. Archivos bloqueados por antivirus

**Solución**:
```powershell
# 1. Detener todos los procesos Node
taskkill /F /IM node.exe /T

# 2. Resetear permisos NTFS (si es necesario)
icacls "D:\eva2.0\.next" /reset /T /C /Q
icacls "D:\eva2.0\.next" /grant:r "%username%:F" /T /C /Q

# 3. Eliminar caché
Remove-Item -Recurse -Force .\.next
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Path .\package-lock.json

# 4. Reinstalar
npm install

# 5. Arrancar
npm run dev
```

### Error: `PSSecurityException` - Scripts disabled

**Solución**:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
npm run dev
```

### Error: 404 en `/auth/login` o `/auth/register`

**Causas**:
1. Middleware interfiriendo (ahora solucionado)
2. Archivos no encontrados (verificados)
3. Caché de Next.js corrupto (eliminar `.next`)

**Solución**: Ya aplicada en esta versión

---

## Verificación del Estado

### ✅ Componentes Validados

- **Páginas**: Existen y exportan componentes válidos
  - `app/auth/login/page.tsx` ✅
  - `app/auth/register/page.tsx` ✅
  - `app/dashboard/page.tsx` ✅
  - `app/page.tsx` ✅

- **Formularios**: Implementados y funcionales
  - `components/auth/login-form.tsx` ✅
  - `components/auth/register-form.tsx` ✅

- **Contexto y Servicios**: Correctamente importados
  - `lib/context/auth.context.tsx` ✅
  - `lib/services/auth.service.ts` ✅
  - `lib/services/api.service.ts` ✅

- **Protecciones de Ruta**: Implementadas correctamente
  - Middleware limita acceso a rutas protegidas
  - `ProtectedRoute` component para rutas que requieren autenticación
  - Redireccionamiento automático según rol

---

## Próximos Pasos

1. **Arrancar Backend**: Verificar que PostgreSQL esté corriendo y luego `mvn spring-boot:run`
2. **Arrancar Frontend**: `npm run dev`
3. **Probar Login/Register**: Usar http://localhost:3000
4. **Verificar Conectividad**: Revisar Network en DevTools (F12)

---

## Notas Importantes

- **Desarrollo local únicamente**: Este `.env.local` está configurado para desarrollo
- **No commitear `.env.local`**: Ya debería estar en `.gitignore`
- **Backend obligatorio**: El frontend necesita el backend en 8080 para funcionar
- **Token en cookies**: Los tokens se guardan en cookies HTTP-only
- **CORS configurado**: `next.config.mjs` incluye headers CORS para desarrollo

---

Fecha de configuración: 10 de diciembre de 2025
Versión: 1.0 Local Setup
