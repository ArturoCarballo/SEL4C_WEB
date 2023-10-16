import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { ButtonGroup } from "@mui/material";

const buttonStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "white",
  marginInline: "2px",
  margin: "2px", // Set margin
  borderRadius: "5px",
  padding: "2px 10px", // Set padding to match margin (adjust as needed)
  textTransform: "none",
  borderColor: "white",
};

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#061e61", width: "100%" }}
    >
      <Toolbar>
        {/* Logo / Brand Name (MiLogo) */}
        <img
          src="/logo_inicio.png"
          alt="Imagen de inicio de sesión"
          style={{ width: "250px", margin: "10px", marginBottom: "0px" }}
        />
        {/* Buttons aligned to the right */}
        <div style={{ flexGrow: 1 }}></div>{" "}
        {/* Add a flexible space to push buttons to the right */}
        <div>
          <ButtonGroup variant="outlined" size="medium">
            <Button style={buttonStyle} component={Link} to="/users">
              Usuarios
            </Button>
            <Button style={buttonStyle} component={Link} to="/admins">
              Admins
            </Button>
            <Button style={buttonStyle} component={Link} to="/mensajes">
              Mensajes
            </Button>
          </ButtonGroup>
          <LogoutButton></LogoutButton>
          {/* ... Add as many buttons as needed for other routes ... */}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
