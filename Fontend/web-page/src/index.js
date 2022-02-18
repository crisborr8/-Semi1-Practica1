import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './index.css';

import Login from "./components/login/login.js";
import Inicio from "./components/inicio/inicio.js";


ReactDOM.render(
  <>
    <Inicio/>
  </>,
  document.getElementById('root')
);
