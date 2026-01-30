use serde::{Serialize, Deserialize};
use chrono::{NaiveDate, NaiveDateTime};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, Debug, Clone, FromRow)]
pub struct MedicalRecord {
    pub id: i32,
    pub patient_id: i32,
    pub record_type: String,
    pub record_category: Option<String>,
    pub title: String,
    pub provider: String,
    pub date: NaiveDate,
    pub status: String,
    pub description: Option<String>,
    pub secondary_status: Option<String>,
    pub reviewed_by: Option<String>,
    pub attachments: Option<Vec<String>>,
    pub is_exported: Option<bool>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

// Additional context or functions can follow here
