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
    // Debug: print incoming payload
    println!("[LOGIN DEBUG] Incoming payload: email='{}', password_hash='{}'", payload.email, payload.password_hash);

    // Query the users table for the email and password_hash
    let user = sqlx::query!(
        "SELECT * FROM users WHERE email = $1 AND password_hash = $2",
        payload.email,
        payload.password_hash
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| {
        println!("[LOGIN DEBUG] DB error: {:?}", e);
        ServiceError::Unauthorized
    })?;

    // Debug: print query result
    if user.is_none() {
        println!("[LOGIN DEBUG] No user found for email='{}' and given password_hash.", payload.email);
        return Err(ServiceError::Unauthorized);
    } else {
        println!("[LOGIN DEBUG] User found for email='{}'!", payload.email);
    }

    // Example response (replace with JWT or session logic as needed)
    let response = serde_json::json!({
        "token": "example.jwt.token",
        "user": payload.email
    });

    Ok((StatusCode::OK, Json(response)))
}