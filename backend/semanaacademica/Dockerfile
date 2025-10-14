# ---- STAGE 1: build (Maven) ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src

# Copia wrapper e POM primeiro (cache)
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Corrige final de linha do Windows e dá permissão de execução
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Baixa dependências offline (build mais rápido e estável)
RUN ./mvnw -q -DskipTests dependency:go-offline

# Copia o código e builda
COPY src ./src
RUN ./mvnw -q -DskipTests clean package

# ---- STAGE 2: runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/target/*.jar app.jar
ENV JAVA_OPTS="-XX:+UseG1GC"
EXPOSE 8080
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
