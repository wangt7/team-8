
import React, {Component} from 'react';
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
