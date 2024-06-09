import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProfileView.css';

const ProfileView = () => {
    const { userId } = useParams(); // Obtener el userId de los parámetros de la ruta
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const defaultProfilePicture = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId || 'profile'}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.mensaje || 'Error al obtener la información del usuario');
                }
            } catch (error) {
                setError('Error: ' + error.message);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!user) {
        return <p className="loading-message">Cargando...</p>;
    }

    return (
        <div>
            <div className="profile-container">
                <h2>{userId ? 'Perfil del Usuario' : 'Mi Perfil'}</h2>
                <div className="profile-info">
                    <div className="profile-picture-container">
                        <img
                            src={user.profile_picture || defaultProfilePicture}
                            alt={`Foto de ${user.name}`}
                            className="profile-picture"
                            onError={(e) => e.target.src = defaultProfilePicture}
                        />
                    </div>
                    <h3>{user.name}</h3>
                    <p>{user.description}</p>
                    <p><strong>Seguidores:</strong> {user.followerCount}</p> 
                    <p><strong>Posts:</strong> {user.postCount}</p>
                </div>
                {!userId && (
                    <div className="profile-buttons">
                        <button onClick={() => navigate('/my-posts')}>Ver mis posts</button>
                        <button onClick={() => navigate('/edit-profile')}>Editar perfil</button>
                        <button onClick={() => navigate('/change-password')}>Cambiar Contraseña</button>
                        <button onClick={() => navigate('/followed-users')}>Usuarios Seguidos</button>
                        <button onClick={() => navigate('/conversations')}>Conversaciones</button>
                    </div>
                )}
            </div>
            <button className="back-button" onClick={() => navigate('/posts')}>Volver</button>
        </div>
    );
};

export default ProfileView;
