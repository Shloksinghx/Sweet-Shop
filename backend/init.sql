CREATE DATABASE sweetshop;

\c sweetshop;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'USER'
);

CREATE TABLE sweets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0
);

-- Insert Admin
-- Password is 'admin' (hashed) - You might need to generate this via code or use registration
-- INSERT INTO users (username, password, role) VALUES ('admin', '$2a$10$.....', 'ADMIN');
