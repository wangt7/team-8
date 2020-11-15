import React, { useState, useContext } from 'react';
import { Account, AccountContext } from './Accounts';
import { useHistory } from "react-router-dom";
import { Button, FormGroup, Form } from 'react-bootstrap'


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
                history.push("/lights/"+username);
            })
            .catch(err => {
                console.log('Login Failed', err)
            })
    };


    return (
        <div>
            <Form style={{width:"35%", marginLeft:"31%"}} onSubmit={onSubmit}>
                <FormGroup>
                    <h1>Smart Home Manager</h1>
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Username"
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                    />
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                    <Button type='sbumit'>Login</Button>
                </FormGroup>
            </Form>
        </div>
    );
};

export default AuthLogin;
