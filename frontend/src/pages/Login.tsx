import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

// Types for API response
interface LoginResponse {
    authenticated: boolean;
    loginExpiration?: Date;
    admin?: boolean;
    error?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Get base URL
    // const baseUrl = process.env.REACT_APP_BASE_URL;
    const baseUrl = "http://localhost:5000";

    // Handle login
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = {
            username: username,
            password: password,
            originFrom: 'Music app login page'
        };

        // Get login from api
        console.log(`Attempting to login user ${username}`);

        try {
            const response = await fetch(`${baseUrl}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Throw HTTP error if response is not OK and NOT 401 forbidden
            if (!response.ok && response.status !== 401) {
               throw new Error(`HTTP error: status ${response.status}`);
            }

            const result: LoginResponse = await response.json();

            if (result.authenticated) {
                const loginExpiration = new Date(result.loginExpiration!);
                const isAdmin = result.admin!;

                // Save auth data
                sessionStorage.setItem('user', username);
                sessionStorage.setItem('loginExpiration', loginExpiration.toISOString());
                sessionStorage.setItem('isAdmin', isAdmin.toString());

                console.log(`user: ${username}`);
                console.log(`loginExpiration: ${loginExpiration.toISOString()}`);
                console.log(`isAdmin: ${isAdmin}`);

                navigate('/home');
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed. Please try again');
        } finally {
            setLoading(false);
        }
    }

    // Return HTML content
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome to Music App</h2>
                    <p>Sign in to your account</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading"></span>
                                Logging in...
                            </>
                        ) : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;