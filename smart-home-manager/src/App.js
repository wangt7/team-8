import React, {Component} from 'react';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
 
import ListController from './components/LightsController';
 
class App extends Component {
  render() {
    return (      
       <BrowserRouter>
        <div>
            <Switch>
              <Route path="/" component={ListController} exact/>
           </Switch>
        </div> 
      </BrowserRouter>
    );
  }
}
 
export default App;
