import React, { Component } from 'react';

class Ver_fotos extends Component{
    constructor(props){
        super(props);
        this.state = {
            foto: "https://static.eldiario.es/clip/71d118ff-5ef2-449c-be8a-6c321304fa70_16-9-aspect-ratio_default_0.jpg",
            nombre: "nombre",
            descripcion: "descripcion",
            idiomas: ["Japanese", "English", "Russian"],
            descripcion_traducida: ""
        };
    }
    traducir(idioma){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cadena: this.state.descripcion,
                idioma: idioma
            })
        };
        fetch(sessionStorage.getItem("url") + "/traducirTexto", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                this.setState({descripcion_traducida: data.msg});
            }
        });
    }
    render(){
        return (
            <>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">Ver foto</h5>                                
                        <p id="subir_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 	
                                <div>
                                    <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                                    <label class="for-dropdown" for="dropdown">Idiomas<i class="uil uil-arrow-down"></i></label>
                                    <div class="section-dropdown"> 
                                        {this.state.idiomas.map(idioma => (
                                            <a href="#" onClick={() => this.traducir(idioma)}>{idioma}<i class="uil uil-arrow-right"></i></a>
                                        ))}
                                    </div>
                                    <p/>
                                </div>
                                <div class="profile-img">
                                    <img src={this.state.foto} id="foto_ver" alt=""/>
                                </div>
                                <p>Nombre</p>
                                {this.state.nombre}
                                <p>Descripcion</p>
                                {this.state.descripcion}
                                <p>Descripcion traducida</p>
                                {this.state.descripcion_traducida}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Ver_fotos