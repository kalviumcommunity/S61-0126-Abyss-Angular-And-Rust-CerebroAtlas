use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Permission {
    pub read: bool,
    pub write: bool,
    pub delete: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RolePermissions {
    pub patient_records: Permission,
    pub medical_records: Permission,
    pub prescriptions: Permission,
    pub appointments: Permission,
    pub lab_results: Permission,
    pub reports: Permission,
    pub user_management: Permission,
    pub system_settings: Permission,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Role {
    pub name: String,
    pub description: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub permissions: RolePermissions,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}