use axum::{routing::get, Router};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
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

    let state = AppState::default();

    let app = Router::new()
        .route("/health", get(health))
        .merge(auth::routes().with_state(state.clone()))
        .merge(patients::routes().with_state(state.clone()))
        .merge(records::routes().with_state(state.clone()))
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> &'static str {
    "OK"
}