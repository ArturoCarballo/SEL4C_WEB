import React, { useEffect, useState } from "react";
import { Admin } from "../interface/Admin";
import { AdminFormModal } from "./AdminFormModal";
import { InstitucionTable } from "./InstitucionTable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
} from "@mui/material";
import {
  fetchAdmins,
  addAdmin,
  updateAdmin,
  deleteAdmin,
} from "../services/Admin.services";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutButton from "./LogoutButton";

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

export const AdminTable: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [sortedAdmins, setSortedAdmins] = useState<Admin[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Admin;
    direction: string;
  } | null>(null);

  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const adminsList = await fetchAdmins();
        setAdmins(adminsList);
      } catch (error) {
        console.error("Error fetching admins: ", error);
      }
    };
    loadAdmins();
  }, []);

  useEffect(() => {
    let sortedArray = [...admins];
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      sortedArray.sort((a: Admin, b: Admin) => {
        const aValue = a[key];
        const bValue = b[key];

        if (aValue != null && bValue != null) {
          if (aValue < bValue) {
            return direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return direction === "asc" ? 1 : -1;
          }
        }
        return 0;
      });
    }
    setSortedAdmins(sortedArray);
  }, [admins, sortConfig]);

  const requestSort = (key: keyof Admin) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDeleteAdmin = async (id: number) => {
    const authAdminId: string | null = localStorage.getItem("admin_id");
    const authAdminIdNumber: number = authAdminId ? parseInt(authAdminId) : -1;

    if (id === authAdminIdNumber) {
      alert("No puedes eliminarte a ti mismo.");
      return;
    }
    const shouldDelete = window.confirm(
      "¿Estás segurx de que quieres eliminar este admin?"
    );

    if (shouldDelete) {
      try {
        await deleteAdmin(id);
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== id)
        );
      } catch (error) {
        console.error("Error borrando admin: ", error);
      }
    }
  };

  const handleAddAdmin = async (admin: Admin) => {
    try {
      const newAdmin = await addAdmin(admin);
      const updatedAdmins = await fetchAdmins();
      setAdmins(updatedAdmins);
      return newAdmin;
    } catch (error) {
      console.error("Error agregando a admin: ", error);
      throw error;
    }
  };

  const handleEditAdmin = async (admin: Admin) => {
    const authAdminId: string | null = localStorage.getItem("admin_id");
    const authAdminIdNumber: number = authAdminId ? parseInt(authAdminId) : -1;
    if (admin.id !== authAdminIdNumber) {
      throw new Error("Solo puedes editar tu propia información.");
    }
    try {
      const updatedAdmin = await updateAdmin(admin);
      setAdmins((prevAdmins) =>
        prevAdmins.map((a) => (a.id === admin.id ? updatedAdmin : a))
      );
      return updatedAdmin;
    } catch (error) {
      console.error("Error actualizando admin: ", error);
      throw error;
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2 style={wordLabelStyle}>Admins</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsAddingAdmin(true)}
        style={buttonStyle}
      >
        Añadir Admin
      </Button>
      <AdminFormModal
        isOpen={isAddingAdmin}
        onClose={() => setIsAddingAdmin(false)}
        onSave={handleAddAdmin}
      />

      {editingAdmin && (
        <AdminFormModal
          isOpen={true}
          onClose={() => setEditingAdmin(null)}
          onSave={handleEditAdmin}
          initialData={editingAdmin}
        />
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortConfig?.key === "username"}
                direction={sortConfig?.direction as "asc" | "desc" | undefined}
                onClick={() => requestSort("username")}
                style={headerStyle}
              >
                Username
              </TableSortLabel>
            </TableCell>
            <TableCell style={headerStyle}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedAdmins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.username}</TableCell>
              <TableCell>
                <EditIcon
                  onClick={() => setEditingAdmin(admin)}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
                <DeleteIcon
                  onClick={() => handleDeleteAdmin(admin.id!)}
                  style={{ cursor: "pointer" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InstitucionTable></InstitucionTable>
    </div>
  );
};
