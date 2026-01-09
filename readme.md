**Problem Statement**
Healthcare professionals in rural areas struggle to keep medical records unified. Patient data is often scattered across paper files or incompatible digital systems, making it difficult to access accurate medical history while maintaining patient privacy.

**Proposed Solution**
We propose a web-based interoperable digital health records system that enables healthcare professionals to securely create, store, and access patient records through a unified platform.


# Building Type-Safe, Fast APIs Using Rust (Actix)

## Overview

This repository demonstrates my understanding of building **fast, secure, and type-safe backend APIs** using **Rust** and the **Actix Web framework**.
The project explains how a Rust backend receives requests from an Angular frontend, processes structured data using typed handlers, optionally interacts with PostgreSQL, and returns JSON responses.

The goal of this assignment is **conceptual clarity**, not complexity.

---

## Why Rust Is a Strong Backend Choice

Rust is increasingly used for backend systems because it provides:

* **Memory Safety** without garbage collection
* **High performance** comparable to C/C++
* **Zero-cost abstractions**
* **Fearless concurrency** for handling multiple requests safely
* **Compile-time guarantees** that reduce runtime failures

Because of these strengths, Rust is widely adopted by companies like Amazon, Cloudflare, Discord, Dropbox, and Figma.

**Key Insight:**
If a Rust API compiles successfully, it is usually correct and stable.

---

## How a Rust API Server Works

A Rust backend handles HTTP requests using the following building blocks:

### 1. Routes

Routes map HTTP paths and methods to handler functions.

Example:

```
rust
#[post("/api/items")]
```

This tells the server to run the handler when a POST request is sent to `/api/items`.

---

### 2. Handlers

Handlers contain the logic for processing a request and generating a response.

```
rust
async fn create_item(...) -> impl Responder
```

Handlers are asynchronous, allowing the server to handle many users simultaneously.

---

### 3. Structs & Type Safety

Rust uses strongly typed structs to validate request and response data.

``
`rust
#[derive(Deserialize)]
struct CreateItem {
    name: String,
    quantity: i32,
}
```

This ensures:

* The request contains the correct fields
* The data types are valid
* Errors are caught at compile time

---

### 4. Async Execution

Rust uses `async/await` to avoid blocking threads while handling requests or database operations.

---

## Example API Endpoint

Below is a simple POST endpoint implemented using **Actix Web**.

### Endpoint Code (`main.rs`)

```
rust
use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;

#[derive(Deserialize)]
struct CreateItem {
    name: String,
    quantity: i32,
}

#[post("/api/items")]
async fn create_item(item: web::Json<CreateItem>) -> impl Responder {
    println!("Received item: {} - {}", item.name, item.quantity);

    HttpResponse::Ok().json(format!(
        "Item created: {} with quantity {}",
        item.name, item.quantity
    ))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(create_item)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

---

### What Happens in This Endpoint

1. Angular sends a POST request with JSON data
2. Rust converts the JSON into a `CreateItem` struct
3. The handler processes the request
4. A JSON response is returned

Example request:

```
json
{
  "name": "Keyboard",
  "quantity": 10
}
```

Example response:

```
json
"Item created: Keyboard with quantity 10"
```

---

## Connecting to PostgreSQL (Conceptual)

In real-world applications, handlers interact with PostgreSQL using libraries like **SQLx**.

Example SQLx query:

```
rust
sqlx::query!(
    "INSERT INTO items (name, quantity) VALUES ($1, $2)",
    item.name,
    item.quantity
)
.execute(&pool)
.await?;
```

### Benefits:

* Safe prepared statements
* Protection against SQL injection
* Async database access
* Compile-time verification of SQL queries

---

## Full Request–Response Flow

The architecture follows this sequence:

```
Angular Component (Form Submit)
        ↓
Angular Service (HTTP POST)
        ↓
Rust Route (/api/items)
        ↓
Rust Handler (Validates Input using Structs)
        ↓
PostgreSQL (Insert Query)
        ↓
JSON Response
        ↓
Angular Updates UI
```
---

## Case Study: Adding a New Product

### Scenario:

A user submits a form to add a new product:

* **Name:** Laptop
* **Quantity:** 5

### Step-by-Step Flow:

1. User submits the form in Angular.
2. Angular service sends a POST request to `/api/items` with JSON data.
3. Rust route matches the endpoint and invokes the handler.
4. The handler deserializes JSON into the `CreateItem` struct.
5. Rust executes a PostgreSQL INSERT query.
6. The database stores the product.
7. Rust returns a success JSON response.
8. Angular receives the response and updates the UI.

---

## Why Type Safety Improves API Development

Using type safety in Rust APIs provides:

* Early error detection
* Fewer runtime crashes
* Predictable request handling
* Safer refactoring
* More reliable production systems

Type safety ensures correctness **before deployment**, not after failure.

---

## Conclusion

This project demonstrates the foundational concepts of building **fast, type-safe, and reliable APIs** using Rust and Actix.
Understanding routes, handlers, structs, and async workflows enables scalable and maintainable backend systems.


