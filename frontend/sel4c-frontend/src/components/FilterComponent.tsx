import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";
import { Institucion } from "../interface/Institucion";
import { fetchInstituciones } from "../services/Institucion.services";
import { fetchPaises } from "../services/Pais.services";
import { Pais } from "../interface/Pais";
import TextField from "@mui/material/TextField";
import { Slider } from "@mui/material";


interface FilterComponentProps {
  filters: {
    nombre_pais: string;
    disciplina: string;
    grado_academico: string;
    nombre_institucion: string;
    minEdad: number;
    maxEdad: number;
    nombre: string;
    apellido: string;
    email: string;
    sexo: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      nombre_pais: string;
      disciplina: string;
      grado_academico: string;
      nombre_institucion: string;
      minEdad: number;
      maxEdad: number;
      nombre: string;
      apellido: string;
      email: string;
      sexo: string;
    }>
  >;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filters,
  setFilters,
}) => {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [sexo, setSexo] = useState({
    hombre: true, // defaultChecked
    mujer: true, // defaultChecked
    noBinarie: true, // defaultChecked
    prefieroNoDecir: true // defaultChecked
  });

  const handleSexoChange = (sexoType: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.checked) {
        setFilters(prev => ({ ...prev, sexo: sexoType }));
    } else {
        // Uncheck. This is a simplified behavior. In reality, you might want to reset to a default or "all" value.
        setFilters(prev => ({ ...prev, sexo: '' }));
    }
};

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchInstituciones();
        setInstituciones(data);
      } catch (error) {
        console.error("Error fetching instituciones: ", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPaises();
        setPaises(data);
      } catch (error) {
        console.error("Error fetching instituciones: ", error);
      }
    };

    loadData();
  }, []);

  const [value, setValue] = React.useState<number[]>([20, 37]);

  const handleSliderChange = (event: Event, newValue: number[] | number, activeThumb: number) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
      setFilters(prevFilters => ({
        ...prevFilters,
        minEdad: newValue[0],
        maxEdad: newValue[1]
      }));
    }
  };

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    const name = event.target.name;

    if (name === "minEdad") {
      setValue([newValue, value[1]]);
      setFilters(prevFilters => ({ ...prevFilters, minEdad: newValue }));
    } else if (name === "maxEdad") {
      setValue([value[0], newValue]);
      setFilters(prevFilters => ({ ...prevFilters, maxEdad: newValue }));
    }
  };


  const handleFilterChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof filters;
    setFilters({
      ...filters,
      [name]: event.target.value as string,
    });
    console.log(filters);
  };

  // Define the inline style for the individual form controls
  const textboxStyle: React.CSSProperties = {
    width: "85px",
    backgroundColor: "#dfecff",
  };

  const autofillStyle: React.CSSProperties = {
    width: "255px",
    height: "55px",
    backgroundColor: "#dfecff",
    marginLeft: "20px",
  };
  const wordLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "navy",
    margin: "10px",
    marginTop: "20px",
  };
  const optionLabelStyle: React.CSSProperties = {
    color: "navy",
    margin: "0px",
  };

  const checkedCheckboxStyle: React.CSSProperties = {
    color: "navy",
  };

  const optionContainerStyle = {
    margin: "0px", // Adjust the space between options
  };

  return (
    <div>
      <Typography variant="h6" style={wordLabelStyle}>
        Sexo:
      </Typography>
      <div>
        {/* Checkboxes displayed vertically */}
        <div style={optionContainerStyle}>
          <FormControlLabel
            style={{ marginLeft: "15px" }}
            control={
              <Checkbox 
                style={checkedCheckboxStyle} 
                checked={filters.sexo === 'Masculino'}
                onChange={handleSexoChange('Masculino')}
              />
            }
            label={<Typography style={optionLabelStyle}>Hombre</Typography>}
          />
        </div>
        <div style={optionContainerStyle}>
          <FormControlLabel
            style={{ marginLeft: "15px" }}
            control={
              <Checkbox 
                style={checkedCheckboxStyle} 
                checked={filters.sexo === 'Femenino'}
                onChange={handleSexoChange('Femenino')}
              />
            }
            label={<Typography style={optionLabelStyle}>Mujer</Typography>}
          />
        </div>
        <div style={optionContainerStyle}>
          <FormControlLabel
            style={{ marginLeft: "15px" }}
            control={
              <Checkbox 
                style={checkedCheckboxStyle} 
                checked={filters.sexo === 'No binario'}
                onChange={handleSexoChange('No binario')}
              />
            }
            label={<Typography style={optionLabelStyle}>No binario  </Typography>}
          />
        </div>
        <div style={optionContainerStyle}>
          <FormControlLabel
            style={{ marginLeft: "15px" }}
            control={
              <Checkbox 
                style={checkedCheckboxStyle} 
                checked={filters.sexo === 'Prefiero no decir'}
                onChange={handleSexoChange('Prefiero no decir')}
              />
            }
            label={<Typography style={optionLabelStyle}>Prefiero no decir</Typography>}
          />
        </div>
      </div>
      <div style={{ alignItems: "center" }}>
        <Typography variant="h6" style={wordLabelStyle}>Nombre:</Typography>
        <TextField
          value={filters.nombre || ""}
          onChange={e => setFilters({ ...filters, nombre: e.target.value })}
          style={textboxStyle}
        />

        <Typography variant="h6" style={wordLabelStyle}>Apellido:</Typography>
        <TextField
          value={filters.apellido || ""}
          onChange={e => setFilters({ ...filters, apellido: e.target.value })}
          style={textboxStyle}
        />

        <Typography variant="h6" style={wordLabelStyle}>Correo:</Typography>
        <TextField
          value={filters.email || ""}
          onChange={e => setFilters({ ...filters, email: e.target.value })}
          style={textboxStyle}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h6" style={wordLabelStyle}>
          Edad:
        </Typography>
        <TextField
          label={<Typography style={optionLabelStyle}></Typography>}
          value={filters.minEdad || 0}
          variant="outlined"
          type="number"
          name="minAge" // Use a unique name for each TextField
          inputProps={{ min: "0" }} // Set the minimum value to 0
          style={textboxStyle}
          onChange={handleTextFieldChange}
        />
        <Typography variant="h6" style={wordLabelStyle}>
          -
        </Typography>
        <TextField
          label={<Typography style={optionLabelStyle}></Typography>}
          value={filters.maxEdad || 0}
          variant="outlined"
          type="number"
          name="maxAge" // Use a unique name for each TextField
          inputProps={{ min: "0" }} // Set the minimum value to 0
          style={textboxStyle}
          onChange={handleTextFieldChange}
        />
      </div>
      <Slider
        getAriaLabel={() => "Rango de edades"}
        //valueLabelDisplay="auto"
        value={value}
        onChange={handleSliderChange}
        style={{
          width: "250px",
          marginTop: "30px",
          marginLeft: "20px",
          color: "navy",
        }}
      />
      {/*Filtros por selector*/}
      <Typography variant="h6" style={wordLabelStyle}>
        País:
      </Typography>
      <div style={autofillStyle}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="pais-label"></InputLabel>
          <Select
            labelId="pais-label"
            id="nombre_pais"
            name="nombre_pais"
            value={filters.nombre_pais || ""}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            {paises.map((pais) => (
              <MenuItem key={pais.id} value={pais.nombre_pais}>
                {pais.nombre_pais}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Typography variant="h6" style={wordLabelStyle}>
        Disciplina:
      </Typography>
      <div style={autofillStyle}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="disciplina-label"></InputLabel>
          <Select
            labelId="disciplina-label"
            id="disciplina"
            name="disciplina"
            value={filters.disciplina || ""}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value={"Ingenieria Y Ciencias"}>
              Ingeniería y Ciencias
            </MenuItem>
            <MenuItem value={"Humanidades y Educacion"}>
              Humanidades y Educación
            </MenuItem>
            <MenuItem value={"Ciencias Sociales"}>
              Ciencias Sociales
            </MenuItem>
            <MenuItem value={"Ciencias de la Salud"}>
              Ciencias de la Salud
            </MenuItem>
            <MenuItem value={"Arquitectura Arte y Diseño"}>
              Arquitectura Arte y Diseño
            </MenuItem>
            <MenuItem value={"Negocios"}>
              Negocios
            </MenuItem>
            {/* ... otros valores de disciplina ... */}
          </Select>
        </FormControl>
      </div>
      <Typography variant="h6" style={wordLabelStyle}>
        Grado Académico:
      </Typography>
      <div style={autofillStyle}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="grado_academico-label"></InputLabel>
          <Select
            labelId="grado_academico-label"
            id="grado_academico"
            name="grado_academico"
            value={filters.grado_academico || ""}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value={"Pregrado"}>Pregrado</MenuItem>
            <MenuItem value={"Posgrado"}>Posgrado</MenuItem>
            <MenuItem value={"Educacion continua"}>Educacion continua</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Typography variant="h6" style={wordLabelStyle}>
        Institución:
      </Typography>
      <div style={autofillStyle}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="nombre_institucion-label">Institucion</InputLabel>
          <Select
            labelId="nombre_institucion-label"
            id="nombre_institucion"
            name="nombre_institucion"
            value={filters.nombre_institucion || ""}
            onChange={handleFilterChange}
          >
            <MenuItem value="">Todos</MenuItem>
            {instituciones.map((institucion) => (
              <MenuItem
                key={institucion.idinstitucion}
                value={institucion.nombre_institucion}
              >
                {institucion.nombre_institucion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default FilterComponent;
