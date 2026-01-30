use axum::{extract::{State, Json}, http::StatusCode, response::IntoResponse};
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::error::ServiceError;


#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password_hash: String,
}

pub async fn login(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, ServiceError> {
    // Query the users table for the email and password_hash
    let user = sqlx::query!(
        "SELECT * FROM users WHERE email = $1 AND password_hash = $2",
        payload.email,
        payload.password_hash
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| ServiceError::Unauthorized)?;

    if user.is_none() {
        return Err(ServiceError::Unauthorized);
    }

    // Example response (replace with JWT or session logic as needed)
    let response = serde_json::json!({
        "token": "example.jwt.token",
        "user": payload.email
    });

    Ok((StatusCode::OK, Json(response)))
}