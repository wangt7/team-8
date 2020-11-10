import React, { useState } from 'react';
import UserPool from '../UserPool';


function AuthSignup() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  
  
  const onSubmit = event => {
    event.preventDefault();
    UserPool.signUp(username, password, [], null, (err,data) => {
      if (err) console.error(err);
      console.log(data);
    });
  };


  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={username}
          onChange={event => setUsername(event.target.value)}
        />

        <input
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
        <button type='sbumit'>Signup</button>
      </form>
    </div>
  );
};

export default AuthSignup;
