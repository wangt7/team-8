import React, {Component} from 'react';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import ListController from './components/LightsController';
import DoorController from './components/DoorController';
 
class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
              <Route path="/" component={ListController} exact/>
              <Route path="/Doors" component={DoorController} exact/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;
