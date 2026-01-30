use axum::{routing::get, Router};
use crate::handlers::patients_handler::{
    list_patients, get_patient, create_patient, update_patient, delete_patient,
};
use sqlx::PgPool;

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/patients", get(list_patients).post(create_patient))
        .route("/patients/:id", get(get_patient).put(update_patient).delete(delete_patient))
}
