import { Pais } from "../interface/Pais";

const BASE_URL = '/api/paises';

export const fetchPaises = async (): Promise<Pais[]> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(BASE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error fetching paises');
    return response.json();
};
