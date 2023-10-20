import React, { useEffect, useState } from "react";
import { Institucion } from "../interface/Institucion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import {
  fetchInstituciones,
  addInstitucion,
  deleteInstitucion,
  updateInstitucion
} from "../services/Institucion.services";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Suponiendo que también tienes un modal para Institucion, similar al de Admin
import { InstitucionFormModal } from "./InstitucionFormModal";

const buttonStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    backgroundColor: "navy",
    color: "white",
    border: "0px",
    marginInline: "25px",
    margin: "2px", // Set margin
    borderRadius: "5px",
    padding: "2px 10px", // Set padding to match margin (adjust as needed)
    textTransform: "none",
  };
  
  const headerStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "navy",
    fontSize: "15px",
  };
  
  const wordLabelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "navy",
    fontSize: "25px",
    marginTop: "20px",
  };

export const InstitucionTable: React.FC = () => {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [isAddingInstitucion, setIsAddingInstitucion] = useState(false);
  const [editingInstitucion, setEditingInstitucion] = useState<Institucion | null>(null);

  useEffect(() => {
    const loadInstituciones = async () => {
      try {
        const institucionesList = await fetchInstituciones();
        setInstituciones(institucionesList);
      } catch (error) {
        console.error("Error fetching instituciones: ", error);
      }
    };
    loadInstituciones();
  }, []);

  const handleAddInstitucion = async (institucion: Institucion) => {
    try {
      const newInstitucion = await addInstitucion(institucion);
      const updatedInstitucion = await fetchInstituciones();
      setInstituciones(updatedInstitucion);
      return newInstitucion;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteInstitucion = async (id: number) => {
      try {
        await deleteInstitucion(id);
        const updatedInstitucion = await fetchInstituciones();
        setInstituciones(updatedInstitucion);
      } catch (error) {
        console.error("Error borrando admin: ", error);
      }
  };

  const handleEditInstitucion = async (institucion: Institucion): Promise<Institucion> => {
    try {
        const updatedInstitucion = await updateInstitucion(institucion);
        
        setInstituciones(prevInstituciones => {
            return prevInstituciones.map(inst => 
                inst.idinstitucion === updatedInstitucion.idinstitucion ? updatedInstitucion : inst
            );
        });

        return updatedInstitucion;  // Devolver la institución actualizada
    } catch (error) {
        console.error("Error actualizando admin: ", error);
        throw error;
    }
};

  return (
    <div style={{ margin: "20px" }}>
      <h2 style={wordLabelStyle}>Instituciones</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsAddingInstitucion(true)}
        style={buttonStyle}
      >
        Añadir Institucion
      </Button>
      <InstitucionFormModal
        isOpen={isAddingInstitucion}
        onClose={() => setIsAddingInstitucion(false)}
        onSave={handleAddInstitucion}
      />
      {editingInstitucion && (
        <InstitucionFormModal
          isOpen={true}
          onClose={() => setEditingInstitucion(null)}
          // Asegúrate de tener una función de edición, similar a handleEditAdmin
          onSave={handleEditInstitucion}
          initialData={editingInstitucion}
        />
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={headerStyle}>Nombre Institucion</TableCell>
            <TableCell style={headerStyle}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instituciones.map((institucion) => (
            <TableRow key={institucion.idinstitucion}>
              <TableCell>{institucion.nombre_institucion}</TableCell> {/* Asumiendo que tiene una propiedad 'name' */}
              <TableCell>
                <EditIcon
                  onClick={() => setEditingInstitucion(institucion)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
                <DeleteIcon
                  onClick={() => {handleDeleteInstitucion(institucion.idinstitucion!)}}
                  style={{ cursor: "pointer" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
