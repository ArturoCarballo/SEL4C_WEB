import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';

export const UserTable: React.FC = () => {
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
            <h2>Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Edad</th>
                        <th>Sexo</th>
                        <th>Grado Académico</th>
                        <th>Institución</th>
                        <th>País</th>
                        <th>Disciplina</th>
                        {/* Agregar más columnas según sea necesario */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.nombre}</td>
                            <td>{user.apellido}</td>
                            <td>{user.email}</td>
                            <td>{user.edad}</td>
                            <td>{user.sexo}</td>
                            <td>{user.grado_academico}</td>
                            <td>{user.institucion}</td>
                            <td>{user.pais}</td>
                            <td>{user.disciplina}</td>
                            {/* Agregar más celdas según sea necesario */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
