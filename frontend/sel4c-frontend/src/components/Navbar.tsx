import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                {/* Logo / Brand Name */}
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    MiLogo
                </Typography>

                {/* Rutas */}
                <Button color="inherit" component={Link} to="/">Inicio</Button>
                <Button color="inherit" component={Link} to="/users">Usuarios</Button>
                <Button color="inherit" component={Link} to="/admins">Admins</Button>
                {/* ... Añadir tantos botones como rutas desees ... */}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
