use axum::{routing::get, Router};
use tokio::net::TcpListener;

async fn hello() -> &'static str {
    "Rust Axum backend running"
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(hello));

    let listener = TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();

    println!("Running on http://127.0.0.1:8080");

    axum::serve(listener, app).await.unwrap();
}
