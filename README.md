# EduSearch - Entorno Virtual de Aprendizaje

Sistema completo de gestión de aprendizaje en línea con paneles diferenciados para administradores, profesores y estudiantes. Desarrollado con React, TypeScript y Next.js, preparado para conectarse con un backend de Spring Framework y PostgreSQL.

## 🚀 Características Principales

### Panel Administrativo (CMS)
- Gestión completa de usuarios (crear, editar, eliminar, cambiar roles)
- Administración de cursos y recursos educativos
- Control de recursos confiables con categorías
- Estadísticas y métricas del sistema en tiempo real
- Dashboard con visualización de datos

### Panel de Estudiante
- Exploración e inscripción a cursos disponibles
- Acceso a contenido multimedia (videos, audios, documentos)
- Realización de cuestionarios con temporizador
- Seguimiento de progreso y calificaciones por curso
- Chat con profesores y otros estudiantes
- Sistema de notificaciones en tiempo real
- Visualización de calificaciones históricas

### Panel de Profesor
- Creación y gestión de cursos propios
- Organización de contenido por temas
- Subida de multimedia por tema (videos, audios, documentos)
- Creación de cuestionarios con múltiples preguntas y respuestas
- Vista de estudiantes inscritos con su progreso
- Generación de informes detallados de rendimiento
- Chat con estudiantes de sus cursos

### Funcionalidades Generales
- Sistema de autenticación robusto con JWT
- Página de bienvenida informativa
- Sección de recursos confiables con búsqueda y filtros
- Perfil de usuario personalizable con foto
- Configuración de notificaciones y preferencias
- Chat en tiempo real entre usuarios
- Sistema de notificaciones push
- Reproductor multimedia integrado
- Diseño responsive y accesible
- Página 404 personalizada

## 🛠️ Stack Tecnológico

### Frontend (Este Proyecto)
- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: shadcn/ui con Radix UI
- **Gestión de Estado**: React Context API
- **Peticiones HTTP**: Fetch API nativo con servicio centralizado

### Backend (Requerido - No Incluido)
- **Framework**: Spring Framework (Spring Boot recomendado)
- **Base de Datos**: PostgreSQL (local)
- **API**: REST API
- **Autenticación**: JWT (JSON Web Tokens)
- **ORM**: JPA/Hibernate (recomendado)

## 📁 Estructura del Proyecto

