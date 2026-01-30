#![allow(dead_code)]

use serde::{Serialize, Deserialize};

use chrono::NaiveDateTime;
use sqlx::FromRow;

#[derive(Serialize, Deserialize, Debug, Clone, FromRow)]
pub struct MedicalReport {
    pub id: i32,
    pub record_id: i32,
    pub report_url: String,
    pub created_at: Option<NaiveDateTime>,
}