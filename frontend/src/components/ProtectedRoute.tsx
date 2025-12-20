import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    
    // Check if the user is authenticated
    const isAuthenticated = (): boolean => {
        // Check local storage
        const token = sessionStorage.getItem('authToken');
        const user = sessionStorage.getItem('user');

        // Return true if both token and user exist
        return !!(token && user);
    }

    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Render the protected component if authenticated
    return <>{children}</>;
};

export default ProtectedRoute;