import { Mensaje } from "../interface/Mensaje";

export const fetchMensajes = async (): Promise<Mensaje[]> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(`/api/mensaje`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });

    if (!response.ok) throw new Error('Error fetching mensajes');
    return response.json();
}
