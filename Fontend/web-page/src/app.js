import React from "react";

import Login from "./components/login/login.js";
import Inicio from "./components/inicio/inicio.js";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';;


function App() {
  return (
    <Router>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/home' component={Inicio} />
        </Switch>
    </Router>
  );
}

export default App;