use axum::{routing::get, Router};

use crate::config::AppState;
use crate::handlers::patients_handler::{create_patient, delete_patient, get_patient, list_patients, update_patient};

pub fn router(state: AppState) -> Router {
	Router::new()
		.route("/patients", get(list_patients).post(create_patient))
		.route("/patients/:id", get(get_patient).put(update_patient).delete(delete_patient))
		.with_state(state)
}
