import React from 'react';
import { User } from '../interface/User';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    return (
        <div>
            <h2>Perfil de {user.nombre} {user.apellido}</h2>
            {/* Agrega los detalles del usuario aquí */}
            <p>Email: {user.email}</p>
            {/* y así sucesivamente para otros campos del usuario... */}
        </div>
    );
}

export default UserProfile;