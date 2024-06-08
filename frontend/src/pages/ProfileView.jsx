import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileView.css';

const ProfileView = () => {
    const [user, setUser] = useState(null); 
    const [error, setError] = useState(''); 
    const navigate = useNavigate(); 
    const defaultProfilePicture = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'; // URL de la imagen de perfil predeterminada

    useEffect(() => {
        // Función para obtener los datos del perfil del usuario
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json(); // Parsear la respuesta como JSON
                    setUser(data); // Actualizar el estado con los datos del usuario
                } else {
                    const errorData = await response.json(); // Parsear el error como JSON
                    setError(errorData.mensaje || 'Error al obtener la información del usuario'); // Manejar el error
                }
            } catch (error) {
                setError('Error: ' + error.message); // Manejar errores de la solicitud
            }
        };

        fetchUserProfile(); // Llamar a la función para obtener el perfil del usuario
    }, []);

    if (error) {
        return <p className="error-message">{error}</p>; // Mostrar el mensaje de error si ocurre un error
    }

    if (!user) {
        return <p className="loading-message">Cargando...</p>; // Mostrar mensaje de carga mientras se obtienen los datos del usuario
    }

    return (
        <div>
            <div className="profile-container">
                <h2>Mi perfil</h2>
                <div className="profile-info">
                    <div className="profile-picture-container">
                        <img
                            src={user.profile_picture || defaultProfilePicture} // Mostrar la imagen de perfil del usuario o la predeterminada
                            alt={`Foto de ${user.name}`}
                            className="profile-picture"
                            onError={(e) => e.target.src = defaultProfilePicture} // Manejar el error en la carga de la imagen
                        />
                    </div>
                    <h3>{user.name}</h3>
                    <p>{user.description}</p>
                </div>
                <div className="profile-buttons">
                    <button onClick={() => navigate('/my-posts')}>Ver mis posts</button>
                    <button onClick={() => navigate('/edit-profile')}>Editar perfil</button>
                    <button onClick={() => navigate('/change-password')}>Cambiar Contraseña</button>
                    <button onClick={() => navigate('/followed-users')}>Usuarios Seguidos</button>
                    <button onClick={() => navigate('/conversations')}>Conversaciones</button>
                </div>
            </div>
            <button className="back-button" onClick={() => navigate('/posts')}>Volver</button>
        </div>
    );
};

export default ProfileView;
