import React, { Component } from 'react';

import FileUploadComponent from '../../fileUpload/upload.js';

class Subir_fotos extends Component{
    constructor(props){
        super(props);
        this.state = {
            albums: [],
            name: '',
            idAlbum: -1,
            nombreAlbum: 'Seleccione un album',
            params:
                {
                  cantidad: 1,
                  width: '100%',
                  height: '100%',
                  reg_files: []
                }
        };
    }
    setAlbum(idAlbum, nombreAlbum){
        this.setState({idAlbum: idAlbum, nombreAlbum: nombreAlbum});
    }
    getAlbumName(){
        if (this.state.idAlbum === -1) return "";
        return this.state.nombreAlbum;
    }
    setName(evt){
        this.setState({
            name: evt.target.value
        });
    }
    subirFoto(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idalbum: this.state.idAlbum,
                nombre: this.state.name,
                foto: this.state.params.reg_files[0].base64
            })
        };
        fetch(sessionStorage.getItem("url") + "/newPhoto", requestOptions).then(response => response.json()).then(data => {
            if (data.error == 'false'){
                document.getElementById("subir_error").innerHTML = "Foto subida con éxito"
                this.setState({idAlbum: -1, nombreAlbum: 'Seleccione un album', name: ''});
            }else{
                document.getElementById("subir_error").innerHTML = "Error al subir foto"
            }
        });
    }
    componentDidMount(){
        var albumes = []
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idusuario: sessionStorage.getItem("id")
            })
        };
        fetch(sessionStorage.getItem("url") + "/userAlbum", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                data.msg.forEach(function(album){
                    console.log(album.nombre)
                    albumes.push({'id':album.idalbum, 'nombre': album.nombre});
                })
                this.setState({albums: albumes})
            } else{
                document.getElementById("subir_error").innerHTML = "Error al cargar albumes"
            }
        });
    }
    render(){
        return (
            <>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">{this.state.nombreAlbum}</h5>                                
                        <p id="subir_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 	
                                <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                                <label class="for-dropdown" for="dropdown">Ablums<i class="uil uil-arrow-down"></i></label>
                                <div class="section-dropdown"> 
                                    {this.state.albums.map(album => (
                                        <a href="#" onClick={() => this.setAlbum(album.id, album.nombre)}>{album.nombre}<i class="uil uil-arrow-right"></i></a>
                                    ))}
                                </div>
                                <p/>
                                <div class="form-group">
                                    <input value={this.state.name} onChange={evt => this.setName(evt)} type="text" name="logname" class="form-style" placeholder="Nombre de la foto" id="logname" autocomplete="off"/>
                                    <i class="input-icon uil uil-images"></i>
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