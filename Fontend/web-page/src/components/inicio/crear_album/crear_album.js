import React from 'react';

function Crear_Album() {
  return (
    <>
       <div class="py-4 px-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <h5 class="mb-0">Crear Album</h5>
            </div>
            <div class="row">
                <div class="section text-center">
                    <div class="form-group">
                        <input type="text" name="logname" class="form-style" placeholder="Nombre del album" id="logname" autocomplete="off"/>
                        <i class="input-icon uil uil-images"></i>
                    </div>	
                    <a href="#" class="btn mt-4">Crear album</a>
                </div>
            </div>
        </div>
    </>
  );
}
export default Crear_Album