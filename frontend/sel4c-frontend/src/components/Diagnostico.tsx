import React, { useEffect, useState } from 'react';
import { fetchPreguntasWithFilters } from '../services/Preguntas.services';
import { Preguntas } from '../interface/Preguntas';

type FiltersType = {
    nombre_pais: string;
    disciplina: string;
    grado_academico: string;
    nombre_institucion: string;
    minEdad: number;
    maxEdad: number;
    nombre: string;
    apellido: string;
    email: string;
    sexo: string;
};

interface DiagnosticoProps {
    filters: FiltersType;
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const Diagnostico: React.FC<DiagnosticoProps> = ({ filters, setFilters }) => {
    const [preguntas, setPreguntas] = useState<Preguntas[]>([]);
    useEffect(() => {
        const loadPreguntas = async () => {
            try {
                const usersPreguntas= await fetchPreguntasWithFilters(filters);
                setPreguntas(usersPreguntas);
            } catch (error) {
                console.error("Error fetching preguntas: ", error);
            }
        };

        loadPreguntas();
    }, [filters]);
    

    return (
        <div>
            <h2>Diagnóstico</h2>
            <p>Aquí irá tu gráfica o cualquier contenido relacionado con el diagnóstico.</p>
        </div>
    );
}

export default Diagnostico;
