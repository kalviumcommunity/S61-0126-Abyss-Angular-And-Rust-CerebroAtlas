use axum::{Json, extract::State};
use serde::Serialize;
use crate::config::AppState;
use crate::models::patient::Patient;
use crate::models::record::MedicalRecord;
use std::collections::HashMap;

#[derive(Serialize)]
pub struct StatsResponse {
    pub total_patients: usize,
    pub total_records: usize,
    pub consultations_mtd: usize,
    pub completed: usize,
    pub pending: usize,
    pub lab_results: usize,
    pub avg_wait_time: Option<String>, // Placeholder
    pub data_completeness: Option<String>, // Placeholder
}

#[derive(Serialize)]
pub struct VillageDistribution {
    pub name: String,
    pub patients: usize,
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
    pub value: usize,
}

#[derive(Serialize)]
pub struct AnalyticsResponse {
    pub stats: StatsResponse,
    pub villages: Vec<VillageDistribution>,
    pub conditions: Vec<ConditionDistribution>,
    pub disease_trend: Vec<DiseaseTrend>,
}

pub async fn get_analytics(State(state): State<AppState>) -> Json<AnalyticsResponse> {
    let patients = state.patients.read().await;
    let records = state.records.read().await;
    let total_patients = patients.len();
    let total_records = records.len();
    let consultations_mtd = records.values().filter(|r| r.date.starts_with(&chrono::Utc::now().format("%Y-%m").to_string())).count();

    // Village distribution
    let mut village_map: HashMap<String, usize> = HashMap::new();
    for p in patients.values() {
        if let Some(v) = &p.village {
            *village_map.entry(v.clone()).or_insert(0) += 1;
        }
    }
    let villages = village_map.into_iter().map(|(name, patients)| VillageDistribution {
        name,
        patients,
        growth: "+0%".to_string(), // Placeholder
    }).collect();

    // Condition distribution
    let mut condition_map: HashMap<String, usize> = HashMap::new();
    for p in patients.values() {
        for cond in &p.active_conditions {
            *condition_map.entry(cond.clone()).or_insert(0) += 1;
        }
    }
    let total_conditions: usize = condition_map.values().sum();
    let conditions = condition_map.into_iter().map(|(condition, count)| ConditionDistribution {
        condition,
        percentage: if total_conditions > 0 { (count as f32 / total_conditions as f32) * 100.0 } else { 0.0 },
    }).collect();

    // Disease trend (last 7 months, by record date)
    let mut trend_map: HashMap<String, usize> = HashMap::new();
    let now = chrono::Utc::now();
    for i in 0..7 {
        let month = now - chrono::Duration::days(30 * i);
        let key = month.format("%b").to_string();
        trend_map.insert(key, 0);
    }
    for r in records.values() {
        if let Ok(date) = chrono::NaiveDate::parse_from_str(&r.date, "%Y-%m-%d") {
            let key = date.format("%b").to_string();
            if let Some(v) = trend_map.get_mut(&key) {
                *v += 1;
            }
        }
    }
    let mut disease_trend: Vec<DiseaseTrend> = trend_map.into_iter().map(|(month, value)| DiseaseTrend { month, value }).collect();
    disease_trend.sort_by_key(|d| d.month.clone());

    // Calculate completed, pending, lab_results from records
    let completed = records.values().filter(|r| r.status.to_lowercase() == "completed").count();
    let pending = records.values().filter(|r| r.status.to_lowercase() == "pending").count();
    let lab_results = records.values().filter(|r| r.record_type.to_lowercase() == "lab").count();

    let stats = StatsResponse {
        total_patients,
        total_records,
        consultations_mtd,
        completed,
        pending,
        lab_results,
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
