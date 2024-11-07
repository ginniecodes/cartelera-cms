CREATE TABLE IF NOT EXISTS cda__uc (
    id UUID PRIMARY KEY,
    name VARCHAR(200),
    total_guides INT,
    update_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stored_creation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stored_update_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)