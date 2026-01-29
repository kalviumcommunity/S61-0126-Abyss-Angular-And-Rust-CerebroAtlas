-- Migration: Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    blood_type TEXT,
    phone_number TEXT NOT NULL,
    email TEXT,
    address JSONB,
    village TEXT,
    emergency_contact JSONB,
    active_conditions TEXT[],
    known_allergies TEXT[],
    additional_notes TEXT,
    status TEXT NOT NULL,
    critical_flag BOOLEAN,
    profile_picture_url TEXT,
    next_visit DATE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
