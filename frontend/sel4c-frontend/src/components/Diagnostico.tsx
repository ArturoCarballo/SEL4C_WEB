import React, { useEffect, useState } from "react";
import { fetchPreguntasWithFilters } from "../services/Preguntas.services";
import { Preguntas } from "../interface/Preguntas";
import SimplePieChart from "./SimplePieChart";
import QuestionSelector from "./QuestionSelector";

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

  const [selectedQuestion, setSelectedQuestion] = useState<number>(1);
  const [selectedCuestionario, setSelectedCuestionario] = useState<number>(1);

  useEffect(() => {
    const loadPreguntas = async () => {
      try {
        const usersPreguntas = await fetchPreguntasWithFilters(
          selectedCuestionario,
          filters,
          selectedQuestion
        );
        setPreguntas(usersPreguntas);
      } catch (error) {
        console.error("Error fetching preguntas: ", error);
      }
    };

    loadPreguntas();
  }, [filters, selectedCuestionario, selectedQuestion]);

  const processDataForChart = (preguntas: Preguntas[]) => {
    const labels = [
      "Nada de acuerdo",
      "Poco de acuerdo",
      "Ni de acuerdo ni desacuerdo",
      "De acuerdo",
      "Muy de acuerdo",
    ];

    return labels.map((label) => {
      const value = preguntas.filter((p) => p.answer === label).length;
      return { name: label, value };
    });
  };

  const wordLabelStyle = {
    fontWeight: "bold",
    color: "navy",
    fontSize: "25px",
    marginInline: "20px",
  };

  const titleStyle = {
    fontWeight: "bold",
    color: "navy",
    fontSize: "40px",
    marginInline: "20px",
  };

  const questionStyle = {
    fontWeight: "bold",
    color: "black",
    fontSize: "40px",
    marginInline: "20px",
    marginLeft: "50px",
  };

  const chartData = processDataForChart(preguntas);

  return (
    <div>
      <h2 style={titleStyle}>Diagnósticos</h2>
      <h1 style={questionStyle}>
        {preguntas.length > 0 ? preguntas[0].pregunta : "Cargando pregunta..."}
      </h1>
      <QuestionSelector
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        selectedCuestionario={selectedCuestionario}
        setSelectedCuestionario={setSelectedCuestionario}
      />
      <div style={{ display: "flex" }}></div>
      <div style={{ display: "flex" }}>
        {/*aquí para que estén las dos a la vez*/}
        <div style={{ flex: 1 }}>
          <SimplePieChart data={chartData} />
          <h1 style={wordLabelStyle}>Inicial</h1>
        </div>
        <div style={{ flex: 1 }}>
          <SimplePieChart data={chartData} />
          <h1 style={wordLabelStyle}>Final</h1>
        </div>
      </div>
      {/* Otros componentes o elementos que quieras renderizar */}
    </div>
  );
};

export default Diagnostico;
