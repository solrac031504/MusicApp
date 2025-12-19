import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if the user is authenticated
    const isAuthenticated = () => {
        // Check local storage
        const token = sessionStorage.getItem('authToken');
        const user = sessionStorage.getItem('user');

        // Return true if both token and user exist
        return !!(token && user);
    }

    if (!isAuthenticated())
    {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    // Render the protected component if authenticated
    return children;
};

export default ProtectedRoute;