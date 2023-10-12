import { User } from "../interface/User";

const API_BASE = "/api/usuarios";

export const fetchUsers = async (): Promise<User[]> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(API_BASE, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error fetching users');
    return response.json();
}

export const fetchUsersWithFilters = async (filters: any): Promise<User[]> => {
    const token = localStorage.getItem("admin_token");

    console.log(filters)

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

    console.log(queryString);
    
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


export const addUser = async (user: User): Promise<User> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Error adding user');
    return response.json();
}

export const updateUser = async (user: User): Promise<User> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(`${API_BASE}/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Error updating user');
    return response.json();
}

export const deleteUser = async (id: number): Promise<void> => {
    const token = localStorage.getItem("admin_token");
    
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error deleting user');
}

export const getUserById = async (id: number): Promise<User> => {
    const token = localStorage.getItem("admin_token");

    const response = await fetch(`${API_BASE}/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });
    if (!response.ok) throw new Error('Error fetching user by ID');
    return response.json();
}