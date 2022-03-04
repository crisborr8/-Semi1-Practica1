import React, { Component } from 'react';

class Editar_Album extends Component{
    constructor(props){
        super(props);
        this.state = {
            albums: [],
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

    setName(evt){
        this.setState({
            nombreAlbum: evt.target.value
        });
    }
    cambiarNombre(){
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idusuario: sessionStorage.getItem("id"),
                idalbum: this.state.idAlbum,
                nombre: this.state.nombreAlbum
            })
        };
        fetch(sessionStorage.getItem("url") + "/editAlbum", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                this.setAlbumes()
                document.getElementById("album_error").innerHTML = "Album actualizado"
            } else{
                document.getElementById("album_error").innerHTML = "Error al actualizar album"
            }
        });
    }
    eliminarNombre(){
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idalbum: this.state.idAlbum,
            })
        };
        fetch(sessionStorage.getItem("url") + "/deleteAlbum", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                this.setAlbumes()
                document.getElementById("album_error").innerHTML = "Album eliminado"
                this.setState({idAlbum: -1, nombreAlbum: 'Seleccione un album'});
            } else{
                document.getElementById("album_error").innerHTML = "Error al eliminar album"
            }
        });
    }
    setAlbumes(){
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
                document.getElementById("album_error").innerHTML = "Error al cargar albumes"
            }
        });
    }
    componentDidMount(){
        this.setAlbumes()
    }
    render(){
        const album_array = this.state.albums.map(album => (
            <a href="#" onClick={() => this.setAlbum(album.id, album.nombre)}>{album.nombre}<i class="uil uil-arrow-right"></i></a>
        ))
        return (
            <>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">{this.state.nombreAlbum}</h5>                               
                        <p id="album_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 	
                                <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                                <label class="for-dropdown" for="dropdown">Ablums<i class="uil uil-arrow-down"></i></label>
                                <div class="section-dropdown"> 
                                    {album_array}
                                </div>
                                <p/>
                                <div class="form-group">
                                    <p/>
                                    <input value={this.state.name} onChange={evt => this.setName(evt)} type="text" name="logname" class="form-style" placeholder="Nombre completo" id="logname" autocomplete="off" value={this.getAlbumName()}/>
                                    <i class="input-icon uil uil-users-alt"></i>
                                </div>	
                                <div class="section  col-md-4">
                                    <a  class="btn mt-4" onClick={() => this.cambiarNombre()}>Cambiar nombre</a>
                                    <p/>
                                    <a  class="btn mt-4" onClick={() => this.eliminarNombre()}>Eliminar</a>
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