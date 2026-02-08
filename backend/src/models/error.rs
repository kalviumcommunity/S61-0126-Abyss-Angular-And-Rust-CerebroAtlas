use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
}

#[derive(Debug)]
pub enum ServiceError {
    Unauthorized,
    NotFound,
    InternalServerError,
}

impl IntoResponse for ServiceError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            ServiceError::Unauthorized => (StatusCode::UNAUTHORIZED, "Unauthorized".to_string()),
            ServiceError::NotFound => (StatusCode::NOT_FOUND, "Not Found".to_string()),
            ServiceError::InternalServerError => (StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".to_string()),
        };
        let body = Json(ErrorResponse { error: error_message });
        (status, body).into_response()
    }
}