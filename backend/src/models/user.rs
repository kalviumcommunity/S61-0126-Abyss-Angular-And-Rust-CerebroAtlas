use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct User {
	pub id: String,
	pub first_name: String,
	pub last_name: String,
	pub email: String,
	pub phone_number: Option<String>,
	pub username: String,
	pub password: String,
	pub role: String,
	pub department: Option<String>,
	pub specialization: Option<String>,
	pub license_number: Option<String>,
	pub status: String,
	pub last_login: Option<String>,
	pub last_activity: Option<String>,
	pub is_active: bool,
	pub profile_picture_url: Option<String>,
	pub created_at: String,
	pub updated_at: String,
}
