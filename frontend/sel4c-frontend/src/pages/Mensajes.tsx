import React, { useEffect, useRef, useState } from "react";
import { fetchMensajes } from "../services/Mensajes.service";
import { Mensaje } from "../interface/Mensaje";

const Mensajes: React.FC = () => {
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [categoriaFiltrada, setCategoriaFiltrada] = useState<string>("Todos");

    useEffect(() => {
        const obtenerMensajes = async () => {
            try {
                const result = await fetchMensajes();  // Suponiendo que 1 es el idUsuario
                setMensajes(result);
            } catch (error) {
                console.error("Error obteniendo mensajes:", error);
            }
        }

        obtenerMensajes();

        // Establecer intervalo para obtener mensajes cada 30 segundos
        const intervalId = setInterval(obtenerMensajes, 30000); // 30000 ms = 30 segundos

        // Limpiar intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);

    }, []);

    const categorias = ["Todos", "Pregunta", "Duda", "Queja", "Comentario", "Problema", "Otro"];

    const mensajesFiltrados = categoriaFiltrada === "Todos" ? mensajes : mensajes.filter(m => m.categoria === categoriaFiltrada);

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <select
                value={categoriaFiltrada}
                onChange={e => setCategoriaFiltrada(e.target.value)}
                style={{ marginBottom: "20px", padding: "5px", backgroundColor: "#dfecff" }}>
                {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            {mensajesFiltrados.map(mensaje => (
                <div
                    key={mensaje.idmensaje}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        marginBottom: "20px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        backgroundColor: "#dfecff",
                        transition: "transform 0.2s, boxShadow 0.2s", // Añadir transición
                        cursor: "pointer" // Cambiar el cursor a pointer
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                    }}
                >
                    <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px", fontWeight: "bold", color: "navy", fontSize: "25px" }}>{mensaje.categoria}</h3>
                    <p>{mensaje.mensaje}</p>
                    <small style={{ display: "block", marginTop: "10px", fontStyle: "italic" }}>Enviado por usuario {mensaje.idusuario}</small>
                </div>
            ))}

        </div>
    );
};


export default Mensajes;