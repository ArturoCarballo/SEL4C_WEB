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

const optionLabelStyle: React.CSSProperties = {
  color: "navy",
  margin: "0px",
  fontStyle: "italic",
};

const autofillStyle: React.CSSProperties = {
  width: "250px",
  height: "50px",
  backgroundColor: "#dfecff",
};

const Navbar: React.FC = () => {
  // Define and initialize the text input states
  const [searchText1, setSearchText1] = useState("");
  const [searchText2, setSearchText2] = useState("");
  const [searchText3, setSearchText3] = useState("");

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
        {/* Text input boxes */}
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "50px" }}
        >
          <div>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="grado_academico-label">Nombre</InputLabel>
              <Select
                style={autofillStyle}
                labelId="grado_academico-label"
                id="grado_academico"
                name="grado_academico"
                //value={filters.grado_academico || ""}
                //onChange={handleFilterChange}
              >
                {/*
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value={"Pregrado"}>Pregrado</MenuItem>
                <MenuItem value={"Posgrado"}>Posgrado</MenuItem>
                <MenuItem value={"Educacion continua"}>
                  Educacion continua
  </MenuItem>*/}
              </Select>
            </FormControl>
          </div>
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
