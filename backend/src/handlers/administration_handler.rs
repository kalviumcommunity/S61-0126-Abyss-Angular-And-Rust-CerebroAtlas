use axum::{Json, extract::State};
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
