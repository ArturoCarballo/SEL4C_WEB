import React from 'react';
import { Button } from '@mui/material';

const LogoutButton: React.FC = () => {
    const logout = () => {
        localStorage.removeItem("admin_token");
        window.location.href = "/login";
    }

    return (
        <Button variant="contained" color="secondary" onClick={logout}>
            Cerrar sesión
        </Button>
    );
}

export default LogoutButton;
