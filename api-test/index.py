from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import os

app = Flask(__name__)

app.config['MYSQL_HOST'] = os.environ['MYSQL_HOST']
app.config['MYSQL_USER'] = os.environ['MYSQL_USER']
app.config['MYSQL_PASSWORD'] = os.environ['MYSQL_PASSWORD']
app.config['MYSQL_DB'] = os.environ['MYSQL_DB']

mysql = MySQL(app)

@app.route('/')
def index():
    return ('Python api is running')

@app.route('/newUser', methods=['POST'])
def newUser():
    #data from request
    data = request.get_json()
    username = data.get('username')
    name = data.get('name')
    contra = data.get('contra')
    foto = data.get('foto')
    print("VALOR FOTO")
    print(foto)
    #query
    sql = "INSERT INTO usuario (username,name,contra) VALUES ('{}','{}','{}')".format(username,name,contra)
    #execute query
    cur = mysql.connection.cursor()
    try:#create user
        cur.execute(sql)
        mysql.connection.commit()
        cur.close()
        return jsonify({
            "error": "false",
            "msg": "Usuario creado con exito"
        })
    except:#error creating user
        cur.close()
        return jsonify({
            "error": "true",
            "msg": "Error al crear el usuario"
        })

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
        result = {
            "error": "false",
            "msg": {
                "idusuario": '',
                "username": '',
                "name": '',
                "contra": '',
                "albumes_creados": 0,
                "fotos_subidas": 0
            }
        }
        for row in data:
            result['msg']['idusuario'] = row[0]
            result['msg']['username'] = row[1]
            result['msg']['name'] = row[2]
        return jsonify(result)
    else:
        #no user found
        return jsonify({
            "error": "true",
            "msg": "El usuario no existe"
        })

if __name__ == '__main__':
    app.run(port = 3000, host='0.0.0.0',debug=True)