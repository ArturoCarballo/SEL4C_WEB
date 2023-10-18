import React from "react";
import { Button } from "@mui/material";

const LogoutButton: React.FC = () => {
  const logout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  };

  return (
    <Button
      style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "red",
        marginInline: "2px",
        margin: "2px", // Set margin
        borderRadius: "5px",
        padding: "2px 10px", // Set padding to match margin (adjust as needed)
        textTransform: "none",
      }}
      onClick={logout}
    >
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton;
