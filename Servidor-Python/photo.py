from __main__ import app, mysql, client
from crypt import methods
from datetime import datetime
from os import times
from flask import jsonify, request
import base64
import os

@app.route('/newAlbum', methods=['POST'])
def newAlbum():
    #data from request
    data = request.get_json()
    album = data.get('album')
    idusuario = data.get('idusuario')
    #query
    sql = "SELECT * FROM album WHERE nombre = '{}' AND idusuario = {}".format(album, idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        if (cur.rowcount == 0):#new album
            #new query
            sql = "INSERT INTO album (nombre,idusuario) VALUES ('{}',{})".format(album,idusuario)
            cur.execute(sql)
            mysql.connection.commit()
            cur.close()
            return "album added: {}".format(album)
        else:#album already exist
            cur.close()
            return "Error, this album '{}' already exist".format(album)
    except:#error creating user
        cur.close()
        return "Error adding album"

@app.route('/userAlbum',methods=['POST'])
def album():
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    #query
    sql = "SELECT * FROM album WHERE idusuario = {}".format(idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        data_ = []
        for row in data:
            album = {
                "idalbum": row[0],
                "nombre": row[1],
                "idusuario": row[2]
            }
            data_.append(album)
        return jsonify(data_)
    except:#error creating user
        cur.close()
        return "Error getting albums"

@app.route('/newPhoto', methods=['POST'])
def newPhoto():
    #data from request
    data = request.get_json()
    idalbum = data.get('idalbum')
    nombre = data.get('nombre')
    foto = data.get('foto')
    #decode buffer from base64
    foto64 = base64.b64decode(foto)
    time = datetime.timestamp(datetime.now())
    valor = "{}-{}-{}".format(idalbum,nombre,round(time))
    #query
    sql = "INSERT INTO photo (nombre,valor,idalbum) VALUES ('{}','{}',{})".format(nombre,valor,idalbum)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'fotos/{}.jpg'.format(valor),
            ContentType = 'image'
        )
        return "photo added: {}".format(nombre)
    except:#error creating user
        cur.close()
        return "Error adding photo"

@app.route('/userPhotos', methods=['POST'])
def userPhotos():
    #data from request
    data = request.get_json()
    idalbum = data.get('idalbum')
    #query
    sql = "SELECT p.nombre, p.valor FROM photo AS p, album AS a WHERE p.idalbum = a.idalbum AND a.idalbum = {}".format(idalbum)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        data = cur.fetchall()
        cur.close()
        data_ = []
        for row in data:
            album = {
                "nombre": row[0],
                "valor": row[1]
            }
            data_.append(album)
        return jsonify(data_)
    except:#error creating user
        cur.close()
        return "Error getting photos"

@app.route('/editAlbum', methods=['PATCH'])
def editAlbum():
    #data from request
    data = request.get_json()
    idalbum = data.get('idalbum')
    nombre = data.get('nombre')
    #query
    sql = "UPDATE album SET nombre = '{}' WHERE idalbum = {}".format(nombre,idalbum)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        return "album {} updated".format(idalbum)
    except:#error trying to update
        return "Error trying to update album"

@app.route('/deleteAlbum', methods=['DELETE'])
def deleteAlbum():
    #data from request
    data = request.get_json()
    idalbum = data.get('idalbum')
    #query
    sql = "DELETE FROM photo WHERE idalbum = {}".format(idalbum)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        mysql.connection.commit()
        #query
        sql = "DELETE FROM album WHERE idalbum = {}".format(idalbum)
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        return "album {} deleted".format(idalbum)
    except:#error trying to update
        return "Error trying to delete album"