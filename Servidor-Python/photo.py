from __main__ import app, mysql, client, client_rekognition, client_translate
from datetime import datetime
from flask import jsonify, request
import base64
import os

'''
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
    sql = "SELECT * FROM ALBUM WHERE nombre = '{}' AND idusuario = {}".format(album, idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        if (cur.rowcount == 0):#new album
            #new query
            sql = "INSERT INTO ALBUM (nombre,idusuario) VALUES ('{}',{})".format(album,idusuario)
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
    sql = "SELECT * FROM ALBUM WHERE idusuario = {}".format(idusuario)
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
    sql = "INSERT INTO PHOTO (nombre,valor,idalbum) VALUES ('{}','{}',{})".format(nombre,valor,idalbum)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        mysql.connection.commit()
        #save in s3
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'Fotos_Publicadas/{}.jpg'.format(valor),
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
    sql = "SELECT p.nombre, p.valor FROM PHOTO AS p, ALBUM AS a WHERE p.idalbum = a.idalbum AND a.idalbum = {}".format(idalbum)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        data = cur.fetchall()
        data_ = []
        for row in data:
            album = {
                "nombre": row[0],
                "valor": os.environ['BUCKET_URL']+'Fotos_Publicadas/'+row[1]+'.jpg'
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

@app.route('/editAlbum', methods=['PUT'])
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
    sql = "SELECT * FROM ALBUM WHERE idusuario = {} AND nombre = '{}'".format(idusuario,nombre)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        if (cur.rowcount == 0):#new album
            #query
            sql = "UPDATE ALBUM SET nombre = '{}' WHERE idalbum = {}".format(nombre,idalbum)
            #execute query
            cur.execute(sql)
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
    idusuario = data.get('idusuario')
    idalbum = data.get('idalbum')
    #query
    sql = "DELETE FROM PHOTO WHERE idalbum = {}".format(idalbum)
    #execute query
    cur = mysql.connection.cursor()
    try:#update user
        cur.execute(sql)
        mysql.connection.commit()
        #query
        sql = "DELETE FROM ALBUM WHERE idalbum = {}".format(idalbum)
        cur.execute(sql)
        mysql.connection.commit()
        usuario = {
            'albums': 0,
            'fotos': 0
        }
        #count albums
        sql = "SELECT COUNT(*) AS albums FROM USUARIO AS u, ALBUM AS a WHERE u.idusuario = a.idusuario AND u.idusuario = {}".format(idusuario)
        cur.execute(sql)
        data = cur.fetchall()
        usuario['albums'] = data[0][0]
        #count photos
        sql = "SELECT COUNT(*) AS fotos FROM USUARIO AS u, ALBUM AS a, PHOTO AS p WHERE u.idusuario = a.idusuario AND a.idalbum = p.idalbum AND u.idusuario = {}".format(idusuario)
        cur.execute(sql)
        data = cur.fetchall()
        usuario['fotos'] = data[0][0]
        #set result
        result['error'] = 'false'
        result['msg'] = usuario
    except:#error trying to update
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al eliminar album'
    finally:
        cur.close()
    return jsonify(result)
'''

