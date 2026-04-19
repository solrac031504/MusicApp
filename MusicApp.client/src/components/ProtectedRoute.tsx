import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utilities/authentication'

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Render the protected component if authenticated
    return <>{children}</>;
};

export default ProtectedRoute;