import React, { Component } from 'react';

import FileUploadComponent from '../../fileUpload/upload.js';

function getAlbums(){
    var albumes = []
    for(var i = 0; i < 15; i++){
        albumes.push({'id':i, 'nombre': 'Drop ' + (i + 1)});
    }
    return albumes;
}

class Subir_fotos extends Component{
    constructor(props){
        super(props);
        this.state = {
            albums: getAlbums(),
            idAlbum: -1,
            nombreAlbum: 'Seleccione un album',
            params:
                {
                  cantidad: 10,
                  width: '100%',
                  height: '100%'
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
                                <div class="section  col-md-4">
                                    <a  class="btn mt-4">Subir</a>
                                </div>
                                <div class="form-group mt-2">
                                    <FileUploadComponent params={this.state.params}/>
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