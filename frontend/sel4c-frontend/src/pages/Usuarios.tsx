import { useState } from "react";
import { UserTable } from "../components/UserTable";
import FilterComponent from "../components/FilterComponent";
import { Button } from "@mui/material";
import Diagnostico from "../components/Diagnostico";

const whiteLabelStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "white",
  fontSize: "25px",
};

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
  maxWidth: "500px",
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
  textAlign: "right", // Align buttons to the right
};

const buttonStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "Navy",
  backgroundColor: "white", // Green background color
  border: "0px",
  marginInline: "2px",
  margin: "2px", // Set margin
  borderRadius: "5px",
  padding: "2px 10px", // Set padding to match margin (adjust as needed)
  textTransform: "none",
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
    sexo: "",
  });

  const [activeTab, setActiveTab] = useState('tabla');
  return (
    <div style={backgroundStyle}>
      <div style={filterframeStyle}>
        <FilterComponent filters={filters} setFilters={setFilters} />
      </div>
      <div style={whiteframeStyle}>
        <div style={tabbuttonStyle}>
          <Button style={buttonStyle} onClick={() => setActiveTab('diagnostico')}>Diagnósticos</Button>
          <Button style={buttonStyle}>Actividades</Button>
          <Button style={buttonStyle} onClick={() => setActiveTab('tabla')}>Tabla</Button>
        </div>
        {
          activeTab === 'tabla' ? 
          <UserTable filters={filters} setFilters={setFilters} /> :
          activeTab === 'diagnostico' ?
          <Diagnostico /> : 
          null
        }
      </div>
    </div>
  );
};

export default Usuarios;
