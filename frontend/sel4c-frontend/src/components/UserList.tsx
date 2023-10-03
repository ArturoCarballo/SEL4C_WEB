import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';

export const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/usuarios');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.nombre} {user.apellido}</li>
                ))}
            </ul>
        </div>
    );
}
