FROM openjdk:21-jdk-slim

WORKDIR /app

# Copiar archivos de Maven
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Descargar dependencias (esto se cachea si no cambian)
RUN ./mvnw dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Construir la aplicación
RUN ./mvnw clean package -DskipTests

# Exponer puerto
EXPOSE 8080

# Ejecutar la aplicación
CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]