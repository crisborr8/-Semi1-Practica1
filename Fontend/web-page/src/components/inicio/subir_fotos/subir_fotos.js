import React, { Component } from 'react';

import FileUploadComponent from '../../fileUpload/upload.js';

class Subir_fotos extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            descripcion: '',
            params:
                {
                  cantidad: 1,
                  width: '100%',
                  height: '100%',
                  reg_files: []
                }
        };
    }
    setName(evt){
        this.setState({
            name: evt.target.value
        });
    }
    setDescrip(evt){
        this.setState({
            descripcion: evt.target.value
        });
    }
    subirFoto(){
        if (this.state.name.length > 0){
            if (this.state.descripcion.length > 0){
                if (this.state.reg_files != []){
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            idusuario: sessionStorage.getItem("id"),
                            nombre: this.state.name,
                            descripcion: this.state.descripcion,
                            foto: this.state.params.reg_files[0].base64
                        })
                    };
                    fetch(sessionStorage.getItem("url") + "/newPhoto", requestOptions).then(response => response.json()).then(data => {
                        if (data.error == 'false'){
                            document.getElementById("subir_error").innerHTML = "Foto subida con éxito"
                            sessionStorage.setItem("fotos", (parseInt(sessionStorage.getItem("fotos")) + 1) + "");
                            document.getElementById("cant_fotos").innerHTML = sessionStorage.getItem("fotos")
                            this.state.params.reg_files = []
                        }else{
                            document.getElementById("subir_error").innerHTML = "Error al subir foto"
                        }
                    });
                }else{
                    document.getElementById("subir_error").innerHTML = "Error, ingrese una foto (si acaba de subir una foto de click en la X)"
                }
            }else{
                document.getElementById("subir_error").innerHTML = "Error, ingrese una descripcion"
            }
        }else{
            document.getElementById("subir_error").innerHTML = "Error, ingrese un nombre"
        }
    }
    render(){
        return (
            <>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">Subir foto</h5>                                
                        <p id="subir_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 	
                                <p/>
                                <div class="form-group">
                                    <input value={this.state.name} onChange={evt => this.setName(evt)} type="text" name="logname" class="form-style" placeholder="Nombre de la foto" id="logname" autocomplete="off"/>
                                    <i class="input-icon uil uil-images"></i>
                                </div>
                                <p/>
                                <div class="form-group">
                                    <input value={this.state.descripcion} onChange={evt => this.setDescrip(evt)} type="text" name="descr" class="form-style" placeholder="Descripcion de la foto" id="descr" autocomplete="off"/>
                                    <i class="input-icon uil uil-align-center"></i>
                                </div>	
                                <p/>
                                    <div class="form-group mt-2">
                                        <FileUploadComponent params={this.state.params}/>
                                    </div>
                                <p/>
                                <div class="section  col-md-4">
                                    <a  class="btn mt-4" onClick={() => this.subirFoto()}>Subir</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Subir_fotos