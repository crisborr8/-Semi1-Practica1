import React, { Component } from 'react';

class Crear_Album extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
        };
    }
    setName(evt){
        this.setState({
            name: evt.target.value
        });
    }
    crearAlbum(){
        if (this.state.name.length > 0){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idusuario: sessionStorage.getItem("id"),
                    album: this.state.name,
                })
            };
            fetch(sessionStorage.getItem("url") + "/newAlbum", requestOptions).then(response => response.json()).then(data => {
                console.log(data)
                if (data.error == "false"){
                    document.getElementById("crear_error").innerHTML = "Album creado"
                    this.setState({
                        name: ''
                    });
                } else{
                    document.getElementById("crear_error").innerHTML = "Error al crear album"
                }
            });
        }
    }
    render(){
        return (
            <>
            <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">Crear Album</h5>                              
                        <p id="crear_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="form-group">
                                <input value={this.state.name} onChange={evt => this.setName(evt)} type="text" name="logname" class="form-style" placeholder="Nombre del album" id="logname" autocomplete="off"/>
                                <i class="input-icon uil uil-images"></i>
                            </div>	
                            <a href="#" class="btn mt-4" onClick={() => this.crearAlbum()}>Crear album</a>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default Crear_Album