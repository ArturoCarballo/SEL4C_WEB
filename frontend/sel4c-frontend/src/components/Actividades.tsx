import React from "react";
import { Typography, Box } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { act } from "@testing-library/react";

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

const activitiesData: { name: string; progress: number }[] = [
  { name: "Actividad 1", progress: 100 }, //ya en porcentaje
  { name: "Actividad 2", progress: 80 },
  { name: "Actividad 3", progress: 60 },
  { name: "Actividad 4", progress: 40 },
  { name: "Entrega final", progress: 20 },
];

const progressStyle: React.CSSProperties = {
  width: "200px",
  marginTop: "35px",
};

const Actividades: React.FC = () => {
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
