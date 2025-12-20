#!/bin/bash

# Script de inicio optimizado para el backend de HealthConnect
# Configura JVM para mejor rendimiento y arranca la aplicación

echo "🚀 Iniciando HealthConnect Backend..."

# Configuración de JVM optimizada para Spring Boot
JVM_OPTS="
-Xms512m
-Xmx1024m
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200
-XX:+UseStringDeduplication
-XX:+OptimizeStringConcat
-Djava.security.egd=file:/dev/./urandom
-Dspring.profiles.active=development
"

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"

cd "$BACKEND_DIR" || exit 1

# Verificar que PostgreSQL esté corriendo
echo "🔍 Verificando conexión a PostgreSQL..."
if ! pg_isready -h localhost -p 5432 -U postgres >/dev/null 2>&1; then
    echo "❌ PostgreSQL no está disponible. Inicie PostgreSQL primero."
    echo "💡 Comando sugerido: sudo systemctl start postgresql"
    exit 1
fi

# Verificar que el puerto 8080 esté disponible
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  El puerto 8080 ya está en uso. Deteniendo proceso existente..."
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo "📦 Compilando proyecto..."
if ! mvn clean compile -q; then
    echo "❌ Error en compilación"
    exit 1
fi

echo "🏃 Arrancando aplicación con configuración optimizada..."
echo "JVM Options: $JVM_OPTS"

# Arrancar con configuración optimizada
exec mvn spring-boot:run -Dspring-boot.run.jvmArguments="$JVM_OPTS"

echo "✅ Backend iniciado exitosamente en http://localhost:8080"