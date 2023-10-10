import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Container, Box } from "@mui/material";

async function login(username: string, password: string) {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data && data.token) {
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_id", data.id);

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
    background: "linear-gradient(to bottom, #051952, #92b9f7)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  };

  const titleLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "navy",
    margin: "25px",
    fontSize: "40px",
  };

  const wordLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "navy",
    margin: "10px",
    fontSize: "25px",
  };

  const whiteLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "white",
    marginTop: "25px",
    marginBottom: "15px",
    fontSize: "25px",
  };

  const containerStyle = {
    background: "white",
    //padding: "5vh",
    margin: "5vh auto",
    borderRadius: "30px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
  };

  const textFieldStyle = {
    background: "#dfecff",
    marginBottom: "20px",
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = await login(username, password);
      if (token) {
        navigate("/users");
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
            mb: 2,
          }}
        >
          <img
            src="/logo_inicio.png"
            alt="Imagen de inicio de sesión"
            style={{ width: "350px", marginBottom: "20px" }}
          />
          <Typography style={titleLabelStyle}>Inicio de sesión</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Typography style={wordLabelStyle}>Nombre de usuario:</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={textFieldStyle}
            />
            <Typography style={wordLabelStyle}>Contraseña:</Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyle}
            />
            <Button
              type="submit"
              fullWidth
              color="primary"
              sx={{
                backgroundColor: "#00cc66",
                "&:hover": { backgroundColor: "#006633" },
                borderRadius: "5px",
              }}
              style={whiteLabelStyle}
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
