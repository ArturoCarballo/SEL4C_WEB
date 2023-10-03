import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';

export const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<{key: keyof User, direction: string} | null>(null);

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

    useEffect(() => {
        let sortedArray = [...users];
        if (sortConfig !== null) {
            const { key, direction } = sortConfig; // Extraemos key y direction aquí
            sortedArray.sort((a: User, b: User) => {
                const aValue = a[key];
                const bValue = b[key];
            
                if (aValue != null && bValue != null) {
                    if (aValue < bValue) {
                        return direction === 'ascending' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return direction === 'ascending' ? 1 : -1;
                    }
                }
                return 0;
            });
        }
        setSortedUsers(sortedArray);
    }, [users, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <h2>Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('nombre')}>Nombre</th>
                        <th onClick={() => requestSort('apellido')}>Apellido</th>
                        <th onClick={() => requestSort('email')}>Email</th>
                        <th onClick={() => requestSort('edad')}>Edad</th>
                        {/* ... más encabezados de columna ... */}
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.email}</td>
                            <td>{user.edad}</td>
                            {/* ... más celdas ... */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
