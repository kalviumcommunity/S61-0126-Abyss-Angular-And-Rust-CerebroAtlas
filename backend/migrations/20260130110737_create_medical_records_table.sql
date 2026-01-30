-- no-transaction
CREATE TABLE medical_records (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES public.patients(id),
  record_type TEXT NOT NULL,
  record_category TEXT,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  description TEXT,
  secondary_status TEXT,
  reviewed_by TEXT,
  attachments TEXT[],
  is_exported BOOLEAN,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Down
DROP TABLE medical_records;
