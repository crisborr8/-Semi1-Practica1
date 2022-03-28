import React, { Component } from 'react';

class Editar extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: sessionStorage.getItem("nombre"),
            psw: '',
            user: sessionStorage.getItem("usuario"),
        };
    }
    setName(evt){
        this.setState({
            name: evt.target.value
        });
    }
    setPsw(evt){
        this.setState({
            psw: evt.target.value
        });
    }
    setUser(evt){
        this.setState({
            user: evt.target.value
        });
    }
    editar(){
        if (this.state.reg_psw1 == this.state.reg_psw2){
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    idusuario: sessionStorage.getItem("id"),
                    username: this.state.user,
                    name: this.state.name,
                    contra: this.state.psw,
                })
            };
            fetch(sessionStorage.getItem("url") + "/editUser", requestOptions).then(response => response.json()).then(data => {
                console.log(data)
                if (data.error == "false"){
                    sessionStorage.setItem("usuario", this.state.user);
                    document.getElementById("NombreUsuario").innerHTML = this.state.user
                    sessionStorage.setItem("nombre", this.state.name);
                    document.getElementById("NombreNombre").innerHTML = this.state.name
                    document.getElementById("edit_error").innerHTML = "Datos actualizados"
                } else{
                    document.getElementById("edit_error").innerHTML = "Contraseñas o datos incorrectos"
                }
            });
        } else {
            document.getElementById("edit_error").innerHTML = "Contraseñas no cohinciden"
        }
    }
    render(){
        return (
        <>
            <div class="py-4 px-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h5 class="mb-0">Editar datos</h5>                                                      
                    <p id="edit_error" class="mb-0 mt-4 text-center"></p>
                </div>
                <div class="row">
                    <div class="section text-center">
                        <div class="form-group">
                            <input value={this.state.name} onChange={evt => this.setName(evt)} type="text" name="logname" class="form-style" placeholder="Nombre completo" id="logname" autocomplete="off"/>
                            <i class="input-icon uil uil-users-alt"></i>
                        </div>	
                        <div class="form-group mt-2">
                            <input value={this.state.user} onChange={evt => this.setUser(evt)} type="text" name="username" class="form-style" placeholder="Nombre de usuario" id="username" autocomplete="off"/>
                            <i class="input-icon uil uil-user"></i>
                        </div>	
                        <div class="form-group mt-2">
                            <input value={this.state.psw} onChange={evt => this.setPsw(evt)} type="password" name="logpass1" class="form-style" placeholder="Contraseña" id="logpass1" autocomplete="off"/>
                            <i class="input-icon uil uil-lock-alt"></i>
                        </div>
                        <a href="#" class="btn mt-4" onClick={() => this.editar()}>Editar</a>
                    </div>
                </div>
            </div>
        </>
        );
    }
}
export default Editar