from __main__ import app, mysql, client, client_rekognition
from flask import jsonify, request
from datetime import datetime
import hashlib
import base64
import os

@app.route('/newUser', methods=['POST'])
def newUser():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    username = data.get('username')
    name = data.get('name')
    contra = data.get('contra')
    foto = data.get('foto')
    #decode buffer from base64
    foto64 = base64.b64decode(foto)
    #password using md5
    hash = hashlib.md5(contra.encode())
    md5_str = hash.hexdigest()
    #photo value
    time = datetime.timestamp(datetime.now())
    valor = '{}-{}'.format(username,round(time))
    #query
    sql = "INSERT INTO USUARIO (username,name,contra,valor) VALUES ('{}','{}','{}','{}')".format(username,name,md5_str,valor)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        mysql.connection.commit()
        #get id from user
        sql = "SELECT idusuario FROM USUARIO WHERE username = '{}'".format(username)
        cur.execute(sql)
        data = cur.fetchall()
        id = data[0][0]
        #insert in profile photo
        sql = "INSERT INTO PHOTO_PERFIL (valor,idusuario) VALUES ('{}',{})".format(valor,id)
        cur.execute(sql)
        mysql.connection.commit()
        #save in s3
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'Fotos_Perfil/{}.jpg'.format(valor),
            ContentType = 'image'
        )
        #set result
        result['error'] = 'false'
        result['msg'] = 'Usuario creado con exito'
    except:
        #error creating user
        result['error'] = 'true'
        result['msg'] = "Error al crear el usuario"
    finally:
        cur.close()
    return jsonify(result)

@app.route('/allUsers')
def allUsers():
    sql = "SELECT * FROM USUARIO"
    cur = mysql.connection.cursor()
    cur.execute(sql)
    data = cur.fetchall()
    cur.close()
    data_ = []
    for row in data:
        usuario = {
            "idusuario": row[0],
            "username": row[1],
            "name": row[2],
            "contra": row[3],
            "valor": row[4]
        }
        data_.append(usuario)
    return jsonify(data_)

@app.route('/login', methods=['POST'])
def oneUser():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    username = data.get('username')
    contra = data.get('contra')
    #password using md5
    hash = hashlib.md5(contra.encode())
    md5_str = hash.hexdigest()
    #query
    sql = "SELECT idusuario,username,name,valor FROM USUARIO WHERE username = '{}' AND contra = '{}'".format(username,md5_str)
    #execute query
    cur = mysql.connection.cursor()
    try:
        cur.execute(sql)
        data = cur.fetchall()
        if len(data) > 0:#user found
            row = data[0]
            #set data in user
            usuario = {
                'idusuario': row[0],
                'username': row[1],
                'name': row[2],
                "valor": os.environ['BUCKET_URL']+'Fotos_Perfil/'+row[3]+'.jpg',
                'fotos': 0
            }
            #count photos
            sql = "SELECT COUNT(*) AS fotos FROM USUARIO AS u, PHOTO AS p WHERE u.idusuario = p.idusuario AND u.username = '{}'".format(username)
            cur.execute(sql)
            data = cur.fetchall()
            usuario['fotos'] = data[0][0]
            #set result
            result['error'] = 'false'
            result['msg'] = usuario
        else:
            #no user found
            result['error'] = 'true'
            result['msg'] = 'El usuario no existe'
    except:
        #no user found
        result['error'] = 'true'
        result['msg'] = 'Error al hacer login'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/loginFoto', methods=['POST'])
def loginFoto():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    username = data.get('username')
    foto1 = data.get('foto')
    #decode buffer from base64
    foto64 = base64.b64decode(foto1)
    #query
    sql = "SELECT valor FROM USUARIO WHERE username = '{}'".format(username)
    #execute query
    cur = mysql.connection.cursor()
    try:
        cur.execute(sql)
        data = cur.fetchall()
        if len(data) > 0:
            valor = data[0][0]
            obj = client.get_object(
                Bucket = os.environ['BUCKET'],
                Key = 'Fotos_Perfil/{}.jpg'.format(valor)
            )
            #bytes buffer
            foto = obj.get('Body').read()
            response = client_rekognition.compare_faces(
                SourceImage = {
                    'Bytes': foto
                },
                TargetImage = {
                    'Bytes': foto64
                },
                SimilarityThreshold = 80
            )
            if len(response['FaceMatches']) > 0 :
                #query
                sql = "SELECT idusuario,username,name,valor FROM USUARIO WHERE username = '{}'".format(username)
                #execute query
                cur = mysql.connection.cursor()
                cur.execute(sql)
                data = cur.fetchall()
                row = data[0]
                #set data in user
                usuario = {
                    'idusuario': row[0],
                    'username': row[1],
                    'name': row[2],
                    "valor": os.environ['BUCKET_URL']+'Fotos_Perfil/'+row[3]+'.jpg',
                    'fotos': 0
                }
                #count photos
                sql = "SELECT COUNT(*) AS fotos FROM USUARIO AS u, PHOTO AS p WHERE u.idusuario = p.idusuario AND u.username = '{}'".format(username)
                cur.execute(sql)
                data = cur.fetchall()
                usuario['fotos'] = data[0][0]
                #set result
                result['error'] = 'false'
                result['msg'] = usuario
            else:
                result['error'] = 'true'
                result['msg'] = 'No hay coincidencia'
        else:
            result['error'] = 'true'
            result['msg'] = 'El usuario no existe'
    except:
        result['error'] = 'true'
        result['msg'] = 'Error al ingresar'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/tagFotoPerfil', methods=['POST'])
