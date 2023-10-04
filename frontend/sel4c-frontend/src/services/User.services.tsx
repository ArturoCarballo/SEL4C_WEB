import { User } from "../interface/User";

const API_BASE = "/api/usuarios";

export const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Error fetching users');
    return response.json();
}

export const addUser = async (user: User): Promise<User> => {
    const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Error adding user');
    return response.json();
}

export const updateUser = async (user: User): Promise<User> => {
    const response = await fetch(`${API_BASE}/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Error updating user');
    return response.json();
}

export const deleteUser = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error deleting user');
}