import { Admin } from "../interface/Admin";

const API_BASE = "/api/admins";

export const fetchAdmins = async (): Promise<Admin[]> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(API_BASE, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error fetching admins');
    return response.json();
}

export const addAdmin= async (admin: Admin): Promise<Admin> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(admin)
    });
    if (!response.ok) throw new Error('Error adding admin');
    return response.json();
}

export const updateAdmin = async (admin: Admin): Promise<Admin> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(`${API_BASE}/${admin.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(admin)
    });
    if (!response.ok) throw new Error('Error updating admin');
    return response.json();
}

export const deleteAdmin = async (id: number): Promise<void> => {
    const token = localStorage.getItem("admin_token");
    
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error deleting admin');
}