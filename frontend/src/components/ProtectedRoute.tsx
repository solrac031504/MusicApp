import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    
    // Check if the user is authenticated
    const isAuthenticated = (): boolean => {
        // Get auth details from local storage
        const user = sessionStorage.getItem('user');
        const loginExpiration = sessionStorage.getItem('loginExpiration');

        const loginExpirationDate = new Date(loginExpiration!);

        const nowUTC = new Date();

        // Return true if user exists AND now is before loginExpiration (in UTC)
        return ((!!user) && (nowUTC <= loginExpirationDate));
    }

    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Render the protected component if authenticated
    return <>{children}</>;
};

export default ProtectedRoute;