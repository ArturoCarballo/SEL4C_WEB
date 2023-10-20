import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { act } from "@testing-library/react";
import { fetchUsersWithFilters } from "../services/User.services";

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

interface ActividadesProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

const titleStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "navy",
  fontSize: "40px",
  marginInline: "20px",
};

const wordLabelStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "navy",
  fontSize: "25px",
  marginTop: "20px",
  whiteSpace: "nowrap",
  width: "150px",
  marginInline: "70px",
};

const percentageStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "black",
  fontSize: "15px",
  whiteSpace: "nowrap",
};

const activityStyle: React.CSSProperties = {
  flexDirection: "row",
  display: "flex",
  alignItems: "center",
  fontWeight: "bold",
  color: "black",
  fontSize: "15px",
};

const progressStyle: React.CSSProperties = {
  width: "200px",
  marginTop: "35px",
};

const activityProgressMapping = {
  "Actividad 1": { min: 1, max: 4 },
  "Actividad 2": { min: 5, max: 7 },
  "Actividad 3": { min: 8, max: 10 },
  "Actividad 4": { min: 11, max: 12 },
  "Entrega final": { min: 13, max: 15 },
};

const calculateGeneralProgress = (usersProgress: number[]): { name: string; progress: number }[] => {
  let activitiesProgress = [];

  for (let activity in activityProgressMapping) {
    let range = activityProgressMapping[activity as keyof typeof activityProgressMapping];
    let totalUsersInActivityRange = usersProgress.filter(p => p >= range.min && p <= range.max).length;

    // Aquí, puedes adaptar la fórmula de cálculo según tu lógica de negocio
    let progressPercentage = parseFloat(((totalUsersInActivityRange / usersProgress.length) * 100).toFixed(2));
    activitiesProgress.push({ name: activity, progress: progressPercentage });
  }

  return activitiesProgress;
};

export const fetchGeneralActivityProgress = async (filters: any): Promise<{ name: string; progress: number }[]> => {
  // Obtener todos los usuarios con filtros
  const users = await fetchUsersWithFilters(filters);

  // Extraer solo la columna 'progreso' de cada usuario
  const usersProgress = users.map(user => user.progreso);

  // Calcular el progreso general con la función que se definió anteriormente
  const activitiesData = calculateGeneralProgress(usersProgress);

  return activitiesData;
}


const Actividades: React.FC<ActividadesProps> = ({ filters, setFilters }) => {
  const [activitiesData, setActivitiesData] = useState<{ name: string; progress: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGeneralActivityProgress(filters);
        setActivitiesData(data);
      } catch (error) {
        console.error("Error fetching preguntas: ", error);
      }
    };
    fetchData();
  }, [filters]);
  return (
    <div>
      <h2 style={titleStyle}>Actividades</h2>
      <h3
        style={{
          fontWeight: "bold",
          color: "black",
          fontSize: "40px",
          marginLeft: "50px",
        }}
      >
        Progreso:
      </h3>
      {activitiesData.map((activity, index) => (
        <div key={index} style={activityStyle}>
          <Typography style={wordLabelStyle}>{activity.name}</Typography>
          <Box sx={progressStyle}>
            <LinearProgress
              color="primary"
              variant="determinate"
              value={activity.progress}
              sx={{ borderRadius: "30px", height: "20px", width: "100%" }}
            />
            <Typography style={percentageStyle}>
              {activity.progress}%
            </Typography>
          </Box>
        </div>
      ))}
    </div>
  );
};

export default Actividades;
