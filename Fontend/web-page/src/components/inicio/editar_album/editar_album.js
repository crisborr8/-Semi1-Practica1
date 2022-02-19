import React, { Component } from 'react';

function getAlbums(){
    var albumes = []
    for(var i = 0; i < 15; i++){
        albumes.push({'id':i, 'nombre': 'Drop ' + (i + 1)});
    }
    return albumes;
}

class Editar_Album extends Component{
    constructor(props){
        super(props);
        this.state = {
            albums: getAlbums(),
            idAlbum: -1,
            nombreAlbum: 'Seleccione un album',
        };
    }
    setAlbum(idAlbum, nombreAlbum){
        this.setState({idAlbum: idAlbum, nombreAlbum: nombreAlbum});
    }
    getAlbumName(){
        if (this.state.idAlbum === -1) return "";
        return this.state.nombreAlbum;
    }
    render(){
        return (
            <>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">{this.state.nombreAlbum}</h5>
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
                                    <p/>
                                    <input type="text" name="logname" class="form-style" placeholder="Nombre completo" id="logname" autocomplete="off" value={this.getAlbumName()}/>
                                    <i class="input-icon uil uil-users-alt"></i>
                                </div>	
                                <div class="section  col-md-4">
                                    <a  class="btn mt-4">Cambiar nombre</a>
                                    <p/>
                                    <a  class="btn mt-4">Eliminar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Editar_Album