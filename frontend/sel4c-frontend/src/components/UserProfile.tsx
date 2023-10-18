import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';
import { getUserById } from '../services/User.services';
import { useParams } from 'react-router-dom';
import { UserAnswers } from './UserAnswers';
import CompetenciasChart from './Grafica';
import './UserProfile.css'

const UserProfile: React.FC = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetails = await getUserById(Number(id));
                setUser(userDetails);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [id]);

    if (!user) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Perfil de {user.nombre} {user.apellido}</h2>
            <p>Email: {user.email}</p>
            <div className="answers-container">
                <UserAnswers id={user.id || 0} idcuestionario = {1} />
                <UserAnswers id={user.id || 0} idcuestionario = {2} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <CompetenciasChart id={user.id} idcuestionario={1}></CompetenciasChart>
                <CompetenciasChart id={user.id} idcuestionario={2}></CompetenciasChart>
            </div>
            
        </div>
    );
}

export default UserProfile;