@app.route('/extraerTexto', methods=['POST'])
def extraerText():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    foto = data.get('foto')
    #decode buffer from base64
    foto64 = base64.b64decode(foto)
    try:
        response = client_rekognition.detect_text(
            Image = {
                'Bytes': foto64
            }
        )
        if len(response['TextDetections']) > 0:
            cadena = ''
            for text in response['TextDetections']:
                cadena += text['DetectedText'] + ' '
            result['error'] = 'false'
            result['msg'] = cadena
        else:
            result['error'] = 'true'
            result['msg'] = 'No se detecto texto'
    except:
        result['error'] = 'true'
        result['msg'] = 'Error al extraer texto'
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
    idusuario = data.get('idusuario')
    nombre = data.get('nombre')
    descripcion = data.get('descripcion')
    foto = data.get('foto')
    #decode buffer from base64
    foto64 = base64.b64decode(foto)
    time = datetime.timestamp(datetime.now())
    valor = "{}-{}".format(nombre,round(time))
    #query
    sql = "INSERT INTO PHOTO (nombre,descripcion,valor,idusuario) VALUES ('{}','{}','{}',{})".format(nombre,descripcion,valor,idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        mysql.connection.commit()
        #save in s3
        client.put_object(
            Body = foto64,
            Bucket = os.environ['BUCKET'],
            Key = 'Fotos_Publicadas/{}.jpg'.format(valor),
            ContentType = 'image'
        )
        #query for id
        sql = "SELECT idphoto FROM PHOTO WHERE valor = '{}'".format(valor)
        cur.execute(sql)
        data = cur.fetchall()
        id = data[0][0]
        #tags
        response = client_rekognition.detect_labels(
            Image = {
                'Bytes': foto64
            },
            MaxLabels = 5
        )
        labels = []
        for label in response['Labels']:
            labels.append(label['Name'])
            #query for tags
            sql = "INSERT INTO TAG (tag,idphoto) VALUES ('{}',{})".format(label['Name'],id)
            cur.execute(sql)
            mysql.connection.commit()
        #set result
        result['error'] = 'false'
        result['msg'] = 'Foto subida con exito'
    except:#error creating user
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al subir foto'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/verFotos', methods=['POST'])
def verFotos():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    #query
    sql = "SELECT p.idphoto, p.nombre, p.descripcion, p.valor FROM PHOTO AS p, USUARIO AS u WHERE u.idusuario = p.idusuario AND u.idusuario = {}".format(idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:
        cur.execute(sql)
        data = cur.fetchall()
        data_ = []
        for row in data:
            foto = {
                "idphoto": row[0],
                "nombre": row[1],
                "descripcion": row[2],
                "valor": os.environ['BUCKET_URL']+'Fotos_Publicadas/'+row[3]+'.jpg'
            }
            data_.append(foto)
        #set result
        result['error'] = 'false'
        result['msg'] = data_
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = "Error al obtener fotos"
    finally:
        cur.close()
    return jsonify(result)

@app.route('/detalleFoto', methods=['POST'])
def detalleFoto():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idfoto = data.get('idfoto')
    #query
    sql = "SELECT nombre, descripcion, valor FROM PHOTO WHERE idphoto = {}".format(idfoto)
    #execute query
    cur = mysql.connection.cursor()
    try:
        cur.execute(sql)
        data = cur.fetchall()
        row = data[0]
        foto = {
            'nombre': row[0],
            'descripcion': row[1],
            'valor': row[2],
            'tags': '',
        }
        #query for tags
        sql = "SELECT tag FROM TAG WHERE idphoto = {}".format(idfoto)
        #execute query
        cur.execute(sql)
        data = cur.fetchall()
        data_ = []
        for row in data:
            data_.append(row[0])
        foto['tags'] = data_
        #set result
        result['error'] = 'false'
        result['msg'] = foto
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = foto
    finally:
        cur.close()
    return jsonify(result)

@app.route('/verTags', methods=['POST'])
def verTags():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    #query
    sql = "SELECT t.tag FROM TAG AS t, PHOTO AS p, USUARIO AS u WHERE t.idphoto = p.idphoto AND p.idusuario = u.idusuario AND u.idusuario = {} GROUP BY t.tag".format(idusuario)
    #execute query
    cur = mysql.connection.cursor()
    try:
        cur.execute(sql)
        data = cur.fetchall()
        data_ = []
        for row in data:
            data_.append(row[0])
        #set result
        result['error'] = 'false'
        result['msg'] = data_
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al obtener tags'
    finally:
        cur.close()
    return jsonify(result)

@app.route('/fotoTag', methods=['POST'])
def fotoTag():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    idusuario = data.get('idusuario')
    tag = data.get('tag')
    #query
    sql = "SELECT p.idphoto, p.nombre, p.descripcion, p.valor FROM TAG AS t, PHOTO AS p, USUARIO AS u WHERE t.idphoto = p.idphoto AND p.idusuario = u.idusuario AND u.idusuario = {} AND t.tag = '{}'".format(idusuario, tag)
    #execute query
    cur = mysql.connection.cursor()
    try:
        cur.execute(sql)
        data = cur.fetchall()
        data_ = []
        for row in data:
            foto = {
                "idphoto": row[0],
                "nombre": row[1],
                "descripcion": row[2],
                "valor": os.environ['BUCKET_URL']+'Fotos_Publicadas/'+row[3]+'.jpg'
            }
            data_.append(foto)
        #set result
        result['error'] = 'false'
        result['msg'] = data_
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al obtener fotos'
    return jsonify(result)

@app.route('/traducirTexto', methods=['POST'])
def traducirText():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    cadena = data.get('cadena')
    idioma = data.get('idioma')
    if (idioma == 'English'):
        idioma = 'en'
    if (idioma == 'Japanese'):
        idioma = 'ja'
    if (idioma == 'Russian'):
        idioma = 'ru'
    else:
        print('JAnt')
    try:
        response = client_translate.translate_text(
            Text = cadena,
            SourceLanguageCode = 'auto',
            TargetLanguageCode = idioma
        )
        #set result
        result['error'] = 'false'
        result['msg'] = response['TranslatedText']
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error al traducir texto'
    return jsonify(result)