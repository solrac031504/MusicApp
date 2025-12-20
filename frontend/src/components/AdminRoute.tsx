import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children}) => {
    const location = useLocation();

    // Check if the user is authenticated
    const isAuthenticated = (): boolean => {
        // Get auth details from session storage
        const user = sessionStorage.getItem('user');
        const loginExpiration = sessionStorage.getItem('loginExpiration');

        const loginExpirationDate = new Date(loginExpiration!);

        const nowUTC = new Date();

        // Return true if user exists AND now is before loginExpiration (in UTC)
        return ((!!user) && (nowUTC <= loginExpirationDate));
    }

    // Check if the user is one of the admin users
    const isAdminUser = (): boolean => {
        // Get auth details from session storage
        const isAdmin = sessionStorage.getItem('isAdmin') === 'true' ?
            true
            : false;

        // Return true if user exists AND now is before loginExpiration (in UTC) AND user is admin
        return isAdmin;
    }

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