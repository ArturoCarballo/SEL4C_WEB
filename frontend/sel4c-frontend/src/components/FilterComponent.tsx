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
    sexo: {
      Masculino: boolean;
      Femenino: boolean;
      "No binario": boolean;
      "Prefiero no decir": boolean;
    };
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
      sexo: {
        Masculino: boolean;
        Femenino: boolean;
        "No binario": boolean;
        "Prefiero no decir": boolean;
      };
    }>
  >;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  filters,
  setFilters,
}) => {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  type SexoValue =
    | "Masculino"
    | "Femenino"
    | "No binario"
    | "Prefiero no decir";

  const handleSexoChange =
    (sexoValue: keyof typeof filters.sexo) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        sexo: {
          ...prevFilters.sexo,
          [sexoValue]: event.target.checked,
        },
      }));
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

  const [value, setValue] = React.useState<number[]>([0, 150]);

  const handleSliderChange = (
    event: Event,
    newValue: number[] | number,
    activeThumb: number
  ) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
      setFilters((prevFilters) => ({
        ...prevFilters,
        minEdad: newValue[0],
        maxEdad: newValue[1],
      }));
    }
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    const name = event.target.name;

    // Asegurarse de que el newValue contiene solo dígitos
    if (!/^\d*$/.test(newValue)) {
      return; // No actualizar el valor si no es un número
    }

    const numberValue = parseInt(newValue, 10); // Convertir la cadena a número

    if (name === "minEdad") {
      setValue([numberValue, value[1]]);
      setFilters((prevFilters) => ({ ...prevFilters, minEdad: numberValue }));
    } else if (name === "maxEdad") {
      setValue([value[0], numberValue]);
      setFilters((prevFilters) => ({ ...prevFilters, maxEdad: numberValue }));
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
    width: "100%",
    backgroundColor: "#dfecff",
    borderColor: "transparent",
  };

  const autofillStyle: React.CSSProperties = {
    width: "100%",
    height: "50px",
    backgroundColor: "#dfecff",
    color: "navy",
  };
  const wordLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "navy",
    fontSize: "25px",
    marginTop: "20px",
  };
  const optionLabelStyle: React.CSSProperties = {
    color: "navy",
  };

  const checkedCheckboxStyle: React.CSSProperties = {
    color: "navy",
  };

  const optionContainerStyle = {
    margin: "0px", // Adjust the space between options
  };

  return (
    <div>
      <div style={{ alignItems: "center" }}>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", color: "navy", fontSize: "25px" }}
        >
          Nombre:
        </Typography>
        <TextField
          value={filters.nombre || ""}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          style={textboxStyle}
        />

        <Typography variant="h6" style={wordLabelStyle}>
          Apellido:
        </Typography>
        <TextField
          value={filters.apellido || ""}
          onChange={(e) => setFilters({ ...filters, apellido: e.target.value })}
          style={textboxStyle}
        />

        <Typography variant="h6" style={wordLabelStyle}>
          Correo:
        </Typography>
        <TextField
          value={filters.email || ""}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          style={textboxStyle}
        />
      </div>
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
                checked={filters.sexo["Masculino"]}
                onChange={handleSexoChange("Masculino")}
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
                checked={filters.sexo["Femenino"]}
                onChange={handleSexoChange("Femenino")}
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
                checked={filters.sexo["No binario"]}
                onChange={handleSexoChange("No binario")}
              />
            }
            label={
              <Typography style={optionLabelStyle}>No binarie </Typography>
            }
          />
        </div>
        <div style={optionContainerStyle}>
          <FormControlLabel
            style={{ marginLeft: "15px" }}
            control={
              <Checkbox
                style={checkedCheckboxStyle}
                checked={filters.sexo["Prefiero no decir"]}
                onChange={handleSexoChange("Prefiero no decir")}
              />
            }
            label={
              <Typography style={optionLabelStyle}>
                Prefiero no decir
              </Typography>
            }
          />
        </div>
      </div>
      <div>
        <Typography variant="h6" style={wordLabelStyle}>
          Edades:
        </Typography>{" "}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          label={<Typography style={optionLabelStyle}></Typography>}
          value={filters.minEdad || 0}
          variant="outlined"
          type="text"
          name="minEdad"
          inputProps={{ pattern: "\\d*" }}
          style={textboxStyle}
          onChange={handleTextFieldChange}
        />
        <Typography
          variant="h6"
          style={{
            marginInline: "15px",
            color: "navy",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        ></Typography>
        <TextField
          label={<Typography style={optionLabelStyle}></Typography>}
          value={filters.maxEdad || 0}
          variant="outlined"
          type="text"
          name="maxEdad"
          inputProps={{ pattern: "\\d*" }}
          style={textboxStyle}
          onChange={handleTextFieldChange}
        />
      </div>
      <Slider //que empiece en
        getAriaLabel={() => "Edades"}
        //valueLabelDisplay="auto"
        value={value}
        onChange={handleSliderChange}
        style={{
          marginLeft: "30px",
          marginTop: "15px",
          color: "navy",
          width: "75%",
        }}
      />
      {/*Filtros por selector*/}
      <Typography variant="h6" style={wordLabelStyle}>
        País:
      </Typography>
      <div>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="pais-label"></InputLabel>
          <Select
            style={autofillStyle}
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
      <div>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="disciplina-label"></InputLabel>
          <Select
            style={autofillStyle}
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
            <MenuItem value={"Ciencias Sociales"}>Ciencias Sociales</MenuItem>
            <MenuItem value={"Ciencias de la Salud"}>
              Ciencias de la Salud
            </MenuItem>
            <MenuItem value={"Arquitectura Arte y Diseño"}>
              Arquitectura Arte y Diseño
            </MenuItem>
            <MenuItem value={"Negocios"}>Negocios</MenuItem>
            {/* ... otros valores de disciplina ... */}
          </Select>
        </FormControl>
      </div>
      <Typography variant="h6" style={wordLabelStyle}>
        Grado Académico:
      </Typography>
      <div>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="grado_academico-label"></InputLabel>
          <Select
            style={autofillStyle}
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
      <div>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="nombre_institucion-label"></InputLabel>
          <Select
            style={autofillStyle}
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
