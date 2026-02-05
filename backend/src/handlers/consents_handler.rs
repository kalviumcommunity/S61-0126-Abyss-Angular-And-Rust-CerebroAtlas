use axum::{extract::{State, Path}, Json};
use sqlx::PgPool;
use crate::models::consent::Consent;
use axum::http::StatusCode;

pub async fn list_consents(State(pool): State<PgPool>) -> Result<Json<Vec<Consent>>, StatusCode> {
    let consents = sqlx::query_as!(Consent, "SELECT * FROM consents")
        .fetch_all(&pool)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(Json(consents))
}

pub async fn get_consent(State(pool): State<PgPool>, Path(id): Path<i32>) -> Result<Json<Consent>, StatusCode> {
    let consent = sqlx::query_as!(Consent, "SELECT * FROM consents WHERE id = $1", id)
        .fetch_one(&pool)
        .await
        .map_err(|_| StatusCode::NOT_FOUND)?;
    Ok(Json(consent))
}

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
