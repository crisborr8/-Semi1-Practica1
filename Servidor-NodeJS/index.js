var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const mysql = require('mysql');
//Se inicializa el sdk para menejar los servicios de AWS 
var AWS = require('aws-sdk');

const db_credentials = require('./db_credentials');
const aws_keys = require('./aws_keys');
var conn = mysql.createPool(db_credentials);
const s3 = new AWS.S3(aws_keys.s3);

const crypto = require('crypto')



const cors = require('cors');

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))


var port = 3000;
app.listen(port);
console.log("Escuchando en el puerto", port)


/******************************RDS *************/
//obtener datos de la BD

app.get("/", async (req, res) => {


    res.status(200).json({
        error: 'false',
        msg: 'Hola'
    })      


});

app.get("/getusuario", async (req, res) => {
    let username = req.query.username;

    var operacion = 'CU';

    let sql = "CALL sp_usuario('" + operacion + "'," + "'" + username + "'" + ",null, null,null);";

    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message       
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
            console.log(respuesta);
            res.status(200).json({
                id: respuesta[0][0].idusuario,
                username: respuesta[0][0].username,
                nombre: respuesta[0][0].nombre,
                contra: respuesta[0][0].contra            
            })
        }

    });          


});

app.post("/login", async (req, res) => {
    var username = req.body.username;
    var contra = req.body.contra;

    var operacion = 'L';

    let hash = crypto.createHash('md5').update(contra).digest("hex")    

    let sql = "CALL sp_usuario('" + operacion +  "',null,'" + username + "','" + hash + "',null,null);";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message       
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
    
            let resultado = respuesta[1][0].valido 
            if (resultado == 'FALSE'){
                res.status(400).json({
                    error: 'true',
                    msg: 'El usuario no existe'
                })            
            } else {
                res.status(200).json({
                    error: 'false',
                    msg: {
                        idusuario: respuesta[0][0].idusuario,
                        username: respuesta[0][0].username,
                        name: respuesta[0][0].name,
                        valor: 'https://practica1-g2b-imagenes.s3.amazonaws.com/Fotos_Perfil/' + respuesta[0][0].valor +'.jpg',
                        albums: respuesta[2][0].albums,
                        fotos: respuesta[3][0].fotos,
                    }
                })              
            }
        }


    });
});

app.post("/newUser", async (req, res) => {
    var username = req.body.username;
    var name = req.body.name;
    var contra = req.body.contra;
    var encodedImage = req.body.foto;
    
    var operacion = 'C';
    let hash = crypto.createHash('md5').update(contra).digest("hex")

    //Decodificar imagen
    let decodedImage = Buffer.from(encodedImage, 'base64');

    var valor = username + Date.now();
    let extension = 'jpg';      

    let filename = `${valor}.${extension}`;    

    //Parámetros para S3
    let bucketname = 'practica1-g2b-imagenes';
    let folder = 'Fotos_Perfil/';
    let filepath = `${folder}${filename}`;
    var uploadParamsS3 = {
        Bucket: bucketname,
        Key: filepath,
        Body: decodedImage
        //ACL: 'public-read', // ACL -> LE APLICA LA POLITICA AL OBJETO QUE SE ESTA GUARDANDO
    };        

    let sql = "CALL sp_usuario('" + operacion + "',null,'" + username + "','" + hash + "','"  + name + "','"  + valor + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));

            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){

                // Se sube imagen a S3

                s3.upload(uploadParamsS3, function sync(err, data) {
                    if (err) {
                        console.log('Error uploading file:', err);
                        res.status(400).json({
                            error: 'true',
                            msg: 'Error al crear el usuario'
                        }) 
                    } else {
                        console.log('Upload success at:', data.Location);
                        res.status(200).json({
                            error: 'false',
                            msg: 'Usuario creado con éxito'
                        })                          
                    }
                });           

          
            } else {
                res.status(400).json({
                    error: 'true',
                    msg: 'Error al crear el usuario, usuario ya existe'
                })              
            }
        }

    });
});

