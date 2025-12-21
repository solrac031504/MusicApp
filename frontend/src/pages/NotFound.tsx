import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utilities/authentication';

const NotFound: React.FC = () => {
    const navigate = useNavigate(); 
    const redirectTime = 10000; // 10 seconds in ms

    const [secondsLeft, setSecondsLeft] = useState(redirectTime / 1000);

    // Redirect after 10 seconds
    useEffect(() => {
        const timerId = setTimeout(() => {
            navigate('/home');
        }, redirectTime);

        // Clearn timeout
        return () => clearTimeout(timerId);
    }, [navigate]);

    // Update the time left
    useEffect(() => {
        // Exit when time reaches 0
        if (secondsLeft <= 0) return;

        // Update every second
        const intervalId = setInterval(() => {
            setSecondsLeft(prevSeconds => prevSeconds - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft])

    if (isAuthenticated()) {
        // Show 404 page for authenticated users
        return (
            <div className="not-found-container">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <p>You will redirected to the home page in {secondsLeft} seconds...</p>
            </div>
        );
    } else {
        // Redirect unauthenticated users to login
        return <Navigate to="/" replace />;
    }
};

export default NotFound;