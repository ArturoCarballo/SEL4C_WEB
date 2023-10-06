import React, { useEffect, useState } from 'react';
import { Admin } from '../interface/Admin';
import { AdminFormModal } from './AdminFormModal';

import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Button } from '@mui/material';
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from '../services/Admin.services';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutButton from './LogoutButton';

export const AdminTable: React.FC = () => {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [sortedAdmins, setSortedAdmins] = useState<Admin[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Admin, direction: string } | null>(null);

    const [isAddingAdmin, setIsAddingAdmin] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

    useEffect(() => {
        const loadAdmins = async () => {
            try {
                const adminsList = await fetchAdmins();
                setAdmins(adminsList);
            } catch (error) {
                console.error("Error fetching admins: ", error);
            }
        };
        loadAdmins();
    }, []);
    

    useEffect(() => {
        let sortedArray = [...admins];
        if (sortConfig !== null) {
            const { key, direction } = sortConfig;
            sortedArray.sort((a: Admin, b: Admin) => {
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
        setSortedAdmins(sortedArray);
    }, [admins, sortConfig]);

    const requestSort = (key: keyof Admin) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteAdmin= async (id: number) => {
        const shouldDelete = window.confirm('¿Estás seguro de que quieres eliminar este admin?');
        if (shouldDelete) {
            try {
                await deleteAdmin(id);
                setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== id));
            } catch (error) {
                console.error("Error deleting admin: ", error);
            }
        }
    };

    const handleAddAdmin = async (admin: Admin) => {
        try {
            const newAdmin = await addAdmin(admin);
            const updatedAdmins = await fetchAdmins();
            setAdmins(updatedAdmins); 
            return newAdmin;
        } catch (error) {
            console.error("Error adding admin: ", error);
            throw error;
        }
    };
    
    

    const handleEditAdmin = async (admin: Admin) => {
        try {
            const updatedAdmin = await updateAdmin(admin);
            setAdmins(prevAdmins => prevAdmins.map(a => a.id === admin.id ? updatedAdmin : a));
            return updatedAdmin;
        } catch (error) {
            console.error("Error updating admin: ", error);
            throw error;
        }
    };
    

    return (
        <div>
            <h2>Admins</h2>
            <Button variant="contained" color="primary" onClick={() => setIsAddingAdmin(true)}>
                Añadir Admin
            </Button>
            <AdminFormModal
                isOpen={isAddingAdmin}
                onClose={() => setIsAddingAdmin(false)}
                onSave={handleAddAdmin}
            />

            {editingAdmin && (
                <AdminFormModal
                    isOpen={true}
                    onClose={() => setEditingAdmin(null)}
                    onSave={handleEditAdmin}
                    initialData={editingAdmin}
                />
            )}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={sortConfig?.key === 'username'}
                                direction={sortConfig?.direction as 'asc' | 'desc' | undefined}
                                onClick={() => requestSort('username')}
                            >
                                Username
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedAdmins.map((admin) => (
                        <TableRow key={admin.id}>
                            <TableCell>{admin.username}</TableCell>
                            <TableCell>
                                <EditIcon onClick={() => setEditingAdmin(admin)} style={{cursor: 'pointer', marginRight: '10px'}} />
                                <DeleteIcon onClick={() => handleDeleteAdmin(admin.id!)} style={{cursor: 'pointer'}} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <LogoutButton></LogoutButton>
        </div>
    );
}
