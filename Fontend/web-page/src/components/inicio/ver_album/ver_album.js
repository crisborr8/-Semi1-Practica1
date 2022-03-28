import React, { Component } from 'react';

class Ver_Album extends Component{
    constructor(props){
        super(props);
        this.state = {
            list: [],
            list_perfil: [],
            albums: [],
            nombreAlbum: 'Seleccione un album',
        };
    }
    setFotos_Album(nombreAlbum){
        this.setState({list : []})
        var new_list = [];
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idusuario: sessionStorage.getItem("id"),
                tag: nombreAlbum
            })
        };
        fetch(sessionStorage.getItem("url") + "/fotoTag", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                data.msg.forEach(function(foto){
                    new_list.push({url: foto.valor, nombre: foto.nombre, descripcion: foto.descripcion});
                })
                console.log(new_list)
                this.setState({list: new_list, nombreAlbum: nombreAlbum});
            }
        });
    }
    load_fotosPerfil(){
        this.setState({list_perfil : []})
        var new_list = [];
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idusuario: sessionStorage.getItem("id")
            })
        };
        fetch(sessionStorage.getItem("url") + "/photoPerfil", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                data.msg.forEach(function(foto){
                    new_list.push({url: foto.valor});
                })
                console.log(data.msg)
                console.log("*********")
                console.log(new_list)
                console.log("*********")
                this.setState({list_perfil: new_list});
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
        fetch(sessionStorage.getItem("url") + "/verTags", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                data.msg.forEach(function(tag){
                    console.log(tag)
                    albumes.push({'nombre': tag});
                })
                this.setState({albums: albumes})
            }else{
                document.getElementById("ver_error").innerHTML = "Error al cargar albumes"
            }
        });
        this.load_fotosPerfil();
    }
    render(){
        return (
            <>
                <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">Fotos de perfil</h5>                              
                        <p id="ver_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 	
                                <div class="row">
                                    {this.state.list_perfil.map(foto => (
                                        <div class="col-lg-4 mb-4 pr-lg-1 img__wrap ">
                                            <img src={foto.url} alt="" class="img__img img-fluid rounded shadow-sm"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">{this.state.nombreAlbum}</h5>                              
                        <p id="ver_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 	
                                <input class="dropdown" type="checkbox" id="dropdown" name="dropdown"/>
                                <label class="for-dropdown" for="dropdown">Albums<i class="uil uil-arrow-down"></i></label>
                                <div class="section-dropdown"> 
                                    {this.state.albums.map(album => (
                                        <a href="#" onClick={() => this.setFotos_Album(album.nombre)}>{album.nombre}<i class="uil uil-arrow-right"></i></a>
                                    ))}
                                </div>
                                <p/>
                                <div class="row">
                                    {this.state.list.map(foto => (
                                        <div class="col-lg-4 mb-4 pr-lg-1 img__wrap ">
                                            <img src={foto.url} alt="" class="img__img img-fluid rounded shadow-sm"/>
                                            <p class="img__description ">{foto.nombre}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Ver_Album