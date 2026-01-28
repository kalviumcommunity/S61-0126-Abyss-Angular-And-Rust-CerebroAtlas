use axum::{routing::get, Router};
use dotenvy::dotenv;
use crate::config::db::DbConfig;
use sqlx::PgPool;
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

mod routes;
mod config;
mod handlers;
mod models;

use crate::routes::{patients, records, auth};
use crate::config::AppState;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    dotenv().ok();

    // Load DB config and connect
    let db_config = DbConfig::from_env();
    let db_url = db_config.to_url();
    let pool = PgPool::connect(&db_url).await.expect("Failed to connect to DB");

    let state = AppState::default();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health))
        .merge(auth::routes().with_state(state.clone()))
        .merge(patients::routes().with_state(state.clone()))
        .merge(records::routes().with_state(state.clone()))
        .layer(TraceLayer::new_for_http())
        .layer(cors);

    // Optionally: pass pool to state or app if needed

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> &'static str {
    "OK"
}