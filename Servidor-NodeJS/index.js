var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const mysql = require('mysql');

const db_credentials = require('./db_credentials');
var conn = mysql.createPool(db_credentials);

const crypto = require('crypto')



const cors = require('cors');

var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

/*
app.get('/', function (req, res ) {
    res.json({messaje: 'Hola Seminario'})
})*/

var port = 3000;
app.listen(port);
console.log("Escuchando en el puerto", port)


//Se inicializa el sdk para menejar los servicios de AWS 
var AWS = require('aws-sdk');


// ruta que se usa para subir una foto 

app.post('/subirfoto', function (req, res){

    var id = req.body.id;
    var foto = req.body.foto;
    //carpeta y nombre que quieran darle a la imagen
  
    var nombrei = "fotos/" + id + ".jpg"; // fotos -> se llama la carpeta 
    //se convierte la base64 a bytes
    let buff = new Buffer.from(foto, 'base64');
  


    AWS.config.update({
        region: 'us-east-2', // se coloca la region del bucket 
        accessKeyId: 'AKIAQ42CO2WRGVMK4652',
        secretAccessKey: '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'
    });

    var s3 = new AWS.S3(); // se crea una variable que pueda tener acceso a las caracteristicas de S3
    // metodo 1
    const params = {
      Bucket: "bpractica1",
      Key: nombrei,
      Body: buff,
      ContentType: "image"
    };
    const putResult = s3.putObject(params).promise();
    res.json({ mensaje: putResult })

});

app.post('/obtenerfoto', function (req, res) {
    var id = req.body.id;
    var nombrei = "fotos/"+id+".jpg";

    AWS.config.update({
        region: 'us-east-2', // se coloca la region del bucket 
        accessKeyId: 'AKIAQ42CO2WRGVMK4652',
        secretAccessKey: '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'
    });

    var S3 = new AWS.S3();

    var getParams = 
    {
        Bucket: "bpractica1",
        Key: nombrei
    }

    S3.getObject(getParams, function(err, data){
        if (err)
        {
            res.json(error)
        }else
        {
            var dataBase64 = Buffer.from(data.Body).toString('base64'); //resgresar de byte a base
            res.json({mensaje: dataBase64})
        }

    })

});

/******************************RDS *************/
//obtener datos de la BD
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
                        nombre: respuesta[0][0].nombre,
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
    var foto = req.body.foto;

    var operacion = 'C';

    let hash = crypto.createHash('md5').update(contra).digest("hex")

    let sql = "CALL sp_usuario('" + operacion + "',null,'" + username + "','" + hash + "','"  + name + "','"  + foto + "');";
    conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({
                error: 'true',
                msg: err.message    
            })
        }else{
            let respuesta = JSON.parse(JSON.stringify(result));
            console.log(result);
            let resultado = respuesta[1][0].existe 
            if (resultado == 'FALSE'){
                res.status(200).json({
                    error: 'false',
                    msg: 'Usuario creado con éxito'
                })            
            } else {
                res.status(400).json({
                    error: 'true',
                    msg: 'Error al crear el usuario'
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
    var foto = req.body.foto;

    var operacion = 'NF';
    var idusuario = null;
    var album = null;


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
                    msg: 'Foto creada con exito'
                })            
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
    var foto = req.body.foto;
    var contra = req.body.contra;

    var operacion = 'EFP';
    var name = null;

    let hash = crypto.createHash('md5').update(contra).digest("hex")

    let sql = "CALL sp_usuario('" + operacion + "','" + idusuario + "','" + username + "','" + hash + "','"  + name + "','" + foto +"');";
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
                res.status(200).json({
                    error: 'false',
                    msg: 'Foto de perfil agregada con éxito'
                })              
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