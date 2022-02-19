import React, { Component } from 'react';

class Ver_fotos extends Component{
    constructor(props){
        super(props);
        this.state = {
            fotos: this.setFotos_Album(),
        };
    }
    setFotos_Album(){
        var new_fotos= [];
        var k = 3;
        var url = "https://bootstrapious.com/i/snippets/sn-profile/img-";
        for(var i = 0; i < 20; i++){
            new_fotos.push(url + k + ".jpg");
            if (k == 6) k = 3;
            else k++;
        }
        return new_fotos;
    }
    render(){
        return (
            <>
               <div class="py-4 px-4">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="mb-0">Todas las fotos</h5>
                    </div>
                    <div class="row">
                        <div class="section text-center">
                            <div class="sec-center"> 
                                <div class="row">
                                    {this.state.fotos.map(url => (
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

export default Ver_fotos