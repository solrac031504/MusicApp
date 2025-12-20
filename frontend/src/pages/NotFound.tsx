import React from 'react';
import { Navigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const isAuthenticated = (): boolean => {
        // Check if user is authenticated
        const token = sessionStorage.getItem('authToken');
        const user = sessionStorage.getItem('user');
        return !!(token && user);
    };

    if (isAuthenticated()) {
        // Show 404 page for authenticated users
        return (
            <div className="not-found-container">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/home">Go back to home</a>
            </div>
        );
    } else {
        // Redirect unauthenticated users to login
        return <Navigate to="/" replace />;
    }
};

export default NotFound;