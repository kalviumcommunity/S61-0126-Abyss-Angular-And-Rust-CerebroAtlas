use axum::{routing::{get, post}, Router};
use crate::handlers::administration_handler::get_administration;
use crate::handlers::administration_handler::create_user;
use sqlx::PgPool;

pub fn routes() -> Router<PgPool> {
    Router::new()
    .route("/administration", get(get_administration))
    .route("/api/users", post(create_user))
}
