
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
    const [users, setUsers] = useState([]);
    const [loggedInUsers, setLoggedInUsers] = useState([]);

    const fetchData = async () => {
        const usersRes = await axios.get('http://localhost:4000/api/users');
        console.log(usersRes)
        setUsers(usersRes.data.users);
        setLoggedInUsers(usersRes.data.loggedInUsers);
    };

    useEffect(() => {

        fetchData();
        socket.on('updateLoggedUsers', (users) => {
            console.log(users)
            setLoggedInUsers(users);
        });

        return () => {
            socket.off('newMessage');
            socket.off('updateLoggedUsers');
        };
    }, []);

    return (
        <div className="user-list">
            <h4>Users</h4>
            <ul>
                {users.map((u) => {
                    const isOnline = loggedInUsers.find((lu) => lu.id === u.id);
                    console.log(loggedInUsers)
                    console.log(isOnline)
                    return (
                        <li key={u.id} className={isOnline ? 'online' : 'offline'}>
                            <span className="status-indicator"></span>
                            {u.name}
                        </li>
                    );
                })}
            </ul>
        </div>

    );
}

export default App;
