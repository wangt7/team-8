import React, { useState, useContext } from 'react';
import { Account, AccountContext } from './Accounts';
import { useHistory } from "react-router-dom";


function AuthLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { authenticate } = useContext(AccountContext);

    const history = useHistory();

    const onSubmit = event => {
        event.preventDefault();
        authenticate(username, password)
            .then(data => {
                console.log('Login Successful', data);
                history.push("/devicecontroller/"+username);
            })
            .catch(err => {
                console.log('Login Failed', err)
            })
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
                <button type='sbumit'>Login</button>
            </form>
        </div>
    );
};

export default AuthLogin;
