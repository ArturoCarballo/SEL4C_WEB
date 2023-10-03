import React, { useEffect, useState } from 'react';
import { Usuario } from '../Usuario';
import ListaUsuarios from './ListaUsuarios';


const Usuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('/api/usuarios');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const agregarUsuario = async (usuario: Usuario) => {
        try {
            await fetch('/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario),
            });
            fetchUsuarios();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const actualizarUsuario = async (id: number, usuario: Usuario) => {
        try {
            await fetch(`/api/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario),
            });
            fetchUsuarios();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const eliminarUsuario = async (id: number) => {
        try {
            await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
            fetchUsuarios();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <h1>Usuarios</h1>
            <ListaUsuarios usuarios={usuarios} eliminarUsuario={eliminarUsuario} />
            {/* Aquí también puedes renderizar FormularioUsuario y pasarle agregarUsuario/actualizarUsuario según sea necesario */}
        </div>
    );
};

export default Usuarios;