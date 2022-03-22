from crypt import methods
import os
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin
import boto3

client = boto3.client(
    's3',
    region_name = os.environ['REGION'],
    aws_access_key_id = os.environ['KEY'],
    aws_secret_access_key = os.environ['SECRET_KEY']
)

client_rekognition = boto3.client(
    'rekognition',
    region_name = os.environ['REGION'],
    aws_access_key_id = os.environ['KEY_RECOGNITION'],
    aws_secret_access_key = os.environ['SECRET_KEY_RECOGNITION']
)

client_translate = boto3.client(
    'translate',
    region_name = os.environ['REGION'],
    aws_access_key_id = os.environ['KEY_TRANSLATE'],
    aws_secret_access_key = os.environ['SECRET_KEY_TRANSLATE']
)

app = Flask(__name__)

#CORS(app)
CORS(app, resources={ r"/*": { "origins": "*"} })

app.config['MYSQL_HOST'] = os.environ['MYSQL_HOST']
app.config['MYSQL_USER'] = os.environ['MYSQL_USER']
app.config['MYSQL_PASSWORD'] = os.environ['MYSQL_PASSWORD']
app.config['MYSQL_DB'] = os.environ['MYSQL_DB']

mysql = MySQL(app)

@cross_origin()
@app.route('/')
def index():
    return ('Python api is running')

import user
import photo

if __name__ == '__main__':
    app.run(port = 3000, host='0.0.0.0',debug=True)

"""
from flask import jsonify, make_response
@app.route('/summary')
def summary():
    d = make_summary()
    return make_response(jsonify(d), 200)
"""