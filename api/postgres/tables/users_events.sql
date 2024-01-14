BEGIN TRANSACTION;

-- TODO : ue.id_event avec 2 relations : travels2(id_event) et events(id)
CREATE TABLE users_events(
	id_user INT NOT NULL REFERENCES users(id)
		ON DELETE CASCADE,
		--ON UPDATE CASCADE,
  id_event INT NOT NULL REFERENCES events(id)
    ON DELETE CASCADE
    --ON UPDATE CASCADE -- travels2(id_event)
  --, id_travel INT NULL DEFAULT NULL REFERENCES travels(id)
  -- , id_travel INT NULL REFERENCES travels2(id)
);

COMMIT;