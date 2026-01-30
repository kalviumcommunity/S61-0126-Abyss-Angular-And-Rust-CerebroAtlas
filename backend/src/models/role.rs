#![allow(dead_code)]

use serde::{Serialize, Deserialize};

use sqlx::FromRow;

#[derive(Serialize, Deserialize, Debug, Clone, FromRow)]
pub struct Role {
    pub id: i32,
    pub name: String,
}