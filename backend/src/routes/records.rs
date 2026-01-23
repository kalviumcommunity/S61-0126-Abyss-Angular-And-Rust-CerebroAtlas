use axum::{routing::get, Router};

use crate::config::AppState;
use crate::handlers::records_handler::{create_record, delete_record, get_record, list_records, update_record};

pub fn router(state: AppState) -> Router {
	Router::new()
		.route("/records", get(list_records).post(create_record))
		.route("/records/:id", get(get_record).put(update_record).delete(delete_record))
		.with_state(state)
}
