import CompetenciasChart from "../components/Grafica";

const GraficasPage: React.FC = () => {
    return (
        <div>
            <h1>Inicial</h1>
            <CompetenciasChart idcuestionario={1}></CompetenciasChart>
            <h1>Final</h1>
            <CompetenciasChart idcuestionario={2}></CompetenciasChart>
        </div>
        
    );

};

export default GraficasPage;