use std::collections::HashMap;
use std::sync::Arc;

use tokio::sync::RwLock;

use crate::models::{patient::Patient, record::MedicalRecord};

pub mod db;

#[derive(Clone, Default)]
pub struct AppState {
	pub patients: Arc<RwLock<HashMap<String, Patient>>>,
	pub records: Arc<RwLock<HashMap<String, MedicalRecord>>>,
}
