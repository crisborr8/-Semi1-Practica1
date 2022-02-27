
-- CREATE DATABASE PRACTICAU;
 
USE PRACTICAU;

CREATE TABLE USUARIO(
	idusuario INT PRIMARY KEY auto_increment NOT NULL,
    username VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    contra VARCHAR(500) NOT NULL
);	

CREATE TABLE ALBUM(
	idalbum INT PRIMARY KEY auto_increment NOT NULL,
    nombre VARCHAR(50) NOT NULL, 
    idusuario INT NOT NULL,
    FOREIGN KEY (idusuario) references USUARIO(idusuario)
);

CREATE TABLE PHOTO(
	idphoto INT PRIMARY KEY auto_increment NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    idalbum INT NOT NULL,
    FOREIGN KEY (idalbum) references ALBUM(idalbum)
);

