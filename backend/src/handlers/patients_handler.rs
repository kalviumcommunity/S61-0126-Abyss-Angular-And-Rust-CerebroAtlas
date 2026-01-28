use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::config::AppState;
use crate::models::patient::{Address, EmergencyContact, Patient};
use crate::models::error::ServiceError;

#[derive(Deserialize)]
pub struct CreatePatientRequest {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: String,
    pub gender: String,
    pub phone_number: String,
    pub middle_name: Option<String>,
    pub blood_type: Option<String>,
    pub email: Option<String>,
    pub address: Option<Address>,
    pub village: Option<String>,
    pub emergency_contact: Option<EmergencyContact>,
    #[serde(default)]
    pub active_conditions: Option<Vec<String>>,
    #[serde(default)]
    pub known_allergies: Option<Vec<String>>,
    pub additional_notes: Option<String>,
    pub status: Option<String>,
    pub critical_flag: Option<bool>,
    pub profile_picture_url: Option<String>,
    pub next_visit: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdatePatientRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub date_of_birth: Option<String>,
    pub gender: Option<String>,
    pub phone_number: Option<String>,
    pub middle_name: Option<String>,
    pub blood_type: Option<String>,
    pub email: Option<String>,
    pub address: Option<Address>,
    pub village: Option<String>,
    pub emergency_contact: Option<EmergencyContact>,
    pub active_conditions: Option<Vec<String>>,
    pub known_allergies: Option<Vec<String>>,
    pub additional_notes: Option<String>,
    pub status: Option<String>,
    pub critical_flag: Option<bool>,
    pub profile_picture_url: Option<String>,
    pub next_visit: Option<String>,
}

pub async fn list_patients(
    State(state): State<AppState>,
) -> Result<Json<Vec<Patient>>, ServiceError> {
    let patients = state.patients.read().await;
    let result = patients.values().cloned().collect();
    Ok(Json(result))
}

pub async fn get_patient(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<Patient>, ServiceError> {
    let patients = state.patients.read().await;
    if let Some(patient) = patients.get(&id) {
        Ok(Json(patient.clone()))
    } else {
        Err(ServiceError::NotFound)
    }
}

pub async fn create_patient(
    State(state): State<AppState>,
    Json(payload): Json<CreatePatientRequest>,
) -> Result<(StatusCode, Json<Patient>), ServiceError> {
    let mut patients = state.patients.write().await;
    let now = Utc::now().to_rfc3339();
    let id = Uuid::new_v4().to_string();

    let patient = Patient {
        id: id.clone(),
        first_name: payload.first_name,
        middle_name: payload.middle_name,
        last_name: payload.last_name,
        date_of_birth: payload.date_of_birth,
        gender: payload.gender,
        blood_type: payload.blood_type,
        phone_number: payload.phone_number,
        email: payload.email,
        address: payload.address,
        village: payload.village,
        emergency_contact: payload.emergency_contact,
        active_conditions: payload.active_conditions.unwrap_or_default(),
        known_allergies: payload.known_allergies.unwrap_or_default(),
        additional_notes: payload.additional_notes,
        status: payload.status.unwrap_or_else(|| "active".to_string()),
        critical_flag: payload.critical_flag,
        profile_picture_url: payload.profile_picture_url,
        next_visit: payload.next_visit,
        created_at: now.clone(),
        updated_at: now,
    };

    patients.insert(id.clone(), patient.clone());

    Ok((StatusCode::CREATED, Json(patient)))
}

pub async fn update_patient(
    Path(id): Path<String>,
    State(state): State<AppState>,
    Json(payload): Json<UpdatePatientRequest>,
) -> Result<Json<Patient>, ServiceError> {
    let mut patients = state.patients.write().await;

    let patient = patients.get_mut(&id).ok_or(ServiceError::NotFound)?;

    if let Some(value) = payload.first_name { patient.first_name = value; }
    if let Some(value) = payload.last_name { patient.last_name = value; }
    if let Some(value) = payload.date_of_birth { patient.date_of_birth = value; }
    if let Some(value) = payload.gender { patient.gender = value; }
    if let Some(value) = payload.phone_number { patient.phone_number = value; }
    if let Some(value) = payload.middle_name { patient.middle_name = Some(value); }
    if let Some(value) = payload.blood_type { patient.blood_type = Some(value); }
    if let Some(value) = payload.email { patient.email = Some(value); }
    if let Some(value) = payload.address { patient.address = Some(value); }
    if let Some(value) = payload.village { patient.village = Some(value); }
    if let Some(value) = payload.emergency_contact { patient.emergency_contact = Some(value); }
    if let Some(value) = payload.active_conditions { patient.active_conditions = value; }
    if let Some(value) = payload.known_allergies { patient.known_allergies = value; }
    if let Some(value) = payload.additional_notes { patient.additional_notes = Some(value); }
    if let Some(value) = payload.status { patient.status = value; }
    if let Some(value) = payload.critical_flag { patient.critical_flag = Some(value); }
    if let Some(value) = payload.profile_picture_url { patient.profile_picture_url = Some(value); }
    if let Some(value) = payload.next_visit { patient.next_visit = Some(value); }

    patient.updated_at = Utc::now().to_rfc3339();

    Ok(Json(patient.clone()))
}

pub async fn delete_patient(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> Result<StatusCode, ServiceError> {
    let mut patients = state.patients.write().await;
    let removed = patients.remove(&id);

    match removed {
        Some(_) => Ok(StatusCode::NO_CONTENT),
        None => Err(ServiceError::NotFound),
    }
}
