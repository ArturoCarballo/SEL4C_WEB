import React, { useEffect, useState } from "react";
import { fetchPreguntasWithFilters } from "../services/Preguntas.services";
import { Preguntas } from "../interface/Preguntas";
import SimplePieChart from "./SimplePieChart";
import QuestionSelector from "./QuestionSelector";
import html2canvas from "html2canvas";

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
  sexo: {
    Masculino: boolean;
    Femenino: boolean;
    "No binarie": boolean;
    "Prefiero no decir": boolean;
  };
};

interface DiagnosticoProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const Diagnostico: React.FC<DiagnosticoProps> = ({ filters, setFilters }) => {
  const [preguntas1, setPreguntas1] = useState<Preguntas[]>([]);
  const [preguntas2, setPreguntas2] = useState<Preguntas[]>([]);

  const [selectedQuestion, setSelectedQuestion] = useState<number>(1);
  const [selectedCuestionario, setSelectedCuestionario] = useState<number>(0);

  useEffect(() => {
    const loadPreguntas = async (cuestionario: number) => {
      try {
        const usersPreguntas = await fetchPreguntasWithFilters(
          cuestionario,
          filters,
          selectedQuestion
        );
        if(cuestionario === 1) {
          setPreguntas1(usersPreguntas);
        } else if(cuestionario === 2) {
          setPreguntas2(usersPreguntas);
        }
      } catch (error) {
        console.error("Error fetching preguntas: ", error);
      }
    };

    loadPreguntas(1);
    loadPreguntas(2);
  }, [filters, selectedCuestionario, selectedQuestion]);

  const chartRef1 = React.useRef(null);
  const chartRef2 = React.useRef(null);

  const downloadAsPNG = async (chartRef: React.RefObject<HTMLDivElement>, fileName: string) => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = fileName;
      a.click();
    }
  };

  const processDataForChart = (preguntas: Preguntas[]) => {
    const labels = [
      "Muy en desacuerdo",
      "En desacuerdo",
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

  const buttonStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    backgroundColor: "navy",
    color: "white",
    border: "0px",
    marginInline: "25px",
    margin: "2px",
    borderRadius: "5px",
    padding: "2px 10px",
    textTransform: "none",
    marginBottom: "15px",
  };
  
  const chartData1 = processDataForChart(preguntas1);
  const chartData2 = processDataForChart(preguntas2);

  return (
    <div>
      <h2 style={titleStyle}>Diagnósticos</h2>
      <h1 style={questionStyle}>
        {preguntas1.length > 0 ? preguntas1[0].pregunta : "Cargando pregunta..."}
      </h1>
      <QuestionSelector
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        selectedCuestionario={selectedCuestionario}
        setSelectedCuestionario={setSelectedCuestionario}
      />
      <button style={buttonStyle} onClick={() => downloadAsPNG(chartRef1, "Inicial.png")}>Descargar Inicial como PNG</button>
      <button style={buttonStyle} onClick={() => downloadAsPNG(chartRef2, "Final.png")}>Descargar Final como PNG</button>
      <div style={{ display: "flex" }}></div>
      <div style={{ display: "flex" }}>
        {/*aquí para que estén las dos a la vez*/}
        <div style={{ flex: 1 }} ref={chartRef1}>
          <SimplePieChart data={chartData1} />
          <h1 style={wordLabelStyle}>Inicial</h1>
        </div>
        <div style={{ flex: 1 }} ref={chartRef2}>
          <SimplePieChart data={chartData2} />
          <h1 style={wordLabelStyle}>Final</h1>
        </div>
      </div>
    </div>
  );
};

export default Diagnostico;
