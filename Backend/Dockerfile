# Etapa 1: Compilación de la aplicación
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Etapa 2: Imagen final optimizada para ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/backend-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 4000
ENTRYPOINT ["java", "-jar", "app.jar"]
