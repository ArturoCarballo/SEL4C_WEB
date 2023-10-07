import { useState } from 'react';
import { UserTable } from '../components/UserTable';
import FilterComponent from '../components/FilterComponent';


const Usuarios: React.FC = () => {
    const [filters, setFilters] = useState({
        nombre_pais: '',
        disciplina: '',
        grado_academico: '',
        nombre_institucion: '',
        minEdad: 0,
        maxEdad: 100,
        nombre: '',
        apellido: '',
        email: ''
      });
      return (
        <div>
            <h1>Usuarios</h1>
            <FilterComponent filters={filters} setFilters={setFilters} />
            <UserTable filters={filters} setFilters={setFilters} />
        </div>
      );
}

export default Usuarios;
