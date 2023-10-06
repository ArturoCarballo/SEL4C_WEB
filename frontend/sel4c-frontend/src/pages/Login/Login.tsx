import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from "@mui/material";

async function login(username: string, password: string) {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
      if (data && data.token) {
        localStorage.setItem("admin_token", data.token);
        
        return data.token;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  }

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const pageStyle = {
      background: 'linear-gradient(to bottom, #021B79, #ffffff)',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    };

    const containerStyle = {
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '5vh',
      margin: '5vh auto',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    };

    const textFieldStyle = {
        background: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '10px',
    };
    
  

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const token = await login(username, password);
            if (token) {
                navigate('/users');
            } else {
                // Aquí puedes manejar el error y mostrar un mensaje al usuario
            }
        } catch (error) {
            // Muestra un mensaje de error
        }
    };

    return (
      
      <div style={pageStyle}>
      <Container component="main" maxWidth="xs" style={containerStyle}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 8,
          }}
        >
          <img
            src="/logo_inicio.png" 
            alt="Imagen de inicio de sesión"
            style={{ width: '300px', marginBottom: '20px' }}
          />
          <Typography component="h1" variant="h3" sx={{ fontSize: '2.5rem' }}>
              Inicio de sesión
            </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de usuario"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={textFieldStyle}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyle}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, backgroundColor: 'green', '&:hover': { backgroundColor: 'blue' } }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
