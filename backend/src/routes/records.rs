use axum::{routing::get, Router};
use crate::handlers::records_handler::{
    list_records, get_record, create_record, update_record, delete_record,
};
use sqlx::PgPool;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/records", get(list_records).post(create_record))
        .route("/records/:id", get(get_record).put(update_record).delete(delete_record))
}