app.patch("/editUser", async (req, res) => {
    var idusuario = req.body.idusuario;
    var username = req.body.username;
    var name = req.body.name;
    var contra = req.body.contra;

    var operacion = 'A';

    let hash = crypto.createHash('md5').update(contra).digest("hex")

    let sql = "CALL sp_usuario('" + operacion + "','" + idusuario + "','" + username + "','" + hash + "','"  + name + "',null);";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
    
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(400).json({
                    error: 'true',
                    msg: 'Error editando usuario'
                })            
            } else {
                res.status(200).json({
                    error: 'false',
                    msg: 'Usuario modificado con éxito'
                })              
            }
        }

    });
});

app.post("/newAlbum", async (req, res) => {
    var idusuario = req.body.idusuario;
    var album = req.body.album;

    var operacion = 'NA';
    var idalbum = null;
    var nombre = null;
    var foto = null;


    let sql = "CALL sp_fotos('" + operacion + "','" + idusuario + "','" + idalbum + "','"  + album + "','"  + nombre + "','"  + foto + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
    
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(200).json({
                    error: 'false',
                    msg: 'Album creado con exito'
                })            
            } else {
                res.status(400).json({
                    error: 'true',
                    msg: 'Error al crear album'
                })              
            }
        }

    });
});

app.post("/userAlbum", async (req, res) => {
    var idusuario = req.body.idusuario;

    var operacion = 'CA';
    var idalbum = null;
    var album = null;
    var nombre = null;
    var foto = null;


    let sql = "CALL sp_fotos('" + operacion + "','" + idusuario + "','" + idalbum + "','"  + album + "','"  + nombre + "','"  + foto + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message       
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
            console.log(respuesta);
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(200).json({
                    error: 'false',
                    msg: ''
                })            
            } else {

                res.status(200).json(
                    {error: 'false',
                    msg: result[0]});                    
          
            }
        }


    });
});

app.post("/newPhoto", async (req, res) => {
    var idalbum = req.body.idalbum;
    var nombre = req.body.nombre;
    var encodedImage = req.body.foto;

    var operacion = 'NF';
    var idusuario = null;
    var album = null;

    //Decodificar imagen
    let decodedImage = Buffer.from(encodedImage, 'base64');

    var valor = idalbum + '-' + nombre + '-' +Date.now();
    let extension = 'jpg';      

    let filename = `${valor}.${extension}`;    

    //Parámetros para S3
    let bucketname = 'practica1-g2b-imagenes';
    let folder = 'Fotos_Publicadas/';
    let filepath = `${folder}${filename}`;
    var uploadParamsS3 = {
        Bucket: bucketname,
        Key: filepath,
        Body: decodedImage
        //ACL: 'public-read', // ACL -> LE APLICA LA POLITICA AL OBJETO QUE SE ESTA GUARDANDO
    };    


    let sql = "CALL sp_fotos('" + operacion + "','" + idusuario + "','" + idalbum + "','"  + album + "','"  + nombre + "','"  + valor + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
    
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){

                // Se sube imagen a S3

                s3.upload(uploadParamsS3, function sync(err, data) {
                    if (err) {
                        console.log('Error uploading file:', err);
                        res.status(400).json({
                            error: 'true',
                            msg: 'Error al crear foto'
                        })      
                    } else {
                        console.log('Upload success at:', data.Location);
                        res.status(200).json({
                            error: 'false',
                            msg: 'Foto creada con exito'
                        })                         
                    }
                });  
          
            } else {
                res.status(400).json({
                    error: 'true',
                    msg: 'Error al crear foto'
                })              
            }
        }

    });
});

