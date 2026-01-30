-- Add migration script here

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Down
DROP TABLE patients;
