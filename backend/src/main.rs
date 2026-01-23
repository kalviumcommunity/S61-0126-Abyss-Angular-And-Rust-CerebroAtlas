mod config;
mod handlers;
mod models;
mod routes;

use axum::{routing::get, Json, Router};
use serde_json::json;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

use crate::config::AppState;
use crate::routes::{patients, records};

async fn root() -> &'static str {
    "Rust Axum backend running"
}

async fn health() -> Json<serde_json::Value> {
    Json(json!({ "status": "ok" }))
}

#[tokio::main]
async fn main() {
    let state = AppState::default();

    let cors = CorsLayer::permissive();

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        .merge(patients::router(state.clone()))
        .merge(records::router(state.clone()))
        .layer(cors);

    let listener = TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();

    println!("Running on http://127.0.0.1:8080");

    axum::serve(listener, app).await.unwrap();
}
