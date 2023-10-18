import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchCompetencias } from '../services/Grafica.services';
import { DataEntry } from '../interface/DataEntry';
import { useParams } from 'react-router-dom';

const processData = (data: DataEntry[]): {name: string, value: number}[] => {
    const resultMap = new Map<string, number>();

    data.forEach(entry => {
        resultMap.set(entry.competenciacol, (resultMap.get(entry.competenciacol) || 0) + 1);
    });

    return Array.from(resultMap).map(([name, value]) => ({ name, value }));
}

interface CompetenciasChartProps {
    id?: number;
    idcuestionario: number;
}

const CompetenciasChart: React.FC<CompetenciasChartProps> = ({ id, idcuestionario }) => {
    const [chartData, setChartData] = useState<{name: string, value: number}[]>([]);
    const { idusuario } = useParams<{ idusuario: string }>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawData = await fetchCompetencias(id!, idcuestionario);
                const processedData = processData(rawData);
                setChartData(processedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [id, idcuestionario]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawData = await fetchCompetencias(Number(idusuario), idcuestionario);
                const processedData = processData(rawData);
                setChartData(processedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, [idusuario, idcuestionario]);

    return (
        <BarChart
            width={800}
            height={600}
            data={chartData}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={260} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
    );
}

export default CompetenciasChart;
