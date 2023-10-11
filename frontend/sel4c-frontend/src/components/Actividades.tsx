import React from "react";
import { Typography, LinearProgress } from "@mui/material";

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
};

const activityStyle: React.CSSProperties = {
  flexDirection: "row", // Change to row to display progress bars horizontally
  display: "flex",
  alignItems: "center", // Align items vertically in the center
  margin: "10px",
  padding: "20px",
  fontWeight: "bold",
  color: "black",
  fontSize: "15px",
};

const activitiesData: { name: string; progress: number }[] = [
  { name: "Actividad 1", progress: 100 },
  { name: "Actividad 2", progress: 80 },
  { name: "Actividad 3", progress: 60 },
  { name: "Actividad 4", progress: 40 },
  { name: "Actividad 5", progress: 20 },
];

const Actividades: React.FC = () => {
  return (
    <div>
      <h2 style={titleStyle}>Actividades</h2>
      <h3 style={wordLabelStyle}>Progreso:</h3>
      {activitiesData.map((activity, index) => (
        <div key={index} style={activityStyle}>
          <Typography>{activity.name}</Typography>
          <LinearProgress variant="determinate" value={activity.progress} />
        </div>
      ))}
    </div>
  );
};

export default Actividades;
