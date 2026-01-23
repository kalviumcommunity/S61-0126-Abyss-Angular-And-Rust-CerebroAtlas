#![allow(dead_code)]

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConsentChange {
    pub changed_at: String,
    pub previous_value: bool,
    pub new_value: bool,
    pub changed_by: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Consent {
    pub id: String,
    pub patient_id: String,
    pub category: String,
    pub granted: bool,
    pub expires_at: Option<String>,
    pub updated_at: String,
    pub history: Option<Vec<ConsentChange>>,
}
