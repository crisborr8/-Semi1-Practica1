
USE PRACTICAU;

-- INSERTANDO USUARIOS
INSERT INTO USUARIO(username, name,contra)
VALUES ('UNO', 'UNO UNO UNO UNO', '1111');

INSERT INTO USUARIO(username, name,contra)
VALUES ('DOS', 'DOS DOS DOS DOS', '2222');

INSERT INTO USUARIO(username, name,contra)
VALUES ('TRES', 'TRES TRES TRES TRES', '3333');

SELECT * FROM ALBUM A JOIN USUARIO B ON A.idusuario = B.idusuario JOIN PHOTO C ON C.idalbum = A.idalbum;

-- INSERTANDO ALBUM A CADA USUARIO
INSERT INTO ALBUM(nombre, idusuario)
VALUES ('MASCOTAS', 1);

INSERT INTO ALBUM(nombre, idusuario)
VALUES ('CARNIVOROS', 1);

INSERT INTO ALBUM(nombre, idusuario)
VALUES ('AEREOS', 1);

INSERT INTO ALBUM(nombre, idusuario)
VALUES ('ALBUM1', 2);

SELECT * FROM PHOTO;
-- INSERTANDO FOTOS A LOS ALBUM 
INSERT INTO PHOTO(nombre, idalbum)
VALUES ('/foto1.jpg', 1);
INSERT INTO PHOTO(nombre, idalbum)
VALUES ('/foto2.jpg', 2);
INSERT INTO PHOTO(nombre, idalbum)
VALUES ('/foto3.jpg', 2);

INSERT INTO PHOTO(nombre, idalbum)
VALUES ('/fotichi.jpg', 4);

