import React, { Component } from 'react';

import './inicio.css';
import './dropdown.css';

import Subir_fotos from "./subir_fotos/subir_fotos.js";

import Ver_Album from "./ver_album/ver_album.js";
import Ver_fotos from "./ver_fotos/ver_fotos.js";
import Editar from "./editar/editar.js";
import Bot_reservacion from "./bot/bot_reservacion.js";
import Bot_flores from "./bot/bot_flores.js";
import Bot_dentista from "./bot/bot_dentista.js";

function Salir(){
    sessionStorage.setItem("albums", "");
    sessionStorage.setItem("fotos", "");
    sessionStorage.setItem("id", "");
    sessionStorage.setItem("nombre", "");
    sessionStorage.setItem("usuario", "");
    sessionStorage.setItem("foto_perfil", "");
    window.location.href = '/';
}

class Inicio extends Component {
    constructor(props){
        super(props);
        this.state = {
            link: 'ver',
            class: [' active_link ', '', '', '', '', ''],
            foto_perfil: sessionStorage.getItem("foto_perfil"),
            datos: ['masculino', '20', 'asdf', 'fda'],
        };
        //this.getDataImagen();
    }
    getDataImagen(){
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({ 
                idusuario: sessionStorage.getItem("id")
            })
        };
        fetch(sessionStorage.getItem("url") + "/tagsFotoPerfil", requestOptions).then(response => response.json()).then(data => {
            if (data.error == "false"){
                var msg = data.msg
                console.log(msg)
            } else {
                console.log(data)
            }
        });
    }
    changeScreen(screen, idClassActive){
        let newClass = ['', '', '', '', '', ''];
        newClass[idClassActive] = ' active_link ';
        this.setState({
            link: screen,
            class: newClass
        });
    }
    getBase64 = file => {
        return new Promise(resolve => {
          let fileInfo;
          let baseURL = "";
          // Make new FileReader
          let reader = new FileReader();
    
          // Convert the file to base64 text
          reader.readAsDataURL(file);
    
          // on reader load somthing...
          reader.onload = () => {
            // Make a fileInfo Object
            baseURL = reader.result;
            resolve(baseURL);
          };
        });
      };
    cambiarImagen = e =>{
        let { file } = this.state;
        file = e.target.files[0];
        this.getBase64(file)
            .then(result => {
                result = result.split(",")[1]
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        idusuario: sessionStorage.getItem("id"),
                        username: sessionStorage.getItem("usuario"),
                        contra: document.getElementsByName("logpass1")[0].value,
                        foto: result
                    })
                };
                fetch(sessionStorage.getItem("url") + "/editPhotoUser", requestOptions).then(response => response.json()).then(data => {
                    if (data.error == "false"){
                        sessionStorage.setItem("foto_perfil", data.msg) 
                        this.setState({
                            foto_perfil: sessionStorage.getItem("foto_perfil")
                        });
                        //this.getDataImagen();
                    } else{
                        document.getElementById("edit_error").innerHTML = "Contraseñas o datos incorrectos"
                    }
                    console.log(data)
                });
            })
            .catch(err => {
                console.log(err);
        });
    }
    render (){
        return (
        <>
            <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> 
            <link rel="stylesheet" href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css"/>
            </head>
            <div class="container emp-profile">
                <form method="post">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="profile-img">
                                <img src={this.state.foto_perfil} id="foto_perfil" alt=""/>
                                {this.state.link === 'modifiar' && 
                                    <div class="file btn btn-lg btn-primary">
                                        Cambiar foto
                                        <input onChange={this.cambiarImagen} type="file" name="file"/>
                                    </div>
                                }
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="profile-head">
                                <h5 id="NombreUsuario">
                                    {sessionStorage.getItem("usuario")}
                                </h5>
                                <h6 id="NombreNombre">
                                    {sessionStorage.getItem("nombre")}
                                </h6>
                                <p class="proile-rating">Fotografias subidas - <span id="cant_fotos">{sessionStorage.getItem("fotos")}</span></p>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <a  onClick={() => this.changeScreen('modifiar', 0)} class="btn mt-4">Editar</a>
                            <a  onClick={() => Salir()} class="btn mt-4">Salir</a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="profile-work">
                                <p>Datos</p>
                                Genero: {this.state.datos[0]}<br/>
                                Edad: {this.state.datos[1]}<br/>
                                Info1: {this.state.datos[2]}<br/>
                                Info2: {this.state.datos[3]}<br/>
                                <p>Inicio</p>
                                <a href="#" onClick={() => this.changeScreen('ver', 1)} class={this.state.class[1]}>Ir a inicio</a><br/>
                                <p>Fotos</p>
                                <a href="#" onClick={() => this.changeScreen('subir_fotos', 2)} class={this.state.class[2]}>Subir foto</a><br/>
                                <p>Bot</p>
                                <a href="#" onClick={() => this.changeScreen('bot_flores', 3)} class={this.state.class[3]}>Bot flores</a><br/>
                                <a href="#" onClick={() => this.changeScreen('bot_dentista', 4)} class={this.state.class[4]}>Bot dentista</a><br/>
                                <a href="#" onClick={() => this.changeScreen('bot_reservacion', 5)} class={this.state.class[5]}>Bot reservacion</a><br/>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="tab-content profile-tab" id="myTabContent">
                                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    {this.state.link === 'ver' && <Ver_Album/>}
                                    {this.state.link === 'subir_fotos' && <Subir_fotos/>}
                                    
                                    {this.state.link === 'bot_reservacion' && <Bot_reservacion/>}
                                    {this.state.link === 'bot_flores' && <Bot_flores/>}
                                    {this.state.link === 'bot_dentista' && <Bot_dentista/>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>           
            </div>
        </>
        );
    }
}
export default Inicio