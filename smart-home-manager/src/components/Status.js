import React, { useContext, useState, useEffect } from 'react';
import { AccountContext } from './Accounts';

export default () => {
    const [status, setStatus] = useState(false);

    const { getSession, logout } = useContext(AccountContext);

    useEffect(() => {
        getSession()
            .then(session => {
                console.log('Session', session);
                setStatus(true);
            })
    }, []);

    const showToken = () => {
        getSession().then(async ({ headers }) => {
            console.log(headers)
        })
    }

    return (
        <div>
            {status ? (
                <div>
                    Logged in
                    <button onClick={logout}>Logout</button>
                    <button onClick={showToken}>showToken</button>
                </div>
            ) : 'Not logged in' }
        </div>
    );
};