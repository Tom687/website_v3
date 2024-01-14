BEGIN TRANSACTION;

CREATE TYPE role AS ENUM('user', 'admin', 'super-admin');

CREATE TABLE login (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_user INT NOT NULL REFERENCES users(id),
    hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role role NOT NULL DEFAULT 'user',
    reset_token VARCHAR(255) NULL,
    reset_token_expiration TIMESTAMP NULL -- TIMESTAMP ?
);

COMMIT;