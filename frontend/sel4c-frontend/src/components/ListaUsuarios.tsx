import React from 'react';
import { Usuario } from '../Usuario';

interface Props {
  usuarios: Usuario[];
  eliminarUsuario: (id: number) => void;
}

const ListaUsuarios: React.FC<Props> = ({ usuarios, eliminarUsuario }) => {
  return (
    <ul>
      {usuarios.map(usuario => (
        <li key={usuario.id}>
          {usuario.nombre} {usuario.apellido} - {usuario.email}
          <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
};

export default ListaUsuarios;