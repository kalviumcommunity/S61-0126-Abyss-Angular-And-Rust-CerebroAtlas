use axum::{routing::get, Router};
use crate::handlers::analytics_handler::get_analytics;
use sqlx::PgPool;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/analytics", get(get_analytics))
}
