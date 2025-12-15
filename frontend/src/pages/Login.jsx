import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Get base URL
    // const baseUrl = process.env.REACT_APP_BASE_URL;
    const baseUrl = "http://localhost:5000"

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            username: username,
            password: password,
            originFrom: 'Music app login page'
        };

        // Get login from api
        console.log(`Attempting to login user ${username}`);

        const response = await fetch(`${baseUrl}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.authenticated)
        {
            alert('Successful login!');
        }
        else
        {
            alert('Incorrect credentials!');
        }
    }

    // Return HTML content
    return (
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button type="submit">Log In</button>
                </form>
            </div>
        );
};

export default Login;