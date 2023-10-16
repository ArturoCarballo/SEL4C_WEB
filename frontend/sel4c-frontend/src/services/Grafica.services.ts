import { DataEntry } from "../interface/DataEntry";

export const fetchCompetencias = async (id: number, idcuestionario: number): Promise<DataEntry[]> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(`/api/usuarios/${id}/respuestas/${idcuestionario}/grafica`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });

    if (!response.ok) throw new Error('Error fetching competencias');
    return response.json();
}
