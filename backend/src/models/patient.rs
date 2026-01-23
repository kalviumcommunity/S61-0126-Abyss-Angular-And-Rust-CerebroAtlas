use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Address {
	pub street: Option<String>,
	pub city: Option<String>,
	pub state: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EmergencyContact {
	pub name: String,
	pub phone: String,
	pub relationship: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Patient {
	pub id: String,
	pub first_name: String,
	pub middle_name: Option<String>,
	pub last_name: String,
	pub date_of_birth: String,
	pub gender: String,
	pub blood_type: Option<String>,
	pub phone_number: String,
	pub email: Option<String>,
	pub address: Option<Address>,
	pub village: Option<String>,
	pub emergency_contact: Option<EmergencyContact>,
	pub active_conditions: Vec<String>,
	pub known_allergies: Vec<String>,
	pub additional_notes: Option<String>,
	pub status: String,
	pub sync_status: Option<String>,
	pub critical_flag: Option<bool>,
	pub profile_picture_url: Option<String>,
	pub next_visit: Option<String>,
	pub created_at: String,
	pub updated_at: String,
}
