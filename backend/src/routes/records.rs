use axum::{routing::{get, post, put, delete}, Router};
use crate::handlers::records_handler::{
    list_records, get_record, create_record, update_record, delete_record,
};
use crate::config::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/records", get(list_records).post(create_record))
        .route("/records/:id", get(get_record).put(update_record).delete(delete_record))
}
