use axum::{routing::post, Router};
use crate::handlers::auth_handler::login;
use sqlx::PgPool;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/login", post(login))
}