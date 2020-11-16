import React, {Component} from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Status from './components/Status'
import { Account } from './components/Accounts';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ListController from './components/LightsController';
import DoorController from './components/DoorController';

function Auth() {
  return (
    <Account>
      <Status />
      <Login />
    </Account>
  );
};
  
class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Smart Home Manager</Navbar.Brand>
                <Nav>
                    <Nav.Link href={"/devicecontroller/TG001"}>Lights</Nav.Link>
                    <Nav.Link href={"/Doors/TG001"}>Doors</Nav.Link>
                </Nav>
            </Navbar>
            <Switch>
              <Route path="/" component={Auth} exact />
              <Route path="/lights/:username" component={ListController} exact/>
              <Route path="/doors/:username" component={DoorController} exact/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;
//export default Auth;
