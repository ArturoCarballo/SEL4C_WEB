import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';
import { UserFormModal } from './UserFormModal';
import FilterComponent from './FilterComponent';

import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Button } from '@mui/material';
import { fetchUsersWithFilters, addUser, updateUser, deleteUser } from '../services/User.services';
import TablePagination from '@mui/material/TablePagination';
import UserProfile from './UserProfile';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutButton from './LogoutButton';

export const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [sortedUsers, setSortedUsers] = useState<User[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User, direction: string } | null>(null);

    const [isAddingUser, setIsAddingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const displayedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [filters, setFilters] = useState({
        nombre_pais: '',
        disciplina: '',
        grado_academico: '',
        nombre_institucion: ''
    });

    // useEffect(() => {
    //     const fetchUsersWithFilters = async () => {
    //         try {
    //             const response = await fetch('/api/usuarios'); // Ajusta esta URL si es necesario.
    //             let data = await response.json();

    //             if (filters.pais) {
    //                 data = data.filter((user: User) => user.pais === filters.pais);
    //             }

    //             if (filters.disciplina) {
    //                 data = data.filter((user: User) => user.disciplina === filters.disciplina);
    //             }

    //             if (filters.grado_academico) {
    //                 data = data.filter((user: User) => user.grado_academico === filters.grado_academico);
    //             }

    //             setUsers(data);
    //         } catch (error) {
    //             console.error("Error fetching users: ", error);
    //         }
    //     };

    //     fetchUsersWithFilters();
    // }, [filters]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersList = await fetchUsersWithFilters(filters);
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        loadUsers();
    }, [filters]);


    useEffect(() => {
        let sortedArray = [...users];
        if (sortConfig !== null) {
            const { key, direction } = sortConfig;
            sortedArray.sort((a: User, b: User) => {
                const aValue = a[key];
                const bValue = b[key];

                if (aValue != null && bValue != null) {
                    if (aValue < bValue) {
                        return direction === 'asc' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return direction === 'asc' ? 1 : -1;
                    }
                }
                return 0;
            });
        }
        setSortedUsers(sortedArray);
    }, [users, sortConfig]);



    const requestSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteUser = async (id: number) => {
        const shouldDelete = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
        if (shouldDelete) {
            try {
                await deleteUser(id);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id)); // Actualiza la lista de usuarios en el estado.
            } catch (error) {
                console.error("Error deleting user: ", error);
            }
        }
    };

    const handleAddUser = async (user: User) => {
        try {
            const newUser = await addUser(user);
            const updatedUsers = await fetchUsersWithFilters(filters);
            setUsers(updatedUsers);
            return newUser;
        } catch (error) {
            console.error("Error adding user: ", error);
            throw error;
        }
    };

    if (selectedUser) {
        return <UserProfile user={selectedUser} />;
    }

    const handleEditUser = async (user: User) => {
        try {
            const updatedUser = await updateUser(user);

            const updatedUsersList = await fetchUsersWithFilters(filters);
            setUsers(updatedUsersList);

            return updatedUser;
        } catch (error) {
            console.error("Error updating user: ", error);
            throw error;
        }
    };


    return (
        <div>
            <FilterComponent filters={filters} setFilters={setFilters} />
            <h2>Usuarios</h2>
            <Button variant="contained" color="primary" onClick={() => setIsAddingUser(true)}>
                Añadir Usuario
            </Button>
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
                    initialData={editingUser}
                />
            )}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'nombre'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('nombre')}
                            >
                                Nombre
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'apellido'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('apellido')}
                            >
                                Apellido
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'email'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('email')}
                            >
                                Email
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'edad'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('edad')}
                            >
                                Edad
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'sexo'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('sexo')}
                            >
                                Sexo
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'disciplina'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('disciplina')}
                            >
                                Disciplina
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'grado_academico'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('grado_academico')}
                            >
                                Grado Academico
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'nombre_institucion'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('nombre_institucion')}
                            >
                                Institucion
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'nombre_pais'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('nombre_pais')}
                            >
                                Pais
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayedUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.nombre}</TableCell>
                            <TableCell>{user.apellido}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.edad}</TableCell>
                            <TableCell>{user.sexo}</TableCell>
                            <TableCell>{user.disciplina}</TableCell>
                            <TableCell>{user.grado_academico}</TableCell>
                            <TableCell>{user.nombre_institucion}</TableCell>
                            <TableCell>{user.nombre_pais}</TableCell>
                            
                            <TableCell>
                                <EditIcon onClick={() => setEditingUser(user)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                                <DeleteIcon onClick={() => handleDeleteUser(user.id!)} style={{ cursor: 'pointer' }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={sortedUsers.length}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                labelRowsPerPage="Usuarios por página:"
            />
            <LogoutButton></LogoutButton>
        </div>
    );
}
