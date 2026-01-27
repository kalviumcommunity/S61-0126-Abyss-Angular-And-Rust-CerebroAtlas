
use axum::{routing::get, Router};
use std::net::SocketAddr;

mod routes;
mod config;
mod handlers;
mod models;

use crate::routes::{patients, records};
use crate::config::AppState;


#[tokio::main]
async fn main() {
    let state = AppState::default();

    let app = Router::new()
        .route("/health", get(health))
        .merge(patients::router(state.clone()))
        .merge(records::router(state));

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health() -> &'static str {
    "OK"
}
