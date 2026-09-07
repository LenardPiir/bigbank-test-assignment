FROM eclipse-temurin:21-jdk

WORKDIR /app
COPY . .
RUN chmod +x gradlew && ./gradlew build -x test --no-daemon

CMD ["./gradlew", "run", "--no-daemon"]