app.post("/userPhotos", async (req, res) => {
    
    var idalbum = req.body.idalbum;

    var idusuario = null;
    var operacion = 'CF';
    var album = null;
    var nombre = null;
    var foto = null;


    let sql = "CALL sp_fotos('" + operacion + "','" + idusuario + "','" + idalbum + "','"  + album + "','"  + nombre + "','"  + foto + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message       
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
            console.log(respuesta);
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(200).json({
                    error: 'false',
                    msg: ''
                })            
            } else {

                res.status(200).json(
                    {error: 'false',
                    msg: result[0]});                    
          
            }
        }


    });
});

app.patch("/editAlbum", async (req, res) => {
    var idalbum = req.body.idalbum;
    var idusuario = req.body.idusuario;
    var album = req.body.album; 

    var operacion = 'AA';
    var nombre = null; 
    var foto = null;


    let sql = "CALL sp_fotos('" + operacion + "','" + idusuario + "','" + idalbum + "','"  + album + "','"  + nombre + "','"  + foto + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
    
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(400).json({
                    error: 'true',
                    msg: 'Error al editar álbum'
                })            
            } else {
                res.status(200).json({
                    error: 'false',
                    msg: 'Álbum editado con exito'
                })              
            }
        }

    });
});

app.delete("/deleteAlbum", async (req, res) => {
    var idalbum = req.body.idalbum;
    
    var idusuario = null;
    var album = null;

    var operacion = 'EA';
    var nombre = null; 
    var foto = null;


    let sql = "CALL sp_fotos('" + operacion + "','" + idusuario + "','" + idalbum + "','"  + album + "','"  + nombre + "','"  + foto + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
    
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(400).json({
                    error: 'true',
                    msg: 'Error al eliminar álbum'
                })            
            } else {
                res.status(200).json({
                    error: 'false',
                    msg: 'Album eliminado con éxito'
                })              
            }
        }

    });
});

app.patch("/editPhotoUser", async (req, res) => {
    var idusuario = req.body.idusuario;
    var username = req.body.username;
    var encodedImage = req.body.foto;
    var contra = req.body.contra;

    var operacion = 'EFP';
    var name = null;

    let hash = crypto.createHash('md5').update(contra).digest("hex")

    //Decodificar imagen
    let decodedImage = Buffer.from(encodedImage, 'base64');

    var valor = username + '-' + Date.now();
    let extension = 'jpg';      

    let filename = `${valor}.${extension}`;    

    //Parámetros para S3
    let bucketname = 'practica1-g2b-imagenes';
    let folder = 'Fotos_Perfil/';
    let filepath = `${folder}${filename}`;
    var uploadParamsS3 = {
        Bucket: bucketname,
        Key: filepath,
        Body: decodedImage
        //ACL: 'public-read', // ACL -> LE APLICA LA POLITICA AL OBJETO QUE SE ESTA GUARDANDO
    };    

    let sql = "CALL sp_usuario('" + operacion + "','" + idusuario + "','" + username + "','" + hash + "','"  + name + "','" + valor +"');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
    
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(400).json({
                    error: 'true',
                    msg: 'Error editando foto de perfil'
                })            
            } else {
                // Se sube imagen a S3

                s3.upload(uploadParamsS3, function sync(err, data) {
                    if (err) {
                        console.log('Error uploading file:', err);
                        res.status(400).json({
                            error: 'true',
                            msg: 'Error editando foto de perfil'
                        })  
                    } else {
                        console.log('Upload success at:', data.Location);
                        res.status(200).json({
                            error: 'false',
                            msg: data.Location
                        })                              
                    }
                });  
        
            }
        }

    });
});

app.post("/photoPerfil", async (req, res) => {
    
    var idusuario = req.body.idusuario;
    var username = null;
    var foto = null;

    var operacion = 'CFP';
    var name = null;

    let hash = null;

    let sql = "CALL sp_usuario('" + operacion + "','" + idusuario + "','" + username + "','" + hash + "','"  + name + "','" + foto +"');"; 
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message       
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
            console.log(respuesta);
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(200).json({
                    error: 'false',
                    msg: ''
                })            
            } else {

                res.status(200).json(
                    {error: 'false',
                    msg: result[0]});                    
          
            }
        }


    });
});