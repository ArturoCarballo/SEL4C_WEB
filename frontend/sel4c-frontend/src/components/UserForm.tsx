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

    return (
        <div>
            <h2>Añadir Usuario</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={user.nombre} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Apellido:
                    <input type="text" name="apellido" value={user.apellido} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" value={user.email} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Edad:
                    <input type="number" name="edad" value={user.edad} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Sexo:
                    <select name="sexo" value={user.sexo} onChange={handleChange} required>
                        <option value="" disabled>Seleccione</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                    </select>
                </label>
                <br />
                <label>
                    Grado Académico:
                    <select name="grado_academico" value={user.grado_academico} onChange={handleChange} required>
                        <option value="" disabled>Seleccione</option>
                        <option value="Pregrado">Pregrado</option>
                        <option value="Posgrado">Posgrado</option>
                        <option value="Educacion continua">Educacion continua</option>
                    </select>
                </label>
                <br />
                <label>
                    Institución:
                    <select name="institucion" value={user.institucion} onChange={handleChange} required>
                        <option value="" disabled>Seleccione</option>
                        <option value="Tecnologico de Monterrey">Tecnologico de Monterrey</option>
                        <option value="Otros">Otros</option>
                    </select>
                </label>
                <br />
                <label>
                    País:
                    <input type="text" name="pais" value={user.pais} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Disciplina:
                    <select name="disciplina" value={user.disciplina} onChange={handleChange} required>
                        <option value="" disabled>Seleccione</option>
                        <option value="Ingenieria Y Ciencias">Ingenieria Y Ciencias</option>
                        <option value="Humanidades y Educacion">Humanidades y Educacion</option>
                        <option value="Ciencias Sociales">Ciencias Sociales</option>
                        <option value="Ciencias de la Salud">Ciencias de la Salud</option>
                        <option value="Arquitectura Arte y Diseño">Arquitectura Arte y Diseño</option>
                        <option value="Negocios">Negocios</option>
                    </select>
                </label>
                <br />
                <button type="submit">Añadir Usuario</button>
            </form>
        </div>
    );
}
