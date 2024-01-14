BEGIN TRANSACTION;

INSERT INTO users(name, email, joined) VALUES('Tom Pomarede', 'tom.pomarede687@gmail.com', '2021-01-01');
INSERT INTO users(name, email, joined) VALUES('Admin Normal', 'a@a.a', '2021-01-02');
INSERT INTO users(name, email, joined) VALUES('Guio Pomarede Encinosa', 'guio@gmail.com', '2021-01-03');
INSERT INTO users(name, email, joined) VALUES('Utilisateur Lambda', 't@t.t', '2021-01-05');

INSERT INTO todos(id_user, title, created_on) VALUES(1, 'Créer application (Tom - ID 1)', '2021-01-02');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(1, 'Faire hélicoptère (Tom - ID 1)', true, '2021-01-03', '2021-01-06');
INSERT INTO todos(id_user, title, created_on) VALUES(2, 'Créer application (Admin N - ID 2)', '2021-01-02');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(2, 'Faire hélicoptère (Admin N - ID 2)', true, '2021-01-04', '2021-01-06');
INSERT INTO todos(id_user, title, created_on) VALUES(3, 'Tester application (Guio PE - ID 3)', '2021-01-01');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(1, 'Faire hélicoptère (Tom - ID 1)', false, '2021-01-04', '2021-01-06');
INSERT INTO todos(id_user, title, completed, created_on, done_on) VALUES(4, 'Faire les courses (User L - ID 4)', true, '2021-01-04', '2021-01-06');


INSERT INTO login(id_user, hash, email, role) VALUES(1, '$2b$10$rD0h2mxVvM4c10ddfo2pZ.im5HFTswGi2YLWZgOM.Gvjg5n78.Skm', 'tom.pomarede687@gmail.com', 'super-admin');
INSERT INTO login(id_user, hash, email, role) VALUES(2, '$2b$10$rD0h2mxVvM4c10ddfo2pZ.im5HFTswGi2YLWZgOM.Gvjg5n78.Skm', 'a@a.a', 'admin');
INSERT INTO login(id_user, hash, email, role) VALUES(3, '$2b$10$rD0h2mxVvM4c10ddfo2pZ.im5HFTswGi2YLWZgOM.Gvjg5n78.Skm', 'guio@gmail.com', 'user');
INSERT INTO login(id_user, hash, email, role) VALUES(4, '$2b$10$rD0h2mxVvM4c10ddfo2pZ.im5HFTswGi2YLWZgOM.Gvjg5n78.Skm', 't@t.t', 'user');

INSERT INTO events(title, start_at, end_at, type, status) VALUES
('Event 1 - U1', NOW() + INTERVAL '8 hours' + INTERVAL '30 minutes', NOW() + INTERVAL '10 hours' + INTERVAL '35
minutes', 'vacances', 'done'),

('Event 2 - U1 + U3', NOW() + INTERVAL '1 day' + INTERVAL '14 hours', NOW() + INTERVAL '1 day' + INTERVAL '16 hours' + INTERVAL '30 minutes', 'client', 'done'),

('Event 3 - U3', NOW() + INTERVAL '3 day' + INTERVAL '8 hours', NOW() + INTERVAL '3 day' + INTERVAL '10 hours',
'rdv', 'done'),

('Event 4 - U3', NOW() + INTERVAL '4 day' + INTERVAL '7 hours', NOW() + INTERVAL '4 day' + INTERVAL '9 hours', 'rdv', 'todo'),

('Event 5 - U2', NOW() + INTERVAL '5 day' + INTERVAL '11 hours' + INTERVAL '30 minutes', NOW() + INTERVAL '5 day' +
INTERVAL '12 hours' + INTERVAL '30 minutes', 'rdv', 'attente'),

('Event 6 - U1 + U2 + U3', NOW() + INTERVAL '6 day' + INTERVAL '11 hours', NOW() + INTERVAL '6 day' + INTERVAL '13
hours', 'meeting', 'todo');


INSERT INTO users_events(id_event, id_user) VALUES
(1, 1),
(2, 1),
(2, 3),
(3, 3),
(4, 3),
(5, 2),
(6, 2),
(6, 3),
(6, 1);


COMMIT;