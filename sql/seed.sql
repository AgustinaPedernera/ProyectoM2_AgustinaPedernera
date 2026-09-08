INSERT INTO authors (name, email, bio)
VALUES 
('Liz Córdoba', 'liz@email.com', 'Escribe sobre ciencias jurídicas.'),
('Agustina Pedernera', 'agus@email.com', 'Escribe sobre desarrollo web.'),
('Rudy Pedernera', 'rudy@email.com', 'Escribe sobre análisis de sistemas.');

INSERT INTO posts (author_id, title, content, published)
VALUES (1, 'Mi primer post sobre Ciencias Jurídicas', '¿Qué es el derecho administrativo?', true),
       (2, 'Mi primer post sobre Desarrollo Web', '¿Qué significa DevFullStack?', true),
       (3, 'Mi primer post sobre Análisis de Sistemas', '¿Qué es un diagrama de flujo?', true);

