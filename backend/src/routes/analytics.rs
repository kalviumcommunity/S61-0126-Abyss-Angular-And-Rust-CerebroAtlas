use axum::{routing::get, Router};
use crate::handlers::analytics_handler::get_analytics;
use crate::config::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/analytics", get(get_analytics))
}
