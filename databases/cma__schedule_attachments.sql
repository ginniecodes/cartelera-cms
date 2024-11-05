CREATE TABLE IF NOT EXISTS cma__schedule_attachments (
    id UUID PRIMARY KEY,
    name VARCHAR(200),
    schedule_id UUID,
    url TEXT,
    size INT,
    mime_type VARCHAR(64),
    storage_path TEXT,
    update_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stored_creation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stored_update_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);