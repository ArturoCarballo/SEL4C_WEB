import React from "react";

interface QuestionSelectorProps {
  selectedQuestion: number;
  setSelectedQuestion: (question: number) => void;
  selectedCuestionario: number;
  setSelectedCuestionario: (cuestionario: number) => void;
}
const wordLabelStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "navy",
  fontSize: "25px",
  marginInline: "20px",
};

const autofillStyle: React.CSSProperties = {
  width: "60px",
  height: "30px",
  backgroundColor: "#dfecff",
  marginInline: "15px",
  fontWeight: "bold",
  color: "navy",
  fontSize: "15px",
  borderRadius: "15px",
};

const QuestionSelector: React.FC<QuestionSelectorProps> = ({
  selectedQuestion,
  setSelectedQuestion,
  selectedCuestionario,
  setSelectedCuestionario,
}) => {
  return (
    <div>
      <label style={wordLabelStyle}>
        Selecciona Pregunta:
        <select
          style={autofillStyle}
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(Number(e.target.value))}
        >
          {/* Por ahora asumimos que hay 50 preguntas, ajusta según sea necesario */}
          {[...Array(50)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>

      <label>
        Selecciona Cuestionario:
        <select
          value={selectedCuestionario}
          onChange={(e) => setSelectedCuestionario(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </label>
    </div>
  );
};

export default QuestionSelector;
