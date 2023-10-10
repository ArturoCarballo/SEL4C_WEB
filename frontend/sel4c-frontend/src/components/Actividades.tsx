import React from "react";

const titleStyle = {
  fontWeight: "bold",
  color: "navy",
  fontSize: "40px",
  marginInline: "20px",
};

const Actividades: React.FC = () => {
  return (
    <div>
      <h2 style={titleStyle}>Actividades</h2>
      <p>
        Aquí irá tu lista de Actividades o cualquier contenido relacionado con
        las Actividades.
      </p>
    </div>
  );
};

export default Actividades;
