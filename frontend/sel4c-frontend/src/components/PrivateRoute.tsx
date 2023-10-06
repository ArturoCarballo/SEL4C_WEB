import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const isAuthenticated = localStorage.getItem('admin_token');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default PrivateRoute;
