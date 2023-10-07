import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

const optionLabelStyle: React.CSSProperties = {
  color: "navy",
  margin: "0px",
  fontStyle: "italic",
};

const Navbar: React.FC = () => {
  // Define and initialize the text input states
  const [searchText1, setSearchText1] = useState("");
  const [searchText2, setSearchText2] = useState("");
  const [searchText3, setSearchText3] = useState("");

  return (
    <AppBar position="static" style={{ backgroundColor: "navy" }}>
      <Toolbar>
        {/* Logo / Brand Name (MiLogo) */}
        <img
          src="/logo_blanco.png"
          alt="Imagen de inicio de sesión"
          style={{ width: "250px", margin: "20px" }}
        />
        {/* Text input boxes */}
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "50px" }}
        >
          <TextField
            label={<Typography style={optionLabelStyle}>Nombre</Typography>}
            variant="outlined"
            size="small"
            value={searchText1}
            onChange={(e) => setSearchText1(e.target.value)}
            style={{ margin: "20px" }}
            InputProps={{
              style: {
                backgroundColor: "#dfecff",
                color: "black",
              },
            }}
          />
          <TextField
            label={<Typography style={optionLabelStyle}>Apellido</Typography>}
            variant="outlined"
            size="small"
            value={searchText2}
            onChange={(e) => setSearchText2(e.target.value)}
            style={{ marginRight: "50px" }}
            InputProps={{
              style: {
                backgroundColor: "#dfecff",
                color: "black",
              },
            }}
          />
          <TextField
            label={<Typography style={optionLabelStyle}>Correo</Typography>}
            variant="outlined"
            size="small"
            value={searchText3}
            onChange={(e) => setSearchText3(e.target.value)}
            InputProps={{
              style: {
                backgroundColor: "#dfecff",
                color: "black",
              },
            }}
          />
        </div>
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
