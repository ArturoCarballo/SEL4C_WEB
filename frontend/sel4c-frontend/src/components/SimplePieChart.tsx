import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['red', '#ff6600', 'orange', '#66ff33', 'blue'];

interface SimplePieChartData {
    name: string;
    value: number;
}

interface SimplePieChartProps {
    data: SimplePieChartData[];
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({ data }) => {
    return (
        <PieChart width={400} height={400}>
            <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
            >
                {
                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    );
}

export default SimplePieChart;