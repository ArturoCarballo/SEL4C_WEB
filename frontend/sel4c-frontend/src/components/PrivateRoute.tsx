import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
    const isAuthenticated = localStorage.getItem('admin_token');
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    return <Component />;
}

export default PrivateRoute;
