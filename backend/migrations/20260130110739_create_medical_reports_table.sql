-- no-transaction
CREATE TABLE medical_reports (
  id SERIAL PRIMARY KEY,
  record_id INTEGER NOT NULL REFERENCES public.medical_records(id),
  report_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Down
DROP TABLE medical_reports;
