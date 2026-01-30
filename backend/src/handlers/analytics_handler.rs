use axum::{Json, extract::State};
use serde::Serialize;
use sqlx::PgPool;
use chrono::{Utc, Duration};

#[derive(Serialize)]
pub struct StatsResponse {
    pub total_patients: i64,
    pub total_records: i64,
    pub consultations_mtd: i64,
    pub completed: i64,
    pub pending: i64,
    pub lab_results: i64,
    pub avg_wait_time: Option<String>, // Placeholder
    pub data_completeness: Option<String>, // Placeholder
}

#[derive(Serialize)]
pub struct VillageDistribution {
    pub name: String,
    pub patients: i64,
    pub growth: String, // Placeholder
}

#[derive(Serialize)]
pub struct ConditionDistribution {
    pub condition: String,
    pub percentage: f32,
}

#[derive(Serialize)]
pub struct DiseaseTrend {
    pub month: String,
    pub value: i64,
}

#[derive(Serialize)]
pub struct AnalyticsResponse {
    pub stats: StatsResponse,
    pub villages: Vec<VillageDistribution>,
    pub conditions: Vec<ConditionDistribution>,
    pub disease_trend: Vec<DiseaseTrend>,
}

pub async fn get_analytics(State(pool): State<PgPool>) -> Json<AnalyticsResponse> {
    // Total patients
    let total_patients: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM patients")
        .fetch_one(&pool).await.unwrap_or((0,));
    // Total records
    let total_records: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM medical_records")
        .fetch_one(&pool).await.unwrap_or((0,));
    // Consultations MTD
    let mtd_prefix = Utc::now().format("%Y-%m").to_string();
    let consultations_mtd: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM medical_records WHERE date LIKE $1 || '%'"
    )
    .bind(&mtd_prefix)
    .fetch_one(&pool).await.unwrap_or((0,));
    // Completed, pending, lab_results
    let completed: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM medical_records WHERE LOWER(status) = 'completed'"
    ).fetch_one(&pool).await.unwrap_or((0,));
    let pending: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM medical_records WHERE LOWER(status) = 'pending'"
    ).fetch_one(&pool).await.unwrap_or((0,));
    let lab_results: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM medical_records WHERE LOWER(record_type) = 'lab'"
    ).fetch_one(&pool).await.unwrap_or((0,));

    // Village distribution
    let villages = sqlx::query!(
        "SELECT village as name, COUNT(*) as patients FROM patients WHERE village IS NOT NULL GROUP BY village"
    )
    .fetch_all(&pool).await.unwrap_or_default()
    .into_iter()
    .map(|row| VillageDistribution {
        name: row.name.unwrap_or_default(),
        patients: row.patients.unwrap_or(0),
        growth: "+0%".to_string(),
    }).collect();

    // Condition distribution
    let condition_rows = sqlx::query!(
        "SELECT unnest(active_conditions) as condition FROM patients WHERE active_conditions IS NOT NULL"
    )
    .fetch_all(&pool).await.unwrap_or_default();
    let mut condition_map = std::collections::HashMap::new();
    for row in &condition_rows {
        if let Some(cond) = &row.condition {
            *condition_map.entry(cond.clone()).or_insert(0) += 1;
        }
    }
    let total_conditions: i64 = condition_map.values().sum();
    let conditions = condition_map.into_iter().map(|(condition, count)| ConditionDistribution {
        condition,
        percentage: if total_conditions > 0 { (count as f32 / total_conditions as f32) * 100.0 } else { 0.0 },
    }).collect();

    // Disease trend (last 7 months, by record date)
    let mut trend_map: std::collections::HashMap<String, i64> = std::collections::HashMap::new();
    let now = Utc::now();
    for i in 0..7 {
        let month = now - Duration::days(30 * i);
        let key = month.format("%b").to_string();
        trend_map.insert(key.clone(), 0);
    }
    let trend_rows = sqlx::query!("SELECT date FROM medical_records")
        .fetch_all(&pool).await.unwrap_or_default();
    for row in &trend_rows {
        let date = row.date;
        let key = date.format("%b").to_string();
        if let Some(v) = trend_map.get_mut(&key) {
            *v += 1;
        }
    }
    let mut disease_trend: Vec<DiseaseTrend> = trend_map.into_iter().map(|(month, value)| DiseaseTrend { month, value }).collect();
    disease_trend.sort_by_key(|d| d.month.clone());

    let stats = StatsResponse {
        total_patients: total_patients.0,
        total_records: total_records.0,
        consultations_mtd: consultations_mtd.0,
        completed: completed.0,
        pending: pending.0,
        lab_results: lab_results.0,
        avg_wait_time: None, // Placeholder
        data_completeness: None, // Placeholder
    };

    Json(AnalyticsResponse {
        stats,
        villages,
        conditions,
        disease_trend,
    })
}
