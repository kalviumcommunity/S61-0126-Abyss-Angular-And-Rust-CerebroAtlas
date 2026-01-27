use axum::{routing::post, Router};
use crate::handlers::auth_handler::login;
use crate::config::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(login))
}