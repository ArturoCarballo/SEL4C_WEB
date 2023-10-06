import { Institucion } from "../interface/Institucion";

const BASE_URL = '/api/instituciones';

export const fetchInstituciones = async (): Promise<Institucion[]> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(BASE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error fetching instituciones');
    return response.json();
};
