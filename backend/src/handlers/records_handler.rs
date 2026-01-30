use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::{Utc, NaiveDate, NaiveDateTime};
use serde::Deserialize;
use sqlx::PgPool;
use serde_json;

use crate::models::record::MedicalRecord;
use crate::models::error::ServiceError;

#[derive(Deserialize)]
pub struct CreateRecordRequest {
    pub patient_id: i32,
    pub record_type: String,
    pub title: String,
    pub provider: String,
    pub date: NaiveDate,
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
    pub date: Option<NaiveDate>,
    pub status: Option<String>,
    pub record_category: Option<String>,
    pub description: Option<String>,
    pub secondary_status: Option<String>,
    pub reviewed_by: Option<String>,
    pub attachments: Option<Vec<String>>,
    pub is_exported: Option<bool>,
}

pub async fn list_records(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<MedicalRecord>>, ServiceError> {
    let records = sqlx::query_as!(MedicalRecord,
        r#"SELECT * FROM medical_records"#
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| ServiceError::InternalServerError)?;
    Ok(Json(records))
}

pub async fn get_record(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> Result<Json<MedicalRecord>, ServiceError> {
    let record = sqlx::query_as!(MedicalRecord,
        r#"SELECT * FROM medical_records WHERE id = $1"#,
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| ServiceError::InternalServerError)?;
    if let Some(record) = record {
        Ok(Json(record))
    } else {
        Err(ServiceError::NotFound)
    }
}

pub async fn create_record(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateRecordRequest>,
) -> Result<(StatusCode, Json<MedicalRecord>), ServiceError> {
    let now = Utc::now().naive_utc();
    let rec = sqlx::query_as!(MedicalRecord,
        r#"
        INSERT INTO medical_records (
            patient_id, record_type, record_category, title, provider, date, status, description, secondary_status, reviewed_by, attachments, is_exported, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        ) RETURNING *
        "#,
        payload.patient_id,
        payload.record_type,
        payload.record_category,
        payload.title,
        payload.provider,
        payload.date,
        payload.status,
        payload.description,
        payload.secondary_status,
        payload.reviewed_by,
        payload.attachments.as_deref(),
        payload.is_exported,
        Some(now),
        Some(now)
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| ServiceError::InternalServerError)?;
    Ok((StatusCode::CREATED, Json(rec)))
}

pub async fn update_record(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
    Json(payload): Json<UpdateRecordRequest>,
) -> Result<Json<MedicalRecord>, ServiceError> {
    let now = Utc::now().naive_utc();
    let record = sqlx::query_as!(MedicalRecord,
        r#"
        UPDATE medical_records SET
            record_type = COALESCE($1, record_type),
            title = COALESCE($2, title),
            provider = COALESCE($3, provider),
            date = COALESCE($4, date),
            status = COALESCE($5, status),
            record_category = COALESCE($6, record_category),
            description = COALESCE($7, description),
            secondary_status = COALESCE($8, secondary_status),
            reviewed_by = COALESCE($9, reviewed_by),
            attachments = COALESCE($10, attachments),
            is_exported = COALESCE($11, is_exported),
            updated_at = $12
        WHERE id = $13
        RETURNING *
        "#,
        payload.record_type,
        payload.title,
        payload.provider,
        payload.date,
        payload.status,
        payload.record_category,
        payload.description,
        payload.secondary_status,
        payload.reviewed_by,
        payload.attachments.as_deref(),
        payload.is_exported,
        Some(now),
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| ServiceError::InternalServerError)?;
    if let Some(record) = record {
        Ok(Json(record))
    } else {
        Err(ServiceError::NotFound)
    }
}

pub async fn delete_record(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> Result<StatusCode, ServiceError> {
    let result = sqlx::query!(
        "DELETE FROM medical_records WHERE id = $1",
        id
    )
    .execute(&pool)
    .await
    .map_err(|_| ServiceError::InternalServerError)?;
    if result.rows_affected() > 0 {
        Ok(StatusCode::NO_CONTENT)
    } else {
        Err(ServiceError::NotFound)
    }
}
