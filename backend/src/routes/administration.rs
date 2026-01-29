use axum::{routing::get, Router};
use crate::handlers::administration_handler::get_administration;
use crate::config::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/administration", get(get_administration))
}
