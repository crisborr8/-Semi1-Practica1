import React, { Component } from 'react';
import './bot.css';

class Bot_dentista extends Component{
    constructor(props){
        super(props);
        this.state = {
            mensaje: "",
            conversacion: [
            ]
        };
    }
    setMensaje(evt){
        this.setState({
            mensaje: evt.target.value
        });
    }
    enviarMensaje(){
        var msj = this.state.conversacion
        msj.push({class:"Tu", msj: this.state.mensaje})
        this.setState({
            conversacion: msj
        })
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                texto: this.state.mensaje
            })
        };
        fetch(sessionStorage.getItem("url") + "/botDentista", requestOptions).then(response => response.json()).then(data => {
            console.log(data)
            if (data.error == "false"){
                msj.push({class:"Bot", msj: data.msg})
                this.setState({
                    conversacion: msj
                })
            }
            document.getElementById("msj").value="";
        });
    }
    render(){
        return (
            <>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">Bot - Dentista</h5>                                
                        <p id="subir_error" class="mb-0 mt-4 text-center"></p>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 	
                                <div class="chat-bot">
                                    <div class="tab-content profile-tab" id="myTabContent">
                                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                            
                                        {this.state.conversacion.map(mensaje => (
                                            
                                            <div class={mensaje.class}>
                                                <p>{mensaje.class}</p>
                                                {mensaje.msj}
                                            </div>
                                        ))}
                                        <div id="new_msj"></div>
                                        </div>
                                    </div>
                                </div>
                                <p/>
                                <div class="form-group">
                                    <input value={this.state.mensaje} onChange={evt => this.setMensaje(evt)} type="text" name="msj" class="form-style" placeholder="Mensaje" id="msj" autocomplete="off"/>
                                    <i class="input-icon uil uil-align-center"></i>
                                </div>
                                <p/>
                                <div class="section  col-md-4">
                                    <a  class="btn mt-4" onClick={() => this.enviarMensaje()} href="#new_msj">Enviar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Bot_dentista