BEGIN TRANSACTION;

CREATE TABLE events (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	--id_user INT NOT NULL REFERENCES users(id),
	title VARCHAR(150) NOT NULL,
	start_at TIMESTAMP NOT NULL,
	end_at TIMESTAMP NOT NULL,
	status VARCHAR(30) NOT NULL DEFAULT 'todo', -- USER default = 'attente confirm' | ADMIN = todo
	type VARCHAR(30) NOT NULL DEFAULT 'attente', -- Un status peut ne pas aller avec un type (ex : type vacances status payé. Type planning status payé
	description VARCHAR(255) NULL
);

COMMIT;