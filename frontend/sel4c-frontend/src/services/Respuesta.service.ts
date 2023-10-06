import { Respuesta } from "../interface/Respuesta";

export const fetchRespuestas = async (id: number, idcuestionario: number): Promise<Respuesta[]> => {
    const token = localStorage.getItem("admin_token");
    
    const response = await fetch(`/api/usuarios/${id}/respuestas/${idcuestionario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    
    if (!response.ok) throw new Error('Error fetching respuestas');
    return response.json();
}