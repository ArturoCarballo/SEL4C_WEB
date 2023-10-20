import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchCompetencias } from '../services/Grafica.services';
import { DataEntry } from '../interface/DataEntry';
import { useParams } from 'react-router-dom';

const processData = (data: DataEntry[]): { name: string, value: number }[] => {
    const resultMap = new Map<string, Array<number>>();

    data.forEach(entry => {
        if (!resultMap.has(entry.competenciacol)) {
            resultMap.set(entry.competenciacol, []);
        }
        resultMap.get(entry.competenciacol)!.push(entry.idanswer);
    });

    return Array.from(resultMap).map(([name, values]) => ({ name, value: values.reduce((acc, val) => acc + val, 0) }));
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
                console.log(processedData);
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
            width={500}
            height={400}
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
