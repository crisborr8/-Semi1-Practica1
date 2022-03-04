import React, { Component } from 'react';

import Inicio from "../inicio/inicio.js";
import FileUploadComponent from '../fileUpload/upload.js';
import './login.css';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            params: {
                cantidad: 1,
                width: '90%',
                height: '100%',
                reg_files: []
            },
            isLoogedIn: false,
            login_user: '',
            login_psw: '',
            reg_user: '',
            reg_name: '',
            reg_psw1: '',
            reg_psw2: '',
            reg_files: [],
        };
        sessionStorage.setItem('url', "http://3.144.234.132:3000")
        //sessionStorage.setItem('url', "http://52.90.221.15:3000")
    }
    login_setUser(evt){
        this.setState({
            login_user: evt.target.value
        });
    }
    login_setPsw(evt){
        this.setState({
            login_psw: evt.target.value
        });
    }
    reg_setUser(evt){
        this.setState({
            reg_user: evt.target.value
        });
    }
    reg_setName(evt){
        this.setState({
            reg_name: evt.target.value
        });
    }
    reg_setPsw1(evt){
        this.setState({
            reg_psw1: evt.target.value
        });
    }
    reg_setPsw2(evt){
        this.setState({
            reg_psw2: evt.target.value
        });
    }
    ingresar(){
        //const url = 'https://reqres.in/api/posts';
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({ 
                username: this.state.login_user,
                contra: this.state.login_psw
            })
        };
        fetch(sessionStorage.getItem("url") + "/login", requestOptions).then(response => response.json()).then(data => {
            if (data.error == "false"){
                var msg = data.msg
                console.log(msg)
                sessionStorage.setItem("albums", msg.albums);
                sessionStorage.setItem("fotos", msg.fotos);
                sessionStorage.setItem("id", msg.idusuario);
                sessionStorage.setItem("nombre", msg.name);
                sessionStorage.setItem("usuario", msg.username);
                sessionStorage.setItem("foto_perfil", msg.valor);
            } else {
                document.getElementById("login_error").innerHTML = "Error, usuario o contraseña incorrectos"
            }
        });
    }
    registro(){
        if (this.state.reg_user == '' || this.state.reg_name == '' || this.state.reg_psw1 == '' || this.state.params.reg_files == []){
            document.getElementById("regist_error").innerHTML = "Faltan campos por llenar"
        } else{
            if (this.state.reg_psw1 == this.state.reg_psw2){
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        username: this.state.reg_user,
                        name: this.state.reg_name,
                        contra: this.state.reg_psw1,
                        foto: this.state.params.reg_files[0].base64
                    })
                };
                fetch(sessionStorage.getItem("url") + "/newUser", requestOptions).then(response => response.json()).then(data => {
                    if (data.error == "false"){
                        document.getElementById("regist_error").innerHTML = "Usuario creado"
                        this.state.reg_user = '';
                        this.state.reg_name = '';
                        this.state.reg_psw1 = this.state.reg_psw2 = ''
                        this.state.params.reg_files = []

                        document.getElementById('logname').value = ''
                        document.getElementById('username').value = ''
                        document.getElementById('logpass1').value = ''
                        document.getElementById('logpass2').value = ''
                    }
                    else{
                        document.getElementById("regist_error").innerHTML = "Error inesperado al crear usuario"
                    }
                });
            } else {
                document.getElementById("regist_error").innerHTML = "Contraseñas no cohinciden"
            }
        }
    }
    render(){
        if (sessionStorage.getItem("id") != '') return <Inicio/>
        return (
          <>
              <head>
              <link rel="stylesheet" href="https://unicons.iconscout.com/release/v2.1.9/css/unicons.css"/>
              </head>
              <div class="section">
                  <div class="container">
                      <div class="row full-height justify-content-center">
                          <div class="col-12 text-center align-self-center py-5">
                              <div class="section pb-5 pt-5 pt-sm-2 text-center">
                                  <h6 class="mb-0 pb-3"><span>Log In </span><span>Registro</span></h6>
                                  <input class="checkbox" type="checkbox" id="reg-log" name="reg-log"/>
                                  <label for="reg-log"></label>
                                  <div class="card-3d-wrap mx-auto">
                                      <div class="card-3d-wrapper">
                                          <div class="card-front">
                                              <div class="center-wrap">
                                                  <div class="section text-center">
                                                      <h4 class="mb-4 pb-3">Log In</h4>
                                                      <div class="form-group">
                                                          <input value={this.state.login_user} onChange={evt => this.login_setUser(evt)} type="email" name="logemail" class="form-style" placeholder="Usuario" id="logemail" autocomplete="off"/>
                                                          <i class="input-icon uil uil-user"></i>
                                                      </div>	
                                                      <div class="form-group mt-2">
                                                          <input value={this.state.login_psw} onChange={evt => this.login_setPsw(evt)} type="password" name="logpass" class="form-style" placeholder="Contraseña" id="logpass" autocomplete="off"/>
                                                          <i class="input-icon uil uil-lock-alt"></i>
                                                      </div>
                                                      <a href="#" class="btn mt-4" onClick={() => this.ingresar()}>Ingresar</a>
                                                      <p id="login_error" class="mb-0 mt-4 text-center"></p>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="card-back">
                                              <div class="center-wrap">
                                                  <div class="section text-center">
                                                      <h4 class="mb-4 pb-3">Registro</h4>
                                                      <div class="form-group">
                                                          <input value={this.state.reg_user} onChange={evt => this.reg_setUser(evt)} type="text" name="logname" class="form-style" placeholder="Nombre completo" id="logname" autocomplete="off"/>
                                                          <i class="input-icon uil uil-users-alt"></i>
                                                      </div>	
                                                      <div class="form-group mt-2">
                                                          <input value={this.state.reg_name} onChange={evt => this.reg_setName(evt)} type="text" name="username" class="form-style" placeholder="Nombre de usuario" id="username" autocomplete="off"/>
                                                          <i class="input-icon uil uil-user"></i>
                                                      </div>	
                                                      <div class="form-group mt-2">
                                                          <input value={this.state.reg_psw1} onChange={evt => this.reg_setPsw1(evt)} type="password" name="logpass1" class="form-style" placeholder="Contraseña" id="logpass1" autocomplete="off"/>
                                                          <i class="input-icon uil uil-lock-alt"></i>
                                                      </div>
                                                      <div class="form-group mt-2">
                                                          <input value={this.state.reg_psw2} onChange={evt => this.reg_setPsw2(evt)} type="password" name="logpass2" class="form-style" placeholder="Confirme su contraseña" id="logpass2" autocomplete="off"/>
                                                          <i class="input-icon uil uil-lock-alt"></i>
                                                      </div>
                                                      <div class="form-group mt-2">
                                                          <FileUploadComponent params={this.state.params}/>
                                                      </div>
                                                      <a href="#" onClick={() => this.registro()} class="btn mt-4">Registrarme</a>
                                                      <p id="regist_error" class="mb-0 mt-4 text-center"></p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </>
        );
    }
}
export default Login