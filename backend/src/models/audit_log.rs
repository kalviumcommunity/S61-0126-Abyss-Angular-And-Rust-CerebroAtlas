#![allow(dead_code)]

use serde::{Serialize, Deserialize};

use chrono::NaiveDateTime;
use sqlx::FromRow;

#[derive(Serialize, Deserialize, Debug, Clone, FromRow)]
pub struct AuditLog {
    pub id: i32,
    pub user_id: Option<i32>,
    pub action: String,
    pub created_at: Option<NaiveDateTime>,
}
