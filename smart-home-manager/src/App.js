import React from 'react';
import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Status from './components/Status'
import { Account } from './components/Accounts';

function Auth() {
  return (
    <Account>
      <Status />
      <Signup />
      <Login />
    </Account>
  );
};

export default Auth;
