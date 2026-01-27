use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use serde::Deserialize;
use uuid::Uuid;

use crate::config::AppState;
use crate::models::record::MedicalRecord;
use crate::models::error::ServiceError;

#[derive(Deserialize)]
pub struct CreateRecordRequest {
    pub patient_id: String,
    pub record_type: String,
    pub title: String,
    pub provider: String,
    pub date: String,
    pub status: String,
    pub record_category: Option<String>,
    pub description: Option<String>,
    pub secondary_status: Option<String>,
    pub reviewed_by: Option<String>,
    pub attachments: Option<Vec<String>>,
    pub is_exported: Option<bool>,
}

#[derive(Deserialize)]
pub struct UpdateRecordRequest {
    pub record_type: Option<String>,
    pub title: Option<String>,
    pub provider: Option<String>,
    pub date: Option<String>,
    pub status: Option<String>,
    pub record_category: Option<String>,
    pub description: Option<String>,
    pub secondary_status: Option<String>,
    pub reviewed_by: Option<String>,
    pub attachments: Option<Vec<String>>,
    pub is_exported: Option<bool>,
}

pub async fn list_records(
    State(state): State<AppState>,
) -> Result<Json<Vec<MedicalRecord>>, ServiceError> {
    let records = state.records.read().await;
    let result: Vec<MedicalRecord> = records.values().cloned().collect();
    Ok(Json(result))
}

pub async fn get_record(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<MedicalRecord>, ServiceError> {
    let records = state.records.read().await;
    if let Some(record) = records.get(&id) {
        Ok(Json(record.clone()))
    } else {
        Err(ServiceError::NotFound)
    }
}

pub async fn create_record(
    State(state): State<AppState>,
    Json(payload): Json<CreateRecordRequest>,
) -> Result<(StatusCode, Json<MedicalRecord>), ServiceError> {
    let patients = state.patients.read().await;
    if !patients.contains_key(&payload.patient_id) {
        return Err(ServiceError::BadRequest("Patient does not exist".to_string()));
    }
    drop(patients);

    let mut records = state.records.write().await;
    let now = Utc::now().to_rfc3339();
    let id = Uuid::new_v4().to_string();

    let record = MedicalRecord {
        id: id.clone(),
        patient_id: payload.patient_id.clone(),
        record_type: payload.record_type.clone(),
        record_category: payload.record_category.clone(),
        title: payload.title.clone(),
        provider: payload.provider.clone(),
        date: payload.date.clone(),
        status: payload.status.clone(),
        description: payload.description.clone(),
        secondary_status: payload.secondary_status.clone(),
        reviewed_by: payload.reviewed_by.clone(),
        attachments: payload.attachments.clone(),
        is_exported: payload.is_exported,
        created_at: now.clone(),
        updated_at: now,
    };

    records.insert(id.clone(), record.clone());

    Ok((StatusCode::CREATED, Json(record)))
}

pub async fn update_record(
    Path(id): Path<String>,
    State(state): State<AppState>,
    Json(payload): Json<UpdateRecordRequest>,
) -> Result<Json<MedicalRecord>, ServiceError> {
    let mut records = state.records.write().await;

    let record = records.get_mut(&id).ok_or(ServiceError::NotFound)?;

    if let Some(value) = payload.record_type.clone() { record.record_type = value; }
    if let Some(value) = payload.title.clone() { record.title = value; }
    if let Some(value) = payload.provider.clone() { record.provider = value; }
    if let Some(value) = payload.date.clone() { record.date = value; }
    if let Some(value) = payload.status.clone() { record.status = value; }
    if let Some(value) = payload.record_category.clone() { record.record_category = Some(value); }
    if let Some(value) = payload.description.clone() { record.description = Some(value); }
    if let Some(value) = payload.secondary_status.clone() { record.secondary_status = Some(value); }
    if let Some(value) = payload.reviewed_by.clone() { record.reviewed_by = Some(value); }
    if let Some(value) = payload.attachments.clone() { record.attachments = Some(value); }
    if let Some(value) = payload.is_exported { record.is_exported = Some(value); }

    record.updated_at = Utc::now().to_rfc3339();

    Ok(Json(record.clone()))
}

pub async fn delete_record(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> Result<StatusCode, ServiceError> {
    let mut records = state.records.write().await;
    let removed = records.remove(&id);

    match removed {
        Some(_) => Ok(StatusCode::NO_CONTENT),
        None => Err(ServiceError::NotFound),
    }
}
