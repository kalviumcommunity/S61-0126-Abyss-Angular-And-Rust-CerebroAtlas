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



