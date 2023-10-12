import { Preguntas } from "../interface/Preguntas";

export const fetchPreguntasWithFilters = async (idcuestionario: number, filters: any, questionId: number): Promise<Preguntas[]> => {
    const token = localStorage.getItem("admin_token");

    // 1. Inicializa URLSearchParams
    const params = new URLSearchParams();

    // 2. Añade otros filtros que no son 'sexo'
    Object.keys(filters).forEach(key => {
        if (key !== 'sexo' && filters[key]) {
            params.append(key, filters[key]);
        }
    });

    // 3. Añade los filtros de 'sexo'
    if (filters.sexo) {
        Object.keys(filters.sexo).forEach(key => {
            if (filters.sexo[key]) {
                params.append('sexo', key);
            }
        });
    }
    
    // 4. Construye la cadena de consulta
    const queryString = params.toString();

    const response = await fetch(`/api/respuestas/cuestionario/${idcuestionario}?questionId=${questionId}&${queryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    
    if (!response.ok) throw new Error('Error fetching respuestas');
    return response.json();
}

