use axum::{Json, extract::State};
use axum::http::StatusCode;
use serde::Deserialize;
use bcrypt::{hash, DEFAULT_COST};
use sqlx::Error as SqlxError;
#[derive(Deserialize)]
pub struct NewUser {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub role: String,
    pub department: String,
    pub specialization: Option<String>,
    pub license_number: Option<String>,
    pub username: String,
    pub password: String,
    pub status: String,
    pub permissions: Option<Vec<String>>,
}
pub async fn create_user(
    State(pool): State<PgPool>,
    Json(payload): Json<NewUser>,
) -> Result<StatusCode, (StatusCode, String)> {
    use std::borrow::Cow;
    // Hash password
    let password_hash = hash(&payload.password, DEFAULT_COST)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Password hash failed".to_string()))?;

    // Use sqlx::query for runtime queries
    let res = sqlx::query(
        r#"INSERT INTO users (email, password_hash, created_at)
            VALUES ($1, $2, now())"#
    )
    .bind(&payload.email)
    .bind(&password_hash)
    .execute(&pool)
    .await;

    match res {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(SqlxError::Database(db_err)) if db_err.code() == Some(Cow::Borrowed("23505")) => {
            // Unique violation
            Err((StatusCode::CONFLICT, "Email already exists".to_string()))
        }
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("DB error: {}", e)))
    }
}
use serde::Serialize;
use sqlx::PgPool;
use crate::models::user::User;
use crate::models::role::Role;


#[derive(Serialize)]
pub struct AdministrationStats {
    pub total_users: i64,
    pub roles: i64,
}

#[derive(Serialize)]
pub struct AdministrationResponse {
    pub stats: AdministrationStats,
    pub users: Vec<User>,
    pub roles: Vec<Role>,
}

pub async fn get_administration(State(pool): State<PgPool>) -> Json<AdministrationResponse> {
    // Users
    let users = sqlx::query_as!(User, "SELECT * FROM users")
        .fetch_all(&pool).await.unwrap_or_default();
    let total_users = users.len() as i64;
    // Roles
    let roles = sqlx::query_as!(Role, "SELECT * FROM roles")
        .fetch_all(&pool).await.unwrap_or_default();
    let roles_count = roles.len() as i64;

    Json(AdministrationResponse {
        stats: AdministrationStats {
            total_users,
            roles: roles_count,
        },
        users,
        roles,
    })
}
