#![allow(dead_code)]

use serde::{Serialize, Deserialize};

use chrono::NaiveDateTime;
use sqlx::FromRow;

#[derive(Serialize, Deserialize, Debug, Clone, FromRow)]
pub struct Consent {
    pub id: i32,
    pub patient_id: i32,
    pub consent_type: String,
    pub granted: bool,
    pub created_at: Option<NaiveDateTime>,
}
