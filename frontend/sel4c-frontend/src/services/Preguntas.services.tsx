import { Preguntas } from "../interface/Preguntas";

export const fetchPreguntasWithFilters = async (idcuestionario: number, filters: any): Promise<Preguntas[]> => {
    const token = localStorage.getItem("admin_token");
    
    // 1. Construye la cadena de consulta
    const queryString = new URLSearchParams(filters).toString();
    
    // 2. Adjunta el idcuestionario a la URL y agrega la cadena de consulta.
    const response = await fetch(`/api/respuestas/cuestionario/${idcuestionario}?${queryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    
    if (!response.ok) throw new Error('Error fetching respuestas');
    return response.json();
}

