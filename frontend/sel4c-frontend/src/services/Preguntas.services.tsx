import { Preguntas } from "../interface/Preguntas";

export const fetchPreguntasWithFilters = async (filters: any): Promise<Preguntas[]> => {
    const token = localStorage.getItem("admin_token");

    // 1. Construye la cadena de consulta
    const queryString = new URLSearchParams(filters).toString();
    
    const response = await fetch(`/api/usuarios?${queryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    
    if (!response.ok) throw new Error('Error fetching users');
    return response.json();
}
