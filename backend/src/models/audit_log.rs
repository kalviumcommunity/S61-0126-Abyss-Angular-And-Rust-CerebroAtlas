use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AuditLog {
    pub id: String,
    pub event_type: String,
    pub action: String,
    pub resource: String,
    pub user_id: String,
    pub patient_id: Option<String>,
    pub timestamp: String,
    pub ip_address: Option<String>,
    pub details: Option<String>,
    pub success: bool,
    pub severity: Option<String>,
}
