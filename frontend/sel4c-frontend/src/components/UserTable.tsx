import React, { useEffect, useState } from "react";
import { User } from "../interface/User";
import { UserFormModal } from "./UserFormModal";
import { useNavigate, Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  Typography,
} from "@mui/material";
import {
  fetchUsersWithFilters,
  addUser,
  updateUser,
  deleteUser,
} from "../services/User.services";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import FilterComponent from "./FilterComponent";

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
    "No binario": boolean;
    "Prefiero no decir": boolean;
  };
};

const modalStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  color: "navy",
  fontSize: "25px",
  fontWeight: "bold",
};

const verticalPaginationStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
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

const headerStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "navy",
  fontSize: "15px",
  height: "20px",
};

const headercellStyle: React.CSSProperties = {
  backgroundColor: "#dfecff",
  color: "navy",
  fontSize: "15px",
  height: "20px",
  fontWeight: "bold",
};

const titleStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "navy",
  fontSize: "40px",
  overflow: "nowrap",
  marginInline: "20px",
};

const rowStyle: React.CSSProperties = {
  fontSize: "15px",
  whiteSpace: "nowrap",
  maxWidth: "75px",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

interface UserTableProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

export const UserTable: React.FC<UserTableProps> = ({
  filters,
  setFilters,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: string;
  } | null>(null);

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const displayedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const navigate = useNavigate();

  const handleRowClick = (user: User) => {
    navigate(`/perfil/${user.id}`, { replace: true });
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersList = await fetchUsersWithFilters(filters);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    loadUsers();
  }, [filters]);

  useEffect(() => {
    let sortedArray = [...users];
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      sortedArray.sort((a: User, b: User) => {
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
    setSortedUsers(sortedArray);
  }, [users, sortConfig]);

  const requestSort = (key: keyof User) => {
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

  const handleDeleteUser = async (id: number) => {
    const shouldDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este usuario?"
    );
    if (shouldDelete) {
      try {
        await deleteUser(id);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id)); // Actualiza la lista de usuarios en el estado.
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  const handleAddUser = async (user: User) => {
    try {
      const newUser = await addUser(user);
      const updatedUsers = await fetchUsersWithFilters(filters);
      setUsers(updatedUsers);
      return newUser;
    } catch (error) {
      console.error("Error adding user: ", error);
      throw error;
    }
  };

  const handleEditUser = async (user: User) => {
    try {
      const updatedUser = await updateUser(user);

      const updatedUsersList = await fetchUsersWithFilters(filters);
      setUsers(updatedUsersList);

      return updatedUser;
    } catch (error) {
      console.error("Error updating user: ", error);
      throw error;
    }
  };

  return (
    <div style={{ width: "500px" }}>
      <div style={{ flex: 1, marginRight: "20px" }}></div>
      <div style={{ flex: 2 }}>
        <h2 style={titleStyle}>Usuarios</h2>
        <Button style={buttonStyle} onClick={() => setIsAddingUser(true)}>
          Añadir Usuario
        </Button>
        <TablePagination
          component="div"
          count={sortedUsers.length}
          page={page}
          style={modalStyle}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
          labelRowsPerPage="Usuarios por página:"
          rowsPerPageOptions={[10, 25, 50, 100]}
          sx={verticalPaginationStyle}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "nombre"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("nombre")}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "apellido"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("apellido")}
                >
                  Apellido
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "email"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "edad"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("edad")}
                >
                  Edad
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "sexo"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("sexo")}
                >
                  Sexo
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "disciplina"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("disciplina")}
                >
                  Disciplina
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "grado_academico"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("grado_academico")}
                >
                  Grado Académico
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "nombre_institucion"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("nombre_institucion")}
                >
                  Institución
                </TableSortLabel>
              </TableCell>

              <TableCell style={headercellStyle}>
                <TableSortLabel
                  style={headerStyle}
                  active={sortConfig?.key === "nombre_pais"}
                  direction={
                    sortConfig?.direction as "asc" | "desc" | undefined
                  }
                  onClick={() => requestSort("nombre_pais")}
                >
                  País
                </TableSortLabel>
              </TableCell>
              <TableCell style={headercellStyle}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers.map((user) => (
              <TableRow key={user.id} onClick={() => handleRowClick(user)}>
                <TableCell sx={rowStyle}>{user.nombre}</TableCell>
                <TableCell sx={rowStyle}>{user.apellido}</TableCell>
                <TableCell sx={rowStyle}>{user.email}</TableCell>
                <TableCell sx={rowStyle}>{user.edad}</TableCell>
                <TableCell sx={rowStyle}>{user.sexo}</TableCell>
                <TableCell sx={rowStyle}>{user.disciplina}</TableCell>
                <TableCell sx={rowStyle}>{user.grado_academico}</TableCell>
                <TableCell sx={rowStyle}>{user.nombre_institucion}</TableCell>
                <TableCell sx={rowStyle}>{user.nombre_pais}</TableCell>

                <TableCell>
                  <EditIcon
                    onClick={(event) => {
                      event.stopPropagation(); // Detiene la propagación del evento
                      setEditingUser(user);
                    }}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                  <DeleteIcon
                    onClick={(event) => {
                      event.stopPropagation(); // Detiene la propagación del evento
                      handleDeleteUser(user.id!);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <UserFormModal
          isOpen={isAddingUser}
          onClose={() => setIsAddingUser(false)}
          onSave={handleAddUser}
        />
        {editingUser && (
          <UserFormModal
            isOpen={true}
            onClose={() => setEditingUser(null)}
            onSave={handleEditUser}
            initialData={editingUser}
          />
        )}
      </div>
    </div>
  );
};
