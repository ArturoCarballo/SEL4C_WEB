import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Institucion } from '../interface/Institucion';
import { fetchInstituciones } from '../services/Institucion.services';
import { fetchPaises } from '../services/Pais.services';
import { Pais } from '../interface/Pais';

interface FilterComponentProps {
    filters: {
        nombre_pais: string;
        disciplina: string;
        grado_academico: string;
        nombre_institucion: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        nombre_pais: string;
        disciplina: string;
        grado_academico: string;
        nombre_institucion: string;
    }>>;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ filters, setFilters }) => {
    const [instituciones, setInstituciones] = useState<Institucion[]>([]);
    const [paises, setPaises] = useState<Pais[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchInstituciones();
                setInstituciones(data);
            } catch (error) {
                console.error("Error fetching instituciones: ", error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchPaises();
                setPaises(data);
            } catch (error) {
                console.error("Error fetching instituciones: ", error);
            }
        };

        loadData();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
        const name = event.target.name as keyof typeof filters;
        setFilters({
            ...filters,
            [name]: event.target.value as string
        });
        console.log(filters);
    };

    return (
        <div>
            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="pais-label">País</InputLabel>
                <Select
                    labelId="pais-label"
                    id="nombre_pais"
                    name="nombre_pais"
                    value={filters.nombre_pais || ""}
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Todos</MenuItem>
                    {paises.map(pais => (
                        <MenuItem key={pais.id} value={pais.nombre_pais}>
                            {pais.nombre_pais}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="disciplina-label">Disciplina</InputLabel>
                <Select
                    labelId="disciplina-label"
                    id="disciplina"
                    name="disciplina"
                    value={filters.disciplina || ""}
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value={'Ingenieria Y Ciencias'}>Ingeniería y Ciencias</MenuItem>
                    <MenuItem value={'Humanidades y Educacion'}>Humanidades y Educación</MenuItem>
                    {/* ... otros valores de disciplina ... */}
                </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="grado_academico-label">Grado Académico</InputLabel>
                <Select
                    labelId="grado_academico-label"
                    id="grado_academico"
                    name="grado_academico"
                    value={filters.grado_academico || ""}
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value={'Pregrado'}>Pregrado</MenuItem>
                    <MenuItem value={'Posgrado'}>Posgrado</MenuItem>
                    <MenuItem value={'Educacion continua'}>Educación continua</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="nombre_institucion-label">Institucion</InputLabel>
                <Select
                    labelId="nombre_institucion-label"
                    id="nombre_institucion"
                    name="nombre_institucion"
                    value={filters.nombre_institucion || ""}
                    onChange={handleFilterChange}
                >
                    <MenuItem value="">Todos</MenuItem>
                    {instituciones.map(institucion => (
                        <MenuItem key={institucion.idinstitucion} value={institucion.nombre_institucion}>
                            {institucion.nombre_institucion}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default FilterComponent;
