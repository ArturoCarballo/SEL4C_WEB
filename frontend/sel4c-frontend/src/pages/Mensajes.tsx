import React, { useEffect, useState } from "react";
import { fetchMensajes } from "../services/Mensajes.service";
import { Mensaje } from "../interface/Mensaje";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@material-ui/core";

const autofillStyle: React.CSSProperties = {
  width: "200px",
  height: "50px",
  backgroundColor: "#dfecff",
  borderRadius: "5px",
  color: "navy",
  fontSize: "16px",
  marginBottom: "15px",
};

const Mensajes: React.FC = () => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [categoriaFiltrada, setCategoriaFiltrada] = useState<string>("Todos");

  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const result = await fetchMensajes();
        setMensajes(result);
      } catch (error) {
        console.error("Error obteniendo mensajes:", error);
      }
    };

    obtenerMensajes();
  }, []);

  const categorias = [
    "Todos",
    "Pregunta",
    "Duda",
    "Queja",
    "Comentario",
    "Problema",
    "Otro",
    "Oculto",
  ];

  const mensajesFiltrados =
    categoriaFiltrada === "Todos"
      ? mensajes.filter((m) => m.categoria !== "Oculto")
      : mensajes.filter((m) => m.categoria === categoriaFiltrada);

  return (
    <div style={{ padding: "20px", margin: "20px", alignItems: "center" }}>
      <Typography
        variant="h6"
        style={{
          fontWeight: "bold",
          color: "navy",
          fontSize: "25px",
        }}
      >
        Filtro:
      </Typography>
      <select
        value={categoriaFiltrada}
        onChange={(e) => setCategoriaFiltrada(e.target.value)}
        style={autofillStyle}
      >
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {mensajesFiltrados.map((mensaje) => {
        const handleEyeClick = () => {
          if (mensaje.categoria !== "Oculto") {
            if (
              window.confirm("¿Está seguro de que quiere ocultar este mensaje?")
            ) {
              mensaje.categoriaOriginal = mensaje.categoria;
              mensaje.categoria = "Oculto";
              setMensajes([...mensajes]);
            }
          } else {
            if (window.confirm("¿Desea volver a mostrar este mensaje?")) {
              mensaje.categoria = mensaje.categoriaOriginal!;
              delete mensaje.categoriaOriginal;
              setMensajes([...mensajes]);
            }
          }
        };

        return (
          <div
            key={mensaje.idmensaje}
            style={{
              position: "relative",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, boxShadow 0.2s",
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            }}
          >
            {/* Ícono del ojo */}
            <div
              style={{
                position: "absolute",
                right: "10px",
                bottom: "10px",
                fontSize: "25px",
                cursor: "pointer",
              }}
            >
              {mensaje.categoria !== "Oculto" ? (
                <AiFillEye onClick={handleEyeClick} />
              ) : (
                <AiFillEyeInvisible onClick={handleEyeClick} />
              )}
            </div>
            <h3
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
                fontWeight: "bold",
                color: "navy",
                fontSize: "25px",
              }}
            >
              {mensaje.categoria}
            </h3>
            <p>{mensaje.mensaje}</p>
            <small
              style={{
                display: "block",
                marginTop: "10px",
                fontStyle: "italic",
              }}
            >
              Enviado por usuario {mensaje.idusuario} : {mensaje.email}
            </small>
          </div>
        );
      })}
    </div>
  );
};

export default Mensajes;
