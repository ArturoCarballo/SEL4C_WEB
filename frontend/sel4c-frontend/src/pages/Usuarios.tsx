import { useState } from "react";
import { UserTable } from "../components/UserTable";
import FilterComponent from "../components/FilterComponent";
import { Button, ButtonGroup } from "@mui/material";
import Diagnostico from "../components/Diagnostico";
import Actividades from "../components/Actividades";

const backgroundStyle: React.CSSProperties = {
  background: "linear-gradient(to bottom, #061e61, #92b9f7)",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
};

const filterframeStyle: React.CSSProperties = {
  background: "white",
  maxWidth: "225px",
  width: "225px",
  flexDirection: "column",
  margin: "10px",
  borderRadius: "10px",
  flex: 1,
  padding: "20px",
};

const whiteframeStyle: React.CSSProperties = {
  background: "white",
  display: "flex",
  flexDirection: "column",
  margin: "10px",
  borderRadius: "10px",
  flex: 1,
  padding: "20px",
  justifyContent: "flex-end", // Align children to the right
};

const tabbuttonStyle: React.CSSProperties = {
  textAlign: "right", // Alinea los botones a la derecha
  position: "absolute",
  top: 150,
  right: 50, // Align buttons to the right
};
const contentContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start", // Alinea el contenido en la parte superior
  flex: 1,
};

const buttonStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "navy",
  marginInline: "2px",
  margin: "2px", // Set margin
  borderRadius: "5px",
  padding: "2px 10px", // Set padding to match margin (adjust as needed)
  textTransform: "none",
  borderColor: "navy",
};

const Usuarios: React.FC = () => {
  const [filters, setFilters] = useState({
    nombre_pais: "",
    disciplina: "",
    grado_academico: "",
    nombre_institucion: "",
    minEdad: 0,
    maxEdad: 100,
    nombre: "",
    apellido: "",
    email: "",
    sexo: {
      Masculino: false,
      Femenino: false,
      "No binario": false,
      "Prefiero no decir": false,
    },
  });

  const [activeTab, setActiveTab] = useState("tabla");
  return (
    <div style={backgroundStyle}>
      <div style={filterframeStyle}>
        <FilterComponent filters={filters} setFilters={setFilters} />
      </div>
      <div style={whiteframeStyle}>
        <div style={tabbuttonStyle}>
          <ButtonGroup variant="outlined" size="medium">
            <Button
              style={buttonStyle}
              onClick={() => setActiveTab("diagnostico")}
            >
              Diagnósticos
            </Button>
            <Button style={buttonStyle} onClick={() => setActiveTab("tabla")}>
              Tablas
            </Button>
            <Button
              style={buttonStyle}
              onClick={() => setActiveTab("Actividades")}
            >
              Actividades
            </Button>
          </ButtonGroup>
        </div>
        <div style={contentContainerStyle}>
          {activeTab === "tabla" ? (
            <UserTable filters={filters} setFilters={setFilters} />
          ) : activeTab === "diagnostico" ? (
            <Diagnostico filters={filters} setFilters={setFilters} />
          ) : activeTab === "Actividades" ? (
            <Actividades filters={filters} setFilters={setFilters}/>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
