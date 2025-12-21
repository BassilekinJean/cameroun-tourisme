# Multi-stage Dockerfile
# Stage 1: Build the Frontend
FROM node:18-alpine AS frontend
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the frontend code and build
COPY client/ ./
RUN npm run build

# Stage 2: Build the Backend
FROM maven:3.9-eclipse-temurin-21 AS backend
WORKDIR /app/server

# Copy pom.xml and download dependencies
COPY server/pom.xml ./
RUN mvn dependency:go-offline

# Copy backend source code
COPY server/src ./src

# Copy built frontend assets to Spring Boot static resources directory
COPY --from=frontend /app/client/dist ./src/main/resources/static

# Build the application
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the built jar from the backend stage
COPY --from=backend /app/server/target/*.jar app.jar

# Expose port (Render uses standard Port env var)
EXPOSE 8080

# Command to run the application, respecting the PORT environment variable if set
ENTRYPOINT ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
