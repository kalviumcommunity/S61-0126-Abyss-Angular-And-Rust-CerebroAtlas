-- no-transaction
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Down
DROP TABLE audit_logs;
