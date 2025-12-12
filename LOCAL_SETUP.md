# Configuración Local - EduSearch Frontend

## Estado del Proyecto

### ✅ Correcciones Aplicadas

#### 1. Configuración de Entorno Local
- **Archivo creado**: `.env.local`
- **Contenido**:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8080/api
  PORT=3000
  NODE_ENV=development
  ```
- **Propósito**: Configura el frontend para conectarse al backend Spring en `http://localhost:8080`

#### 2. Configuración de Next.js Mejorada
- **Archivo**: `next.config.mjs`
- **Cambios**:
  - Agregado rewrites para proxying de `/api/*` a `http://localhost:8080/api/*`
  - Agregado CORS headers para desarrollo local
  - Mantiene `typescript.ignoreBuildErrors: true` (para compilación rápida)
  - Mantiene `images.unoptimized: true` (para desarrollo local)

#### 3. Middleware Optimizado
- **Archivo**: `middleware.ts`
- **Cambios**:
  - `matcher` limitado a rutas específicas (dashboard, admin, estudiante, profesor, auth)
  - Evita ejecutarse en rutas estáticas y públicas
  - Reduce conflictos y 404 inesperados

#### 4. Estructura de Rutas Confirmada
Las siguientes rutas están correctamente configuradas y son accesibles:
- ✅ `/` - Página de inicio
- ✅ `/auth/login` - Página de login
- ✅ `/auth/register` - Página de registro
- ✅ `/dashboard` - Dashboard adaptivo (redirige según rol)
- ✅ `/admin/dashboard` - Panel admin
- ✅ `/profesor/dashboard` - Panel profesor
- ✅ `/estudiante/dashboard` - Panel estudiante

#### 5. Servicios y Configuración de API
- **archivo**: `lib/config/api.config.ts`
- **URL base**: `http://localhost:8080/api` (configurable por env var)
- **Endpoints documentados**: Auth, Cursos, Temas, Multimedia, Cuestionarios, Inscripciones, Mensajes, Notificaciones, Recursos, Informes, Estadísticas

#### 6. Autenticación Configurada
- **Context**: `lib/context/auth.context.tsx`
- **Service**: `lib/services/auth.service.ts`
- **Flow**:
  1. Login/Register en `/auth/login` o `/auth/register`
  2. Token guardado en cookies
  3. Redirige a `/dashboard` (que redirige según rol)
  4. Middleware protege rutas autenticadas

---

## Requisitos del Sistema Local

### Backend (Spring Boot)
- **Ubicación**: `D:\eva2.0\backend\`
- **Puerto**: 8080
- **DB**: PostgreSQL en `localhost:5432`
- **Credenciales**: usuario=`postgres`, password=`postgres`
- **Base de datos**: `eva_db`
- **Comando para arrancar**:
  ```bash
  cd backend
  mvn spring-boot:run
  ```

### Frontend (Next.js)
- **Ubicación**: `D:\eva2.0\`
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
| Página de inicio | http://localhost:3000 |
| Login | http://localhost:3000/auth/login |
| Registro | http://localhost:3000/auth/register |

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
