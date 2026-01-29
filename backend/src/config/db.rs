use std::env;

#[derive(Debug, Clone)]
pub struct DbConfig {
    pub host: String,
    pub port: u16,
    pub user: String,
    pub password: String,
    pub db_name: String,
}

impl DbConfig {
    pub fn from_env() -> Self {
        if let Ok(database_url) = env::var("DATABASE_URL") {
            let url = url::Url::parse(&database_url).expect("Invalid DATABASE_URL");
            let user = url.username().to_string();
            let password = url.password().unwrap_or("").to_string();
            let host = url.host_str().unwrap_or("localhost").to_string();
            let port = url.port().unwrap_or(5432);
            let db_name = url.path().trim_start_matches('/').to_string();
            Self { host, port, user, password, db_name }
        } else {
            Self {
                host: env::var("DB_HOST").unwrap_or_else(|_| "localhost".to_string()),
                port: env::var("DB_PORT").ok().and_then(|p| p.parse().ok()).unwrap_or(5432),
                user: env::var("DB_USER").unwrap_or_else(|_| "postgres".to_string()),
                password: env::var("DB_PASSWORD").unwrap_or_else(|_| "postgres".to_string()),
                db_name: env::var("DB_NAME").unwrap_or_else(|_| "backend_db".to_string()),
            }
        }
    }
    pub fn to_url(&self) -> String {
        format!(
            "postgres://{}:{}@{}:{}/{}",
            self.user, self.password, self.host, self.port, self.db_name
        )
    }
}
