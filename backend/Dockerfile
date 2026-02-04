# Stage 1: Build Rust binary
FROM rust:latest as builder
WORKDIR /app
COPY . .

# Ensure sqlx macros use offline cache
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/backend_db
ENV SQLX_OFFLINE=true
RUN cargo build --release

# Stage 2: Minimal runtime
FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/backend .
EXPOSE 8080
CMD ["./backend"]