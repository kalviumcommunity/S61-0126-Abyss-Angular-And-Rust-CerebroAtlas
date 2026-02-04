use axum::{routing::get, Router};
use sqlx::PgPool;
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

mod routes;
mod config;
mod handlers;
mod models;

use crate::routes::{patients, records, auth, analytics, administration};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    // Load .env.local first (for local dev), then .env (for Docker)
    dotenvy::from_path_override(".env.local").ok();
    dotenvy::from_path_override(".env").ok();

    // Load DB config and connect
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = PgPool::connect(&db_url).await.expect("Failed to connect to DB");

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health))
        .merge(auth::routes().with_state(pool.clone()))
        .merge(patients::routes().with_state(pool.clone()))
        .merge(records::routes().with_state(pool.clone()))
        .merge(analytics::routes().with_state(pool.clone()))
        .merge(administration::routes().with_state(pool.clone()))
        .layer(TraceLayer::new_for_http())
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> &'static str {
    "OK"
}