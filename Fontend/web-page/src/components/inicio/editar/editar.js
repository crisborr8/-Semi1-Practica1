import React from 'react';

function Editar() {
  return (
    <>
       <div class="py-4 px-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <h5 class="mb-0">Editar datos</h5>
            </div>
            <div class="row">
                <div class="section text-center">
                    <div class="form-group">
                        <input type="text" name="logname" class="form-style" placeholder="Nombre completo" id="logname" autocomplete="off"/>
                        <i class="input-icon uil uil-users-alt"></i>
                    </div>	
                    <div class="form-group mt-2">
                        <input type="text" name="username" class="form-style" placeholder="Nombre de usuario" id="username" autocomplete="off"/>
                        <i class="input-icon uil uil-user"></i>
                    </div>	
                    <div class="form-group mt-2">
                        <input type="password" name="logpass1" class="form-style" placeholder="Contraseña" id="logpass1" autocomplete="off"/>
                        <i class="input-icon uil uil-lock-alt"></i>
                    </div>
                    <a href="#" class="btn mt-4">Editar</a>
                </div>
            </div>
        </div>
    </>
  );
}
export default Editar