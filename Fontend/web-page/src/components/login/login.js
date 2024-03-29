import React, { Component, useState } from 'react';

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
                height: '100%'
            },
            isLoogedIn: false,
        };
    }
    ingresar(){
        sessionStorage.setItem("userToken", '');
        this.setState({isLoogedIn: true})
    }
    render(){
        if (this.state.isLoogedIn) return <Inicio/>
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
                                                          <input type="email" name="logemail" class="form-style" placeholder="Usuario" id="logemail" autocomplete="off"/>
                                                          <i class="input-icon uil uil-user"></i>
                                                      </div>	
                                                      <div class="form-group mt-2">
                                                          <input type="password" name="logpass" class="form-style" placeholder="Contraseña" id="logpass" autocomplete="off"/>
                                                          <i class="input-icon uil uil-lock-alt"></i>
                                                      </div>
                                                      <a href="#" class="btn mt-4" onClick={() => this.ingresar()}>Ingresar</a>
                                                      <p class="mb-0 mt-4 text-center"><a href="#0" class="link">¿Olvidaste tu contraseña?</a></p>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="card-back">
                                              <div class="center-wrap">
                                                  <div class="section text-center">
                                                      <h4 class="mb-4 pb-3">Registro</h4>
                                                      <div class="form-group">
                                                          <input type="text" name="logname" class="form-style" placeholder="Nombre completo" id="logname" autocomplete="off"/>
                                                          <i class="input-icon uil uil-users-alt"></i>
                                                      </div>	
                                                      <div class="form-group mt-2">
                                                          <input type="text" name="username" class="form-style" placeholder="Nombre de usuario" id="username" autocomplete="off"/>
                                                          <i class="input-icon uil uil-user"></i>
                                                      </div>	
                                                      <div class="form-group mt-2">
                                                          <input type="password" name="logpass1" class="form-style" placeholder="Contraseña" id="logpass1" autocomplete="off"/>
                                                          <i class="input-icon uil uil-lock-alt"></i>
                                                      </div>
                                                      <div class="form-group mt-2">
                                                          <input type="password" name="logpass2" class="form-style" placeholder="Confirme su contraseña" id="logpass2" autocomplete="off"/>
                                                          <i class="input-icon uil uil-lock-alt"></i>
                                                      </div>
                                                      <div class="form-group mt-2">
                                                          <FileUploadComponent params={this.state.params}/>
                                                      </div>
                                                      <a href="#" class="btn mt-4">Registrarme</a>
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