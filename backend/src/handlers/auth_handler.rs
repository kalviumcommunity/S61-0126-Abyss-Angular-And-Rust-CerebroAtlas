use axum::{extract::{State, Json}, http::StatusCode, response::IntoResponse};
use serde::Deserialize;

use crate::config::AppState;
use crate::models::error::ServiceError;

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, ServiceError> {
    // Example logic: replace with your actual authentication
    let valid = payload.username == "admin" && payload.password == "password";
    if !valid {
        return Err(ServiceError::Unauthorized);
    }

    // Example response
    let response = serde_json::json!({
        "token": "example.jwt.token",
        "user": payload.username
    });

    Ok((StatusCode::OK, Json(response)))
}