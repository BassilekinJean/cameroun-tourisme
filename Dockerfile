# ================================================================
# Multi-stage Dockerfile: React Frontend + Spring Boot Backend
# Builds a single, unified container running on 1 single port (8080)
# ================================================================

# ----------------------------------------------------------------
# Stage 1: Build React Frontend
# ----------------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm ci

# Copy source code and build production assets
COPY client/ ./
# Build with relative API paths since API and Frontend are served on the same domain
ENV VITE_API_URL=/api
RUN npm run build

# ----------------------------------------------------------------
# Stage 2: Build Spring Boot Backend with React assets bundled
# ----------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/server

# Copy pom.xml and download dependencies
COPY server/pom.xml ./
RUN mvn dependency:go-offline -B

# Copy Spring Boot source code
COPY server/ ./

# Copy built React static assets into Spring Boot's static resources folder
COPY --from=frontend-builder /app/client/dist ./src/main/resources/static/

# Package Spring Boot application into a single executable JAR
RUN mvn package -DskipTests

# ----------------------------------------------------------------
# Stage 3: Lightweight Production Runtime
# ----------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy executable JAR from backend-builder
COPY --from=backend-builder /app/server/target/*.jar app.jar

# Render assigns a dynamic PORT environment variable (default 8080)
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
