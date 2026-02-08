use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use sqlx::PgPool;
use serde_json;

use crate::models::patient::Patient;
use crate::models::error::ServiceError;
use crate::models::consent::Consent;
use crate::models::record::MedicalRecord;
use axum::extract::Query;
use serde::Serialize;
#[derive(Serialize)]
pub struct PatientProfile {
    pub patient: Patient,
    pub consents: Vec<Consent>,
    pub medical_records: Vec<MedicalRecord>,
}
/// Get a detailed patient profile (patient, consents, records)
pub async fn get_patient_profile(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> Result<Json<PatientProfile>, ServiceError> {
    // Get patient
    let patient = sqlx::query_as!(Patient,
        r#"SELECT * FROM patients WHERE id = $1"#,
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| ServiceError::Unauthorized)?;
    let patient = match patient {
        Some(p) => p,
        None => return Err(ServiceError::NotFound),
    };

    // Get consents
    let consents = sqlx::query_as!(Consent,
        r#"SELECT * FROM consents WHERE patient_id = $1"#,
        id
    )
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    // Get medical records
    let medical_records = sqlx::query_as!(MedicalRecord,
        r#"SELECT * FROM medical_records WHERE patient_id = $1"#,
        id
    )
    .fetch_all(&pool)
    .await
    .unwrap_or_default();

    Ok(Json(PatientProfile {
        patient,
        consents,
        medical_records,
    }))
}

use chrono::NaiveDate;
use serde::Deserialize;
use serde_json::Value;

#[derive(Deserialize)]
pub struct CreatePatientRequest {
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: NaiveDate,
    pub gender: String,
    pub phone_number: String,
    pub middle_name: Option<String>,
    pub blood_type: Option<String>,
    pub email: Option<String>,
    pub address: Option<Value>,
    pub village: Option<String>,
    pub emergency_contact: Option<Value>,
    #[serde(default)]
    pub active_conditions: Option<Vec<String>>,
    #[serde(default)]
    pub known_allergies: Option<Vec<String>>,
    pub additional_notes: Option<String>,
    pub status: Option<String>,
    pub critical_flag: Option<bool>,
    pub profile_picture_url: Option<String>,
    pub next_visit: Option<NaiveDate>,
}

#[derive(Deserialize)]
pub struct UpdatePatientRequest {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub date_of_birth: Option<NaiveDate>,
    pub gender: Option<String>,
    pub phone_number: Option<String>,
    pub middle_name: Option<String>,
    pub blood_type: Option<String>,
    pub email: Option<String>,
    pub address: Option<Value>,
    pub village: Option<String>,
    pub emergency_contact: Option<Value>,
    pub active_conditions: Option<Vec<String>>,
    pub known_allergies: Option<Vec<String>>,
    pub additional_notes: Option<String>,
    pub status: Option<String>,
    pub critical_flag: Option<bool>,
    pub profile_picture_url: Option<String>,
    pub next_visit: Option<NaiveDate>,
}

pub async fn list_patients(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Patient>>, ServiceError> {
    let patients = sqlx::query_as!(Patient,
        r#"SELECT * FROM patients"#
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| ServiceError::Unauthorized)?;
    Ok(Json(patients))
}

pub async fn get_patient(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> Result<Json<Patient>, ServiceError> {
    let patient = sqlx::query_as!(Patient,
        r#"SELECT * FROM patients WHERE id = $1"#,
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| ServiceError::Unauthorized)?;
    if let Some(patient) = patient {
        Ok(Json(patient))
    } else {
        Err(ServiceError::NotFound)
    }
}

pub async fn create_patient(
    State(pool): State<PgPool>,
    Json(payload): Json<CreatePatientRequest>,
) -> Result<(StatusCode, Json<Patient>), ServiceError> {
    let now = chrono::Utc::now().naive_utc();
    let status = payload.status.unwrap_or_else(|| "active".to_string());
    let active_conditions_ref = payload.active_conditions.as_ref().map(Vec::as_slice);
    let known_allergies_ref = payload.known_allergies.as_ref().map(Vec::as_slice);
    let address = payload.address;
    let emergency_contact = payload.emergency_contact;

    let rec = sqlx::query_as!(Patient,
        r#"
        INSERT INTO patients (
            first_name, middle_name, last_name, date_of_birth, gender, blood_type, phone_number, email, address, village, emergency_contact, active_conditions, known_allergies, additional_notes, status, critical_flag, profile_picture_url, next_visit, created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) RETURNING *
        "#,
        payload.first_name,
        payload.middle_name,
        payload.last_name,
        payload.date_of_birth,
        payload.gender,
        payload.blood_type,
        payload.phone_number,
        payload.email,
        address,
        payload.village,
        emergency_contact,
        active_conditions_ref,
        known_allergies_ref,
        payload.additional_notes,
        status,
        payload.critical_flag,
        payload.profile_picture_url,
        payload.next_visit,
        Some(now),
        Some(now)
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| ServiceError::Unauthorized)?;
    Ok((StatusCode::CREATED, Json(rec)))
}

pub async fn update_patient(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
    Json(payload): Json<UpdatePatientRequest>,
) -> Result<Json<Patient>, ServiceError> {
    let now = chrono::Utc::now().naive_utc();
    // Build dynamic SQL for only provided fields (for brevity, here is a simple version)
    let patient = sqlx::query_as!(Patient,
        r#"
        UPDATE patients SET
            first_name = COALESCE($1, first_name),
            middle_name = COALESCE($2, middle_name),
            last_name = COALESCE($3, last_name),
            date_of_birth = COALESCE($4, date_of_birth),
            gender = COALESCE($5, gender),
            blood_type = COALESCE($6, blood_type),
            phone_number = COALESCE($7, phone_number),
            email = COALESCE($8, email),
            address = COALESCE($9, address),
            village = COALESCE($10, village),
            emergency_contact = COALESCE($11, emergency_contact),
            active_conditions = COALESCE($12, active_conditions),
            known_allergies = COALESCE($13, known_allergies),
            additional_notes = COALESCE($14, additional_notes),
            status = COALESCE($15, status),
            critical_flag = COALESCE($16, critical_flag),
            profile_picture_url = COALESCE($17, profile_picture_url),
            next_visit = COALESCE($18, next_visit),
            updated_at = $19
        WHERE id = $20
        RETURNING *
        "#,
        payload.first_name,
        payload.middle_name,
        payload.last_name,
        payload.date_of_birth,
        payload.gender,
        payload.blood_type,
        payload.phone_number,
        payload.email,
        payload.address,
        payload.village,
        payload.emergency_contact,
        payload.active_conditions.as_deref(),
        payload.known_allergies.as_deref(),
        payload.additional_notes,
        payload.status,
        payload.critical_flag,
        payload.profile_picture_url,
        payload.next_visit,
        Some(now),
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|_| ServiceError::Unauthorized)?;
    if let Some(patient) = patient {
        Ok(Json(patient))
    } else {
        Err(ServiceError::NotFound)
    }
}

use axum::extract::Request;

pub async fn delete_patient(
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
    req: Request,
) -> Result<StatusCode, ServiceError> {
    // Debug: print all request headers
    println!("[DELETE PATIENT DEBUG] Incoming request headers:");
    for (name, value) in req.headers().iter() {
        println!("  {}: {:?}", name, value);
    }
    let result = sqlx::query!(
        "DELETE FROM patients WHERE id = $1",
        id
    )
    .execute(&pool)
    .await;
    match result {
        Ok(res) => {
            if res.rows_affected() > 0 {
                Ok(StatusCode::NO_CONTENT)
            } else {
                Err(ServiceError::NotFound)
            }
        }
        Err(e) => {
            eprintln!("[DELETE PATIENT ERROR] DB error: {:?}", e);
            Err(ServiceError::InternalServerError)
        }
    }
}
