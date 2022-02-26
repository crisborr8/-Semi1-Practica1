from __main__ import app, mysql, client
from datetime import datetime
from flask import jsonify, request
import base64
import os

@app.route('/newAlbum', methods=['POST'])
def newAlbum():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    album = data.get('album')
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
            #set result
            result['error'] = 'false'
            result['msg'] = 'Album creado con exito'
        else:#album already exist
            #set result
            result['error'] = 'true'
            result['msg'] = 'El album ya existe'
    except:#error creating user
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al crear album'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/userAlbum',methods=['POST'])
def album():
    #result
    result = {
        'error': '',
        'msg': ''
    }
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
        data_ = []
        for row in data:
            album = {
                "idalbum": row[0],
                "nombre": row[1],
                "idusuario": row[2]
            }
            data_.append(album)
        #set result
        result['error'] = 'false'
        result['msg'] = data_
    except:#error creating user
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error obteniendo albums'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/newPhoto', methods=['POST'])
def newPhoto():
    #result
    result = {
        'error': '',
        'msg': ''
    }
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
        #save in s3
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'fotos/{}.jpg'.format(valor),
            ContentType = 'image'
        )
        #set result
        result['error'] = 'false'
        result['msg'] = 'Foto creada con exito'
    except:#error creating user
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al crear foto'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/userPhotos', methods=['POST'])
def userPhotos():
    #result
    result = {
        'error': '',
        'msg': ''
    }
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
        data_ = []
        for row in data:
            album = {
                "nombre": row[0],
                "valor": row[1]
            }
            data_.append(album)
        #set result
        result['error'] = 'false'
        result['msg'] = data_
    except:#error getting photos
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al obtener foto'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/editAlbum', methods=['PATCH'])
def editAlbum():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    idalbum = data.get('idalbum')
    nombre = data.get('nombre')
    #query
    sql = "SELECT * FROM album WHERE idusuario = {} AND nombre = '{}'".format(idusuario,nombre)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        if (cur.rowcount == 0):#new album
            #query
            sql = "UPDATE album SET nombre = '{}' WHERE idalbum = {}".format(nombre,idalbum)
            mysql.connection.commit()
            #set result
            result['error'] = 'false'
            result['msg'] = 'Album editado con exito'
        else:
            #set result
            result['error'] = 'true'
            result['msg'] = 'El album ya existe'
    except:#error trying to update
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al editar album'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/deleteAlbum', methods=['DELETE'])
def deleteAlbum():
    #result
    result = {
        'error': '',
        'msg': ''
    }
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
        #set result
        result['error'] = 'false'
        result['msg'] = 'Album eliminado con exito'
    except:#error trying to update
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al eliminar album'
    finally:
        cur.close()
    return jsonify(result)