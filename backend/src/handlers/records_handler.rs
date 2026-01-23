use axum::{extract::{Path, State}, http::StatusCode, Json};
use chrono::Utc;
use serde::Deserialize;
use uuid::Uuid;

use crate::config::AppState;
use crate::handlers::patients_handler::ApiError;
use crate::models::record::MedicalRecord;

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

pub async fn list_records(State(state): State<AppState>) -> Json<Vec<MedicalRecord>> {
	let records = state.records.read().await;
	let result = records.values().cloned().collect();
	Json(result)
}

pub async fn get_record(
	Path(id): Path<String>,
	State(state): State<AppState>,
) -> Result<Json<MedicalRecord>, (StatusCode, Json<ApiError>)> {
	let records = state.records.read().await;
	if let Some(record) = records.get(&id) {
		return Ok(Json(record.clone()));
	}

	Err((
		StatusCode::NOT_FOUND,
		Json(ApiError {
			message: "Record not found".to_string(),
		}),
	))
}

pub async fn create_record(
	State(state): State<AppState>,
	Json(payload): Json<CreateRecordRequest>,
) -> Result<(StatusCode, Json<MedicalRecord>), (StatusCode, Json<ApiError>)> {
	let patients = state.patients.read().await;
	if !patients.contains_key(&payload.patient_id) {
		return Err((
			StatusCode::BAD_REQUEST,
			Json(ApiError {
				message: "Patient does not exist".to_string(),
			}),
		));
	}
	drop(patients);

	let mut records = state.records.write().await;
	let now = Utc::now().to_rfc3339();
	let id = Uuid::new_v4().to_string();

	let record = MedicalRecord {
		id: id.clone(),
		patient_id: payload.patient_id,
		record_type: payload.record_type,
		record_category: payload.record_category,
		title: payload.title,
		provider: payload.provider,
		date: payload.date,
		status: payload.status,
		description: payload.description,
		secondary_status: payload.secondary_status,
		reviewed_by: payload.reviewed_by,
		attachments: payload.attachments,
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
) -> Result<Json<MedicalRecord>, (StatusCode, Json<ApiError>)> {
	let mut records = state.records.write().await;

	let record = records.get_mut(&id).ok_or_else(|| {
		(
			StatusCode::NOT_FOUND,
			Json(ApiError {
				message: "Record not found".to_string(),
			}),
		)
	})?;

	if let Some(value) = payload.record_type { record.record_type = value; }
	if let Some(value) = payload.title { record.title = value; }
	if let Some(value) = payload.provider { record.provider = value; }
	if let Some(value) = payload.date { record.date = value; }
	if let Some(value) = payload.status { record.status = value; }
	if let Some(value) = payload.record_category { record.record_category = Some(value); }
	if let Some(value) = payload.description { record.description = Some(value); }
	if let Some(value) = payload.secondary_status { record.secondary_status = Some(value); }
	if let Some(value) = payload.reviewed_by { record.reviewed_by = Some(value); }
	if let Some(value) = payload.attachments { record.attachments = Some(value); }
	if let Some(value) = payload.is_exported { record.is_exported = Some(value); }

	record.updated_at = Utc::now().to_rfc3339();

	Ok(Json(record.clone()))
}

pub async fn delete_record(
	Path(id): Path<String>,
	State(state): State<AppState>,
) -> Result<StatusCode, (StatusCode, Json<ApiError>)> {
	let mut records = state.records.write().await;
	let removed = records.remove(&id);

	match removed {
		Some(_) => Ok(StatusCode::NO_CONTENT),
		None => Err((
			StatusCode::NOT_FOUND,
			Json(ApiError {
				message: "Record not found".to_string(),
			}),
		)),
	}
}
