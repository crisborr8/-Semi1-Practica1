import React, { Component } from 'react';

function getAlbums(){
    var albumes = []
    for(var i = 0; i < 15; i++){
        albumes.push({'id':i, 'nombre': 'Drop ' + (i + 1)});
    }
    return albumes;
}

class Ver_Album extends Component{
    constructor(props){
        super(props);
        this.state = {
            list: [],
            albums: [],
            nombreAlbum: 'Seleccione un album',
        };
    }
    setFotos_Album(idAlbum, nombreAlbum){
        this.setState({list : []})
        var new_list = [];


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                idalbum: idAlbum
            })
        };
        fetch(sessionStorage.getItem("url") + "/userPhotos", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                data.msg.forEach(function(foto){
                    console.log(foto.nombre)
                    new_list.push(foto.valor);
                })
                this.setState({list: new_list, nombreAlbum: nombreAlbum});
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
            }
        });
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
                                <label class="for-dropdown" for="dropdown">Albums<i class="uil uil-arrow-down"></i></label>
                                <div class="section-dropdown"> 
                                    {this.state.albums.map(album => (
                                        <a href="#" onClick={() => this.setFotos_Album(album.id, album.nombre)}>{album.nombre}<i class="uil uil-arrow-right"></i></a>
                                    ))}
                                </div>
                                <p/>
                                <div class="row">
                                    {this.state.list.map(url => (
                                        <div class="col-lg-4 mb-4 pr-lg-1"><img src={url} alt="" class="img-fluid rounded shadow-sm"/></div>
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