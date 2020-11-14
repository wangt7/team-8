
import React, {Component} from 'react';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Status from './components/Status'
import { Account } from './components/Accounts';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ListController from './components/LightsController';

function Auth() {
  return (
    <Account>
      <Status />
      <Signup />
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
              <Route path="/" exact component={Auth} />
              <Route path="/devicecontroller/:username" component={ListController}/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;
//export default Auth;
