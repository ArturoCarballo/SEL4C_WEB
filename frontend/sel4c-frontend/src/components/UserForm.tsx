import React, { useState } from 'react';
import { User } from '../interface/User';

export const UserForm: React.FC = () => {
    const [user, setUser] = useState<User>({
        apellido: '',
        disciplina: '',
        email: '',
        edad: 0,
        sexo: '',
        grado_academico: '',
        institucion: '',
        nombre: '',
        pais: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            alert("Usuario añadido con éxito");
            setUser({
                apellido: '',
                disciplina: '',
                email: '',
                edad: 0,
                sexo: '',
                grado_academico: '',
                institucion: '',
                nombre: '',
                pais: ''
            });
        } catch (error) {
            console.error("Error adding user: ", error);
        }
    };

    // Add UI components for form input, and bind handleChange and handleSubmit appropriately

    return (
        <div>
            <h2>Añadir Usuario</h2>
            {/* Your form UI here */}
        </div>
    );
}
