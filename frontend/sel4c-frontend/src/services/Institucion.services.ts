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

export const addInstitucion = async (institucion: Institucion): Promise<Institucion> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(institucion)
    });
    if (!response.ok) throw new Error('Error adding admin');
    return response.json();
}

export const deleteInstitucion = async (id: number): Promise<void> => {
    const token = localStorage.getItem("admin_token");
    
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error deleting admin');
}

export const updateInstitucion = async (institucion: Institucion): Promise<Institucion> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(`${BASE_URL}/${institucion.idinstitucion}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(institucion)
    });
    if (!response.ok) throw new Error('Error updating admin');
    return response.json();
}
