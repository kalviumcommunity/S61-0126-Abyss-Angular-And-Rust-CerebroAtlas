use axum::{extract::{State, Json}, http::StatusCode, response::IntoResponse};
use serde::Deserialize;
use sqlx::PgPool;
use bcrypt::verify;

use crate::models::error::ServiceError;
use crate::models::user::User;

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

    // Query the users table for the email
    let user = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE email = $1",
        payload.email
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| {
        println!("[LOGIN DEBUG] DB error: {:?}", e);
        ServiceError::Unauthorized
    })?;

    if let Some(user_record) = user {
        // Detect if the stored hash is a bcrypt hash (starts with $2)
        let matches = if user_record.password_hash.starts_with("$2") {
            verify(&payload.password_hash, &user_record.password_hash).unwrap_or(false)
        } else {
            payload.password_hash == user_record.password_hash
        };

        if matches {
            println!("[LOGIN DEBUG] User found and authenticated for email='{}'!", payload.email);
            let response = serde_json::json!({
                "token": "example.jwt.token",
                "user": payload.email
            });
            return Ok((StatusCode::OK, Json(response)));
        }
    }

    println!("[LOGIN DEBUG] Authentication failed for email='{}'", payload.email);
    Err(ServiceError::Unauthorized)
}