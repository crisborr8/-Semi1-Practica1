from __main__ import app, mysql, client
from flask import jsonify, request
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
    #query
    sql = "INSERT INTO usuario (username,name,contra) VALUES ('{}','{}','{}')".format(username,name,contra)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        mysql.connection.commit()
        #save in s3
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'foto-perfil/{}.jpg'.format(username),
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
    sql = "SELECT * FROM usuario"
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
            "contra": row[3]
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
    #query
    sql = "SELECT * FROM usuario WHERE username = '{}' AND contra = '{}'".format(username,contra)
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
                'albums': 0,
                'fotos': 0
            }
            #count albums
            sql = "SELECT COUNT(*) AS albums FROM usuario AS u, album AS a WHERE u.idusuario = a.idusuario AND u.username = '{}'".format(username)
            cur.execute(sql)
            data = cur.fetchall()
            usuario['albums'] = data[0][0]
            #count photos
            sql = "SELECT COUNT(*) AS fotos FROM usuario AS u, album AS a, photo AS p WHERE u.idusuario = a.idusuario AND a.idalbum = p.idalbum AND u.username = '{}'".format(username)
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

@app.route('/editUser', methods=['PATCH'])
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
    foto = data.get('foto')
    contra = data.get('contra')
    #decode buffer from base64
    foto64 = base64.b64decode(foto)
    #query
    sql = "SELECT COUNT(*) FROM usuario WHERE idusuario = {} AND contra = '{}';".format(id,contra)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        data = cur.fetchall()
        match = data[0][0]
        if (match == 1):#password match
            #query
            sql = "UPDATE usuario SET username = '{}', name = '{}' WHERE idusuario = {}".format(username,name,id)
            mysql.connection.commit()
            #save in s3
            client.put_object(
                Body = foto64,
                Bucket = os.environ['BUCKET'],
                Key = 'foto-perfil/{}.jpg'.format(username),
                ContentType = 'image'
            )
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