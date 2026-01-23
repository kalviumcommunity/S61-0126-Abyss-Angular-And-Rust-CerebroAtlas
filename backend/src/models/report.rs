#![allow(dead_code)]

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MedicalReport {
    pub id: String,
    pub patient_id: String,
    pub report_type: String,
    pub report_category: Option<String>,
    pub doctor: String,
    pub date: String,
    pub status: String,
    pub description: Option<String>,
    pub attachments: Option<Vec<String>>,
    pub is_exported: Option<bool>,
    pub created_at: String,
    pub updated_at: String,
}