use axum::{Json, extract::{State, Path}, routing::{get, post, put}, Router};
use sqlx::PgPool;
use crate::models::consent::Consent;
use axum::http::StatusCode;

// List all consents
pub async fn list_consents(State(pool): State<PgPool>) -> Result<Json<Vec<Consent>>, StatusCode> {
    let consents = sqlx::query_as!(Consent, "SELECT * FROM consents")
        .fetch_all(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(consents))
}

// Get a single consent by id
pub async fn get_consent(State(pool): State<PgPool>, Path(id): Path<i32>) -> Result<Json<Consent>, StatusCode> {
    let consent = sqlx::query_as!(Consent, "SELECT * FROM consents WHERE id = $1", id)
        .fetch_one(&pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(consent))
}

// Update a consent (grant/revoke)
#[derive(serde::Deserialize)]
pub struct UpdateConsent {
    pub granted: bool,
}

pub async fn update_consent(State(pool): State<PgPool>, Path(id): Path<i32>, Json(payload): Json<UpdateConsent>) -> Result<StatusCode, StatusCode> {
    sqlx::query!("UPDATE consents SET granted = $1 WHERE id = $2", payload.granted, id)
        .execute(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::NO_CONTENT)
}

pub fn routes() -> Router<PgPool> {
    Router::new()
        .route("/consents", get(list_consents))
        .route("/consents/:id", get(get_consent).put(update_consent))
}
