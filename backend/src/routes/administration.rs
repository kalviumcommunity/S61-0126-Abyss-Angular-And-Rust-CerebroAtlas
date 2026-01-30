use axum::{routing::get, Router};
use crate::handlers::administration_handler::get_administration;
use sqlx::PgPool;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/administration", get(get_administration))
}
