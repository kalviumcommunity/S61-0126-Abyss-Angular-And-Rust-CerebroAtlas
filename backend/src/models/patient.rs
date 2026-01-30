
use serde::{Serialize, Deserialize};
use chrono::{NaiveDate, NaiveDateTime};
use serde_json::Value;
use sqlx::FromRow;


#[derive(Serialize, Deserialize, Debug, Clone, FromRow)]
pub struct Patient {
    pub id: i32,
    pub first_name: String,
    pub middle_name: Option<String>,
    pub last_name: String,
    pub date_of_birth: NaiveDate,
    pub gender: String,
    pub blood_type: Option<String>,
    pub phone_number: String,
    pub email: Option<String>,
    pub address: Option<Value>,
    pub village: Option<String>,
    pub emergency_contact: Option<Value>,
    pub active_conditions: Option<Vec<String>>,
    pub known_allergies: Option<Vec<String>>,
    pub additional_notes: Option<String>,
    pub status: String,
    pub critical_flag: Option<bool>,
    pub profile_picture_url: Option<String>,
    pub next_visit: Option<NaiveDate>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}
