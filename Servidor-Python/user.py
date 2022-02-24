from __main__ import app, mysql, client
from fileinput import filename
from flask import jsonify, request
import base64
import os

@app.route('/newUser', methods=['POST'])
def newUser():
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
        cur.close()
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'foto-perfil/{}.jpg'.format(username),
            ContentType = 'image'
        )
        return "user added: {}".format(username)
    except:#error creating user
        cur.close()
        return "Error adding user"

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
    #data from request
    data = request.get_json()
    username = data.get('username')
    contra = data.get('contra')
    #query
    sql = "SELECT * FROM usuario WHERE username = '{}' AND contra = '{}'".format(username,contra)
    #execute query
    cur = mysql.connection.cursor()
    cur.execute(sql)
    data = cur.fetchall()
    cur.close()
    if len(data) > 0:#user found
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
    else:
        #no user found
        return jsonify(data)

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
    #data from request
    data = request.get_json()
    id = data.get('idusuario')
    username = data.get('username')
    name = data.get('name')
    foto = data.get('foto')
    #decode buffer from base64
    foto64 = base64.b64decode(foto)
    #query
    sql = "UPDATE usuario SET username = '{}', name = '{}' WHERE idusuario = {}".format(username,name,id)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'foto-perfil/{}.jpg'.format(username),
            ContentType = 'image'
        )
        return "user {} updated".format(id)
    except:#error trying to update
        return "Error trying to update user"