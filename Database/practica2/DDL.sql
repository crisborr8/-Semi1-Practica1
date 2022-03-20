CREATE TABLE USUARIO (
	idusuario INT NOT NULL AUTO_INCREMENT,
	username TEXT NOT NULL,
	name TEXT NOT NULL,
	contra TEXT NOT NULL,
	valor TEXT NOT NULL,
	PRIMARY KEY (idusuario)
);

CREATE TABLE PHOTO (
	idphoto INT NOT NULL AUTO_INCREMENT,
	nombre TEXT NOT NULL,
	descripcion TEXT NOT NULL,
	valor TEXT NOT NULL,
	idusuario INT NOT NULL,
	PRIMARY KEY (idphoto),
	FOREIGN KEY (idusuario) REFERENCES USUARIO (idusuario)
);

CREATE TABLE TAG (
	tag TEXT NOT NULL,
	idphoto INT NOT NULL,
	FOREIGN KEY (idphoto) references PHOTO (idphoto)
);

CREATE TABLE PHOTO_PERFIL (
	idphoto INT NOT NULL AUTO_INCREMENT,
	valor TEXT NOT NULL,
	idusuario INT NOT NULL,
	PRIMARY KEY (idphoto),
	FOREIGN KEY (idusuario) REFERENCES USUARIO (idusuario)
);
