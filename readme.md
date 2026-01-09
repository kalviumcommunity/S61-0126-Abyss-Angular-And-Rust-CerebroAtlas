**Problem Statement**
Healthcare professionals in rural areas struggle to keep medical records unified. Patient data is often scattered across paper files or incompatible digital systems, making it difficult to access accurate medical history while maintaining patient privacy.

**Proposed Solution**
We propose a web-based interoperable digital health records system that enables healthcare professionals to securely create, store, and access patient records through a unified platform.

**Frontend – Angular**

**Components**

Angular components are responsible for the UI layer.

Render views and layouts

Handle user interactions (forms, buttons, navigation)

Invoke services to fetch or submit data

Update the UI based on API responses

Components do not contain business logic and remain lightweight.

**Services**

Angular services manage application logic and data flow.

Centralize reusable logic

Communicate with backend APIs

Handle data transformation and error handling

Share state across multiple components

Services act as the interface between components and backend APIs.

**HTTPClient**

Angular’s HttpClient handles all HTTP communication.

Sends REST API requests (GET, POST, PUT, DELETE)

Attaches headers such as authentication tokens

Handles asynchronous responses using Observables

Parses JSON responses from the backend

**Backend – Rust APIs**

The backend is implemented using Rust to ensure performance, safety, and reliability.

Exposes RESTful API endpoints

Validates and processes incoming requests

Executes business logic

Communicates with the PostgreSQL database

Returns structured JSON responses to the frontend

Rust APIs serve as the single access layer to the database.

**Database – PostgreSQL**

PostgreSQL is used for data persistence and integrity.

Stores application data securely

Supports relational data and complex queries

Ensures consistency and reliability

Accessed only through the Rust backend

**End-to-End Request Flow**

The following diagram represents the complete request lifecycle:

User
  ↓
Angular Component
  ↓
Angular Service
  ↓
HTTPClient
  ↓
Rust API
  ↓
PostgreSQL Database
  ↓
Rust API Response
  ↓
Angular Service
  ↓
Angular Component
  ↓
UI Update



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


---

# **Creating Interactive, Modular Frontends with Angular**

---

## **1. Explanation of Angular Components & Services**

### **Angular Components**

In our project, Angular components are used to divide the UI into **small, reusable, and independent blocks**, making the application easy to scale and maintain.

For the healthcare records system, we design components such as:

* **LoginComponent** – handles doctor authentication UI
* **DashboardComponent** – displays patient records overview
* **PatientFormComponent** – used to add or update medical records
* **PatientListComponent** – displays a list of patients

Each component contains:

* **HTML** for structure
* **TypeScript** for logic
* **CSS** for styling

This separation ensures that UI logic remains clean and manageable.

---

### **Angular Services**

Services are used to handle **shared logic and API communication** instead of embedding that logic inside components.

In our project, services are responsible for:

* Communicating with the Rust backend
* Fetching patient data
* Sending patient record updates
* Managing authentication tokens

This approach ensures that:

* Components focus only on UI
* API logic is centralized
* Code is reusable and easier to test

---

## **2. Diagram: Angular UI Interaction with Rust Backend**

```
Angular Component (UI)
        ↓
Angular Service (HTTP Client)
        ↓
Rust REST API (Actix / Axum)
        ↓
Business Logic Layer
        ↓
PostgreSQL Database
        ↓
JSON Response
        ↓
Angular Service
        ↓
Angular Component (UI Updates Automatically)
```

This flow ensures **clear frontend–backend separation** and smooth interoperability.

---

## **3. Simple UI Feature Implemented Using Angular Components**

### **Feature: Add Patient Medical Record**

**Description:**
A doctor logs in and adds a patient’s medical record through a form.

**Components Involved:**

* `PatientFormComponent`
* `PatientListComponent`

**UI Flow:**

1. Doctor opens dashboard
2. Clicks “Add Patient”
3. Fills patient details
4. Submits form
5. UI updates automatically with new patient record

This feature demonstrates:

* Component reuse
* Event handling
* Reactive UI updates

---

## **4. Sample Angular Service Calling a Rust API Endpoint**

```
ts
@Injectable({ providedIn: 'root' })
export class PatientService {
  constructor(private http: HttpClient) {}

  addPatient(patientData: any) {
    return this.http.post('/api/patients', patientData);
  }

  getPatients() {
    return this.http.get('/api/patients');
  }
}
```

**Explanation:**

* The service sends HTTP requests to Rust APIs
* Components subscribe to responses
* Rust returns JSON data
* Angular updates the UI automatically

This design keeps API communication **clean and scalable**.

---

## **5. Routing Structure Used in the UI**

```
ts
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientListComponent }
];
```

**Purpose:**

* Enables multi-page navigation
* Keeps UI structured
* Improves user experience for healthcare professionals

---

## **6. How Modular Architecture Supports the Project**

Our Angular application follows a **modular architecture**, where:

* Each feature has its own module
* Components are grouped logically
* Services are shared across modules

Example structure:

```
AppModule
 ├── AuthModule
 ├── PatientModule
 ├── DashboardModule
 └── SharedModule
```

This structure ensures:

* Easy feature expansion
* Clear ownership of code
* Reduced bugs during scaling

---

## **7. Reflection: Why Modular Architecture Improves Scalability**

Modular architecture improves scalability because:

* Features can be added without breaking existing code
* Teams can work independently on modules
* Code becomes easier to test and debug
* Backend API changes affect only services, not UI components

For our healthcare records system, this is critical because:

* Medical data systems evolve continuously
* New features like reports or integrations can be added later
* Privacy and security logic stays centralized

---

## **Conclusion**

By using Angular’s component-driven and service-based architecture, we created a **clean, scalable, and maintainable frontend** that integrates seamlessly with a **Rust backend**. This design directly supports the project goal of building **interoperable and privacy-preserving digital health records**.

---

