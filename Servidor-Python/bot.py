from __main__ import app, client_lex
from cgitb import text
from crypt import methods
from flask import jsonify, request
import os

@app.route('/botReservacion', methods=['POST'])
def botReservacion():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    texto = data.get('texto')
    response = client_lex.recognize_text(
        botId = os.environ['ID1'],
        botAliasId = os.environ['ALIASID1'],
        localeId = 'es_419',
        sessionId = 'test_session',
        text = texto
    )
    try:
        try:
            if response['messages']:
                #set result
                result['error'] = 'false'
                result['msg'] = response['messages'][0]['content']
        except:
            session = response['sessionState']['intent']
            slots = session['slots']
            cadena = 'Proceso terminado.\n'
            cadena += 'Estado del proceso: ' + session['confirmationState'] + '\n'
            cadena += 'Checkin: ' + slots['CheckInDate']['value']['resolvedValues'][0] + '\n'
            cadena += 'Ubicacion: ' + slots['Location']['value']['resolvedValues'][0] + '\n'
            cadena += 'Noches: ' + slots['Nights']['value']['resolvedValues'][0] + '\n'
            cadena += 'Tipo de habitacion: ' + slots['RoomType']['value']['resolvedValues'][0]
            #set result
            result['error'] = 'false'
            result['msg'] = cadena
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error con el bot'
    return jsonify(result)

@app.route('/botDentista', methods=['POST'])
def botDentista():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    texto = data.get('texto')
    response = client_lex.recognize_text(
        botId = os.environ['ID2'],
        botAliasId = os.environ['ALIASID2'],
        localeId = 'es_419',
        sessionId = 'test_session',
        text = texto
    )
    try:
        try:
            if response['messages']:
                #set result
                result['error'] = 'false'
                result['msg'] = response['messages'][0]['content']
        except:
            session = response['sessionState']['intent']
            slots = session['slots']
            cadena = 'Proceso terminado.\n'
            cadena += 'Estado del proceso: ' + session['confirmationState'] + '\n'
            cadena += 'Tipo de cita: ' + slots['AppointmentType']['value']['resolvedValues'][0] + '\n'
            cadena += 'Fecha: ' + slots['Date']['value']['resolvedValues'][0] + '\n'
            cadena += 'Hora: ' + slots['Time']['value']['resolvedValues'][0]
            #set result
            result['error'] = 'false'
            result['msg'] = cadena
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error con el bot'
    return jsonify(result)

@app.route('/botFlores', methods=['POST'])
def botFlores():
    #result
    result = {
        'error': '',
        'msg': ''
    }
    #data from request
    data = request.get_json()
    texto = data.get('texto')
    response = client_lex.recognize_text(
        botId = os.environ['ID3'],
        botAliasId = os.environ['ALIASID3'],
        localeId = 'es_419',
        sessionId = 'test_session',
        text = texto
    )
    try:
        try:
            if response['messages']:
                #set result
                result['error'] = 'false'
                result['msg'] = response['messages'][0]['content']
        except:
            session = response['sessionState']['intent']
            slots = session['slots']
            cadena = 'Proceso terminado.\n'
            cadena += 'Estado del proceso: ' + session['confirmationState'] + '\n'
            cadena += 'Tipo de flores: ' + slots['FlowerType']['value']['resolvedValues'][0] + '\n'
            cadena += 'Fecha: ' + slots['PickupDate']['value']['resolvedValues'][0] + '\n'
            cadena += 'Hora: ' + slots['PickupTime']['value']['resolvedValues'][0]
            #set result
            result['error'] = 'false'
            result['msg'] = cadena
    except:
        #set result
        result['error'] = 'true'
        result['msg'] = 'Error con el bot'
    return jsonify(result)