\`\`\`
eva-frontend/
├── app/                          # Páginas de Next.js (App Router)
│   ├── admin/                    # Panel administrativo
│   │   └── dashboard/page.tsx
│   ├── estudiante/               # Panel de estudiante
│   │   ├── dashboard/page.tsx
│   │   ├── curso/[id]/page.tsx
│   │   └── cuestionario/[id]/page.tsx
│   ├── profesor/                 # Panel de profesor
│   │   ├── dashboard/page.tsx
│   │   └── curso/[id]/page.tsx
│   ├── auth/                     # Autenticación
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── chat/page.tsx             # Sistema de mensajería
│   ├── notificaciones/page.tsx   # Centro de notificaciones
│   ├── recursos/page.tsx         # Recursos confiables
│   ├── perfil/page.tsx           # Perfil de usuario
│   ├── configuracion/page.tsx    # Configuración
│   ├── page.tsx                  # Página de bienvenida
│   ├── not-found.tsx             # Página 404
│   ├── layout.tsx                # Layout principal
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes reutilizables
│   ├── admin/                    # Componentes del admin
│   │   ├── usuarios-tab.tsx
│   │   ├── cursos-tab.tsx
│   │   ├── recursos-tab.tsx
│   │   └── estadisticas-tab.tsx
│   ├── estudiante/               # Componentes del estudiante
│   │   ├── mis-cursos-tab.tsx
│   │   ├── cursos-disponibles-tab.tsx
│   │   └── mis-calificaciones-tab.tsx
│   ├── profesor/                 # Componentes del profesor
│   │   ├── mis-cursos-profesor-tab.tsx
│   │   ├── crear-curso-tab.tsx
│   │   ├── contenido-curso-tab.tsx
│   │   ├── estudiantes-curso-tab.tsx
│   │   ├── cuestionarios-curso-tab.tsx
│   │   └── informes-tab.tsx
│   ├── auth/                     # Componentes de autenticación
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── chat/                     # Componentes de chat
│   │   ├── chat-button.tsx
│   │   └── chat-widget.tsx
│   ├── notifications/            # Componentes de notificaciones
│   │   ├── notifications-button.tsx
│   │   └── notification-toast.tsx
│   ├── recursos/                 # Componentes de recursos
│   │   ├── recurso-card.tsx
│   │   └── recursos-filters.tsx
│   ├── multimedia/               # Reproductor multimedia
│   │   └── media-player.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── main-nav.tsx
│   │   ├── dashboard-layout.tsx
│   │   └── protected-route.tsx
│   └── ui/                       # Componentes UI de shadcn
│
├── lib/                          # Utilidades y configuración
│   ├── config/
│   │   └── api.config.ts         # Configuración de endpoints
│   ├── context/
│   │   └── auth.context.tsx      # Context de autenticación
│   ├── hooks/
│   │   └── use-api.ts            # Hook personalizado para API
│   ├── services/                 # Servicios de API
│   │   ├── api.service.ts        # Servicio base
│   │   ├── auth.service.ts       # Autenticación
│   │   ├── courses.service.ts    # Cursos
│   │   ├── cuestionarios.service.ts
│   │   ├── inscripciones.service.ts
│   │   ├── mensajes.service.ts
│   │   ├── notificaciones.service.ts
│   │   ├── recursos.service.ts
│   │   ├── temas.service.ts
│   │   └── usuarios.service.ts
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript
│   └── utils.ts                  # Utilidades generales
│
├── middleware.ts                 # Middleware de Next.js
├── BACKEND_INTEGRATION.md        # Guía detallada de integración
└── README.md                     # Este archivo
\`\`\`

## 🔧 Configuración e Instalación

### 1. Clonar e Instalar

\`\`\`bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd eva-frontend

# Instalar dependencias
npm install
\`\`\`

### 2. Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
# URL del backend de Spring Framework
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### 3. Ejecutar en Desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

### 4. Construir para Producción

\`\`\`bash
npm run build
npm start
\`\`\`

## 🔌 Integración con Backend Spring

El frontend está completamente preparado para conectarse a un backend de Spring Framework. **Consulta el archivo `BACKEND_INTEGRATION.md`** para información detallada sobre:

- Estructura completa de endpoints esperados
- Formato de peticiones y respuestas JSON
- Modelos de datos y entidades JPA
- Configuración de autenticación JWT
- Manejo de errores y códigos HTTP
- Ejemplos de implementación en Spring Boot
- Configuración de CORS
- Scripts SQL para PostgreSQL

### Endpoints Principales Requeridos

\`\`\`
# Autenticación
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
POST   /api/auth/cambiar-password
POST   /api/auth/subir-foto

# Cursos
GET    /api/cursos
POST   /api/cursos
GET    /api/cursos/{id}
POST   /api/cursos/{id}/inscribir

# Cuestionarios
GET    /api/cuestionarios/curso/{cursoId}
POST   /api/cuestionarios/{id}/responder

# Chat
GET    /api/mensajes/conversacion/{userId1}/{userId2}
POST   /api/mensajes/enviar

# Notificaciones
GET    /api/notificaciones/usuario/{usuarioId}
PUT    /api/notificaciones/{id}/leer

... y más (ver BACKEND_INTEGRATION.md para lista completa)
\`\`\`

### Formato de Respuestas Esperado

\`\`\`typescript
// Respuesta exitosa
{
  "success": true,
  "data": { ... }
}

// Respuesta con error
{
  "success": false,
  "error": "Mensaje de error descriptivo"
}

// Respuesta paginada
{
  "items": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
\`\`\`

## 👥 Roles y Permisos

### Administrador (ADMIN)
- ✅ Acceso completo al sistema
- ✅ Gestión de usuarios (CRUD completo)
- ✅ Gestión de cursos y recursos
- ✅ Visualización de estadísticas globales
- ✅ Control de recursos confiables

### Profesor (PROFESOR)
- ✅ Crear y gestionar sus propios cursos
- ✅ Agregar contenido multimedia por tema
- ✅ Crear cuestionarios con preguntas
- ✅ Ver progreso de estudiantes inscritos
- ✅ Generar informes de rendimiento
- ✅ Chat con estudiantes de sus cursos

### Estudiante (ESTUDIANTE)
- ✅ Inscribirse a cursos disponibles
- ✅ Acceder a contenido multimedia
- ✅ Realizar cuestionarios con temporizador
- ✅ Ver calificaciones y progreso
- ✅ Chat con profesores y otros estudiantes
- ✅ Recibir notificaciones en tiempo real

## 🎨 Diseño y UX

- **Sistema de Colores**: Paleta moderna con soporte para modo claro/oscuro
- **Tipografía**: Geist Sans (UI) y Geist Mono (código)
- **Componentes**: shadcn/ui basado en Radix UI
- **Responsive**: Diseño mobile-first optimizado
- **Accesibilidad**: ARIA labels, navegación por teclado, contraste WCAG AA

## 📱 Características Técnicas

### Sistema de Autenticación
- JWT almacenado en localStorage
- Refresh token automático
- Protección de rutas con middleware de Next.js
- Context API para estado global de usuario
- Redirección automática según rol

### Servicios API
- Clase base reutilizable (`ApiService`)
- Manejo centralizado de errores
- Interceptores automáticos para tokens JWT
- Timeout configurable (30 segundos)
- Soporte para subida de archivos (FormData)
- Retry automático en caso de fallo

### Reproductor Multimedia
- Soporte para video y audio
- Controles personalizados
- Barra de progreso interactiva
- Control de volumen
- Modo pantalla completa (solo video)
- Saltos de 10 segundos adelante/atrás

### Optimizaciones
- Lazy loading de componentes pesados
- Suspense boundaries para mejor UX
- Memoización de componentes
- Debouncing en búsquedas
- Paginación en listas largas

## 🧪 Testing (Recomendado para Producción)

\`\`\`bash
# Instalar dependencias de testing
npm install -D @testing-library/react @testing-library/jest-dom jest @testing-library/user-event

# Ejecutar tests
npm test

# Coverage
npm run test:coverage
\`\`\`

## 📦 Despliegue

### Vercel (Recomendado)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

\`\`\`bash
# Construir imagen
docker build -t eva-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://backend:8080/api eva-frontend
\`\`\`

### Variables de Entorno en Producción
\`\`\`env
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
\`\`\`

## 🔒 Seguridad

- ✅ Validación de inputs en formularios
- ✅ Sanitización de datos antes de enviar
- ✅ Protección CSRF con tokens
- ✅ Headers de seguridad configurados
- ✅ Validación de roles en rutas protegidas
- ✅ Timeout en peticiones para prevenir ataques
- ⚠️ **Importante**: Configurar CORS correctamente en el backend

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

### Guía de Estilo
- Usar TypeScript estricto
- Seguir convenciones de nombres en español
- Componentes funcionales con hooks
- Comentarios en español
- Tests para funcionalidades críticas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 📞 Soporte y Contacto

Para soporte, preguntas o reportar bugs:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación en `BACKEND_INTEGRATION.md`

## 🗺️ Roadmap Futuro

- [ ] Implementación de WebSockets para chat en tiempo real
- [ ] Sistema de gamificación con badges y logros
- [ ] Integración con servicios de videoconferencia (Zoom, Meet)
- [ ] App móvil nativa con React Native
- [ ] Sistema de recomendación de cursos con IA
- [ ] Soporte multiidioma completo (i18n)
- [ ] Modo offline con sincronización
- [ ] Analytics avanzado para profesores
- [ ] Exportación de informes en PDF
- [ ] Integración con sistemas LMS externos (Moodle, Canvas)
- [ ] Editor de contenido WYSIWYG
- [ ] Foros de discusión por curso

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de shadcn/ui](https://ui.shadcn.com)
- [Guía de TypeScript](https://www.typescriptlang.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## ✨ Créditos

Desarrollado con ❤️ para mejorar la educación en línea.

**Tecnologías principales:**
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS v4
- shadcn/ui

---

**Nota**: Este es el frontend completo. Necesitas implementar el backend de Spring Framework siguiendo la guía en `BACKEND_INTEGRATION.md` para que el sistema funcione completamente.
