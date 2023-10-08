import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

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
          <Button color="inherit" component={Link} to="/">
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/users">
            Usuarios
          </Button>
          <Button color="inherit" component={Link} to="/admins">
            Admins
          </Button>
          {/* ... Add as many buttons as needed for other routes ... */}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
