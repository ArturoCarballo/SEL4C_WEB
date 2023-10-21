import React, { useEffect, useState } from 'react';
import { User } from '../interface/User';
import { getUserById } from '../services/User.services';
import { useParams } from 'react-router-dom';
import { UserAnswers } from './UserAnswers';
import CompetenciasChart from './Grafica';
import './UserProfile.css'
import html2canvas from 'html2canvas';


const UserProfile: React.FC = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);

    const chartRef1 = React.useRef<HTMLDivElement>(null);
    const chartRef2 = React.useRef<HTMLDivElement>(null);

    const downloadAsPNG = async (chartRef: React.RefObject<HTMLDivElement>, fileName: string) => {
        if (chartRef.current) {
            const canvas = await html2canvas(chartRef.current);
            const a = document.createElement("a");
            a.href = canvas.toDataURL("image/png");
            a.download = fileName;
            a.click();
        }
    };

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

    return (
        <div>
            <h2>Perfil de {user.nombre} {user.apellido}</h2>
            <p>Email: {user.email}</p>
            <button style={buttonStyle} onClick={() => downloadAsPNG(chartRef1, "CompetenciasChart1.png")}>
                Descargar CompetenciasChart 1 como PNG
            </button>
            <button style={buttonStyle} onClick={() => downloadAsPNG(chartRef2, "CompetenciasChart2.png")}>
                Descargar CompetenciasChart 2 como PNG
            </button>
            <div className="answers-container">
                <UserAnswers id={user.id || 0} idcuestionario = {1} />
                <UserAnswers id={user.id || 0} idcuestionario = {2} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div ref={chartRef1}>
                    <CompetenciasChart id={user.id} idcuestionario={1}></CompetenciasChart>
                </div>
                <div ref={chartRef2}>
                    <CompetenciasChart id={user.id} idcuestionario={2}></CompetenciasChart>
                </div>
            </div>
            
        </div>
    );
}

export default UserProfile;