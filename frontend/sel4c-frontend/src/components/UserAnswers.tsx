import React, { useState, useEffect } from 'react';
import { Respuesta } from '../interface/Respuesta';
import { fetchRespuestas } from '../services/Respuesta.service';

interface UserAnswersProps {
    id: number;
    idcuestionario: number;
}


export function UserAnswers({ id, idcuestionario }: UserAnswersProps) {
    const [respuestas, setRespuestas] = useState<Respuesta[]>([]);

    console.log(respuestas);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchRespuestas(id, idcuestionario);
                setRespuestas(data);
            } catch (error) {
                console.error("Error loading user answers:", error);
            }
        };

        loadData();
    }, [id, idcuestionario]);

    return (
        <div>
            <h2>Respuestas del Usuario</h2>
            <ul>
                <h1>Cuestionario {idcuestionario}</h1>
                {respuestas.map((respuesta, index) => (
                    <li key={index}>
                        <strong>Pregunta:</strong> {respuesta.pregunta} <br />
                        <strong>Respuesta:</strong> {respuesta.answer}
                    </li>
                ))}
            </ul>
        </div>
    );
}