def tagFotoPerfil():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    #query
    sql = "SELECT valor FROM USUARIO WHERE idusuario = '{}'".format(idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:
        cur.execute(sql)
        data = cur.fetchall()
        valor = data[0][0]
        obj = client.get_object(
            Bucket = os.environ['BUCKET'],
            Key = 'Fotos_Perfil/{}.jpg'.format(valor)
        )
        #bytes buffer
        foto = obj.get('Body').read()
        response = client_rekognition.detect_faces(
            Image = {
                'Bytes': foto
            },
            Attributes = ['ALL']
        )
        if len(response['FaceDetails']) > 0:
            detalles = response['FaceDetails'][0]
            genero = detalles['Gender']['Value']
            cadena = 'Genero: {}'.format(genero)
            edad_min = detalles['AgeRange']['Low']
            edad_max = detalles['AgeRange']['High']
            cadena += ' Edad {}-{}'.format(edad_min,edad_max)
            barba = detalles['Beard']['Value']
            if (barba):
                cadena += ' tiene barba'
            lentes = detalles['Eyeglasses']['Value']
            if (lentes):
                cadena += ' tiene lentes'
            ojos_abiertos = detalles['EyesOpen']['Value']
            if (ojos_abiertos):
                cadena += ' tiene los ojos abiertos'
            bigote = detalles['Mustache']['Value']
            if (bigote):
                cadena += ' tiene bigote'
            sonrisa = detalles['Smile']['Value']
            if (sonrisa):
                cadena += ' esta sonriendo'
            result['error'] = 'false'
            result['msg'] = cadena
        else:
            result['error'] = 'true'
            result['msg'] = 'Error no se reconoce rostro'
    except:
        result['error'] = 'true'
        result['msg'] = 'Error al obtener tag'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/userPhoto', methods=['POST'])
def userPhoto():
    #data from request
    data = request.get_json()
    username = data.get('username')
    obj = client.get_object(
        Bucket = os.environ['BUCKET'],
        Key = 'foto-perfil/{}.jpg'.format(username)
    )
    #bytes buffer
    foto = obj.get('Body').read()
    #decode buffer
    foto = base64.b64encode(foto).decode('utf-8')
    foto_ = {
        "foto": foto
    }
    return jsonify(foto_)

@app.route('/editUser', methods=['PUT'])
def editUser():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    id = data.get('idusuario')
    username = data.get('username')
    name = data.get('name')
    contra = data.get('contra')
    #password using md5
    hash = hashlib.md5(contra.encode())
    md5_str = hash.hexdigest()
    #query
    sql = "SELECT COUNT(*) FROM USUARIO WHERE idusuario = {} AND contra = '{}';".format(id,md5_str)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        data = cur.fetchall()
        match = data[0][0]
        if (match == 1):#password match
            #query
            sql = "UPDATE USUARIO SET username = '{}', name = '{}' WHERE idusuario = {}".format(username,name,id)
            cur.execute(sql)
            mysql.connection.commit()
            #set result
            result['error'] = 'false'
            result['msg'] = 'Usuario modificado con exito'
        else:#password error
            #set result
            result['error'] = 'true'
            result['msg'] = 'Contraseña incorrecta'
    except:#error trying to update
        result['error'] = 'true'
        result['msg'] = 'Error editando usuario'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/editPhotoUser', methods=['PUT'])
def editPhotoUser():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    id = data.get('idusuario')
    username = data.get('username')
    contra = data.get('contra')
    foto = data.get('foto')
    #decode buffer from base64
    foto64 = base64.b64decode(foto)
    #password using md5
    hash = hashlib.md5(contra.encode())
    md5_str = hash.hexdigest()
    #photo value
    time = datetime.timestamp(datetime.now())
    valor = '{}-{}'.format(username,round(time))
    #query
    sql = "SELECT COUNT(*) FROM USUARIO WHERE idusuario = {} AND contra = '{}';".format(id,md5_str)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        data = cur.fetchall()
        match = data[0][0]
        if (match == 1):#password match
            #insert profile photo
            sql = "INSERT INTO PHOTO_PERFIL (valor,idusuario) VALUES ('{}',{})".format(valor,id)
            cur.execute(sql)
            mysql.connection.commit()
            #update user photo
            sql = "UPDATE USUARIO SET valor = '{}' WHERE idusuario = {}".format(valor,id)
            cur.execute(sql)
            mysql.connection.commit()
            #save in s3
            client.put_object(
                Body = foto64,
                Bucket = os.environ['BUCKET'],
                Key = 'Fotos_Perfil/{}.jpg'.format(valor),
                ContentType = 'image'
            )
            #set result
            result['error'] = 'false'
            result['msg'] = os.environ['BUCKET_URL']+'Fotos_Perfil/'+valor+'.jpg'
        else:#password error
            #set result
            result['error'] = 'true'
            result['msg'] = 'Contraseña incorrecta'
    except:#error trying to update
        result['error'] = 'true'
        result['msg'] = 'Error editando foto de perfil'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/photoPerfil', methods=['POST'])
def photoPerfil():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    #query
    sql = "SELECT p.valor FROM PHOTO_PERFIL AS p, USUARIO AS u WHERE p.idusuario = u.idusuario AND u.idusuario = {}".format(idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        data = cur.fetchall()
        data_ = []
        for row in data:
            foto = {
                "valor": os.environ['BUCKET_URL']+'Fotos_Perfil/'+row[0]+'.jpg'
            }
            data_.append(foto)
        #set result
        result['error'] = 'false'
        result['msg'] = data_
    except:#error getting photos
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al obtener fotos'
    finally:
        cur.close()
    return jsonify(result)

