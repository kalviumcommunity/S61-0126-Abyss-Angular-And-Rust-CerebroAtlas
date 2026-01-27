use axum::{routing::{get, post, put, delete}, Router};
use crate::handlers::patients_handler::{
    list_patients, get_patient, create_patient, update_patient, delete_patient,
};
use crate::config::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/patients", get(list_patients).post(create_patient))
        .route("/patients/:id", get(get_patient).put(update_patient).delete(delete_patient))
}
