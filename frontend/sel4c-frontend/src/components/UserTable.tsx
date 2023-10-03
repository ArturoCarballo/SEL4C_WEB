import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';
import { SortArrow } from './SortArrow';

export const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User, direction: string } | null>(null);

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
                        <th onClick={() => requestSort('nombre')}>
                            Nombre {sortConfig?.key === 'nombre' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('apellido')}>
                            Apellido {sortConfig?.key === 'apellido' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('email')}>
                            Email {sortConfig?.key === 'email' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('edad')}>
                            Edad {sortConfig?.key === 'edad' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('sexo')}>
                            Sexo {sortConfig?.key === 'sexo' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('disciplina')}>
                            Disciplina {sortConfig?.key === 'disciplina' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('institucion')}>
                            Institucion {sortConfig?.key === 'institucion' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('grado_academico')}>
                            Grado Academico {sortConfig?.key === 'grado_academico' && <SortArrow direction={sortConfig.direction} />}
                        </th>
                        <th onClick={() => requestSort('pais')}>
                            Pais {sortConfig?.key === 'pais' && <SortArrow direction={sortConfig.direction} />}
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.email}</td>
                            <td>{user.edad}</td>
                            <td>{user.sexo}</td>
                            <td>{user.disciplina}</td>
                            <td>{user.institucion}</td>
                            <td>{user.grado_academico}</td>
                            <td>{user.pais}</td>
                            {/* ... más celdas ... */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
