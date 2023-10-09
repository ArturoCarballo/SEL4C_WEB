import React from 'react';

interface QuestionSelectorProps {
    selectedQuestion: number;
    setSelectedQuestion: (question: number) => void;
    selectedCuestionario: number;
    setSelectedCuestionario: (cuestionario: number) => void;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({ 
    selectedQuestion, setSelectedQuestion, 
    selectedCuestionario, setSelectedCuestionario 
}) => {
    return (
        <div>
            <label>
                Selecciona Pregunta:
                <select value={selectedQuestion} onChange={(e) => setSelectedQuestion(Number(e.target.value))}>
                    {/* Por ahora asumimos que hay 50 preguntas, ajusta según sea necesario */}
                    {[...Array(50)].map((_, index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                    ))}
                </select>
            </label>

            <label>
                Selecciona Cuestionario:
                <select value={selectedCuestionario} onChange={(e) => setSelectedCuestionario(Number(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                </select>
            </label>
        </div>
    );
}

export default QuestionSelector;
