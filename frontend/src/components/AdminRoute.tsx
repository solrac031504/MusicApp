import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdminUser } from '../utilities/authentication';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children}) => {
    const location = useLocation();

    // If the user is not authenticated go to the login
    if (!isAuthenticated()) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    // If the user is not an admin go to home
    else if (!isAdminUser()) {
        // Redirect to unauthorized page if not admin user
        return <Navigate to="/home" state={{ from: location }} replace />;
    }

    // Render the protected component if admin auth
    return <>{children}</>
};

export default AdminRoute;