import React from 'react';

import './inicio.css';

function Inicio() {
  return (
    <>
        <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script> 
        </head>
        <div class="container emp-profile">
            <form method="post">
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-img">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog" alt=""/>
                            <div class="file btn btn-lg btn-primary">
                                Cambiar foto
                                <input type="file" name="file"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="profile-head">
                                    <h5>
                                        Nombre Usuario
                                    </h5>
                                    <h6>
                                        Nombre completo del usuario
                                    </h6>
                                    <p class="proile-rating">Albums creados - <span>13</span></p>
                                    <p class="proile-rating">Fotografias subidas - <span>810</span></p>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <input type="submit" class="btn text-muted" name="btnAddMore" value="Editar"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-work">
                            <p>Albums</p>
                            <a href="">Crear album</a><br/>
                            <a href="">Eliminar album</a><br/>
                            <p>Fotos</p>
                            <a href="">Ver todas las fotos</a><br/>
                            <a href="">Subir foto en album</a><br/>
                        </div>
                    </div>
                    <div class="col-md-8">
                        <div class="tab-content profile-tab" id="myTabContent">
                            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                               <div class="py-4 px-4">
                                    <div class="d-flex align-items-center justify-content-between mb-3">
                                        <h5 class="mb-0">Ultimas fotografias subidas</h5><a href="#" class="btn text-muted">Mostrar todo</a>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-4 mb-4 pr-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-3.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-4.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-5.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-6.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pr-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-3.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-4.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-5.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-6.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pr-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-3.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-4.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-5.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                        <div class="col-lg-4 mb-4 pl-lg-1"><img src="https://bootstrapious.com/i/snippets/sn-profile/img-6.jpg" alt="" class="img-fluid rounded shadow-sm"/></div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Experience</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Hourly Rate</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>10$/hr</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Total Projects</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>230</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>English Level</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>Expert</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Availability</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>6 months</p>
                                            </div>
                                        </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <label>Your Bio</label><br/>
                                        <p>Your detail description</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>           
        </div>
    </>
  );
}
export default Inicio