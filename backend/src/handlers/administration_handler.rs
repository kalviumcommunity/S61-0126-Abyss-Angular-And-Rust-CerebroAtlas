use axum::{Json, extract::State};
use serde::Serialize;
use crate::config::AppState;
use crate::models::user::User;
use crate::models::role::Role;

#[derive(Serialize)]
pub struct AdministrationStats {
    pub total_users: usize,
    pub active_users: usize,
    pub inactive_users: usize,
    pub roles: usize,
}

#[derive(Serialize)]
pub struct AdministrationResponse {
    pub stats: AdministrationStats,
    pub users: Vec<User>,
    pub roles: Vec<Role>,
}

pub async fn get_administration(State(state): State<AppState>) -> Json<AdministrationResponse> {
    let users = state.users.read().await;
    let roles = state.roles.read().await;
    let total_users = users.len();
    let active_users = users.values().filter(|u| u.is_active).count();
    let inactive_users = total_users - active_users;
    let roles_count = roles.len();

    Json(AdministrationResponse {
        stats: AdministrationStats {
            total_users,
            active_users,
            inactive_users,
            roles: roles_count,
        },
        users: users.values().cloned().collect(),
        roles: roles.values().cloned().collect(),
    })
}
