import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';
import { SortArrow } from './SortArrow';
import { UserFormModal } from './UserFormModal';

export const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User, direction: string } | null>(null);

    const [isAddingUser, setIsAddingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

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
            const { key, direction } = sortConfig;
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

    const deleteUser = async (id: number) => {
        const shouldDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
        if (shouldDelete) {
            // Lógica para eliminar el usuario mediante API.
            try {
                await fetch(`/api/usuarios/${id}`, {
                    method: 'DELETE',
                });
                setUsers(users.filter(user => user.id !== id)); // Actualiza la lista de usuarios en el estado.
            } catch (error) {
                console.error("Error deleting user: ", error);
            }
        }
    };

    const handleAddUser = (user: User) => {
        setIsAddingUser(false);
    }

    const handleEditUser = (user: User) => {
        setEditingUser(null);
    };

    return (
        <div>
            <h2>Usuarios</h2>
            <button onClick={() => setIsAddingUser(true)}>Añadir Usuario</button>
            <UserFormModal
                isOpen={isAddingUser}
                onClose={() => setIsAddingUser(false)}
                onSave={handleAddUser}
            />

            {editingUser && (
                <UserFormModal
                    isOpen={true}
                    onClose={() => setEditingUser(null)}
                    onSave={handleEditUser}
                    initialData={editingUser} // Pasamos el usuario a editar como prop al modal
                />
            )}
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
                            <td>
                                <i 
                                    className="fa fa-pencil"
                                    style={{cursor: "pointer", marginRight: "10px"}}
                                    onClick={() => setEditingUser(user)}
                                />
                                <i 
                                    className="fa fa-trash"
                                    style={{cursor: "pointer"}}
                                    onClick={() => deleteUser(user.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
