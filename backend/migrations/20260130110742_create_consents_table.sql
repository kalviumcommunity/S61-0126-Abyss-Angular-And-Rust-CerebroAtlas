-- no-transaction
CREATE TABLE consents (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES public.patients(id),
  consent_type TEXT NOT NULL,
  granted BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Down
DROP TABLE consents;
