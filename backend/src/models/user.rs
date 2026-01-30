#![allow(dead_code)]

use serde::{Serialize, Deserialize};

use chrono::NaiveDateTime;
use sqlx::FromRow;

#[derive(Serialize, Deserialize, Debug, Clone, FromRow)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub password_hash: String,
    pub created_at: Option<NaiveDateTime>,
}
