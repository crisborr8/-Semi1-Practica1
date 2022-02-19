import React, { Component } from 'react';

import './inicio.css';
import './dropdown.css';

import Ver_fotos from "./ver_fotos/ver_fotos.js";
import Subir_fotos from "./subir_fotos/subir_fotos.js";

import Editar_Album from "./editar_album/editar_album.js";
import Crear_Album from "./crear_album/crear_album.js";
import Ver_Album from "./ver_album/ver_album.js";
import Editar from "./editar/editar.js";

import Login from "../login/login.js";

function Salir(){
    sessionStorage.setItem("userToken", '');
    this.setState({isLoogedIn: false})
}

class Inicio extends Component {
    constructor(props){
        super(props);
        this.state = {
            link: 'ver',
            class: [' active_link ', '', '', '', '', ''],
            isLoogedIn: true
        };
    }
    changeScreen(screen, idClassActive){
        let newClass = ['', '', '', '', '', ''];
        newClass[idClassActive] = ' active_link ';
        this.setState({
            link: screen,
            class: newClass
        });
    }
    render (){
        if (!this.state.isLoogedIn) return <Login/>
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
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog" alt=""/>
                                <div class="file btn btn-lg btn-primary">
                                    Cambiar foto
                                    <input type="file" name="file"/>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="profile-head">
                                <h5>
                                    Nombre Usuario
                                </h5>
                                <h6>
                                    Nombre completo del usuario
                                </h6>
                                <p class="proile-rating">Albums creados - <span>13</span></p>
                                <p class="proile-rating">Fotografias subidas - <span>810</span></p>
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
                                <p>Inicio</p>
                                <a href="#" onClick={() => this.changeScreen('ver', 1)} class={this.state.class[1]}>Ir a inicio</a><br/>
                                <p>Albums</p>
                                <a href="#" onClick={() => this.changeScreen('crear_album', 2)} class={this.state.class[2]}>Crear album</a><br/>
                                <a href="#" onClick={() => this.changeScreen('editar_album', 3)} class={this.state.class[3]}>Editar album</a><br/>
                                <p>Fotos</p>
                                <a href="#" onClick={() => this.changeScreen('ver_fotos', 4)} class={this.state.class[4]}>Ver todas las fotos</a><br/>
                                <a href="#" onClick={() => this.changeScreen('subir_fotos', 5)} class={this.state.class[5]}>Subir foto en album</a><br/>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="tab-content profile-tab" id="myTabContent">
                                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    {this.state.link === 'ver' && <Ver_Album/>}
                                    {this.state.link === 'modifiar' && <Editar/>}
                                    {this.state.link === 'crear_album' && <Crear_Album/>}
                                    {this.state.link === 'editar_album' && <Editar_Album/>}
                                    {this.state.link === 'ver_fotos' && <Ver_fotos/>}
                                    {this.state.link === 'subir_fotos' && <Subir_fotos/>}
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