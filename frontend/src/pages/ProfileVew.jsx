import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Función para obtener la información del perfil del usuario
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
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
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!user) {
        return <p>Cargando...</p>;
    }

    return (
        <div>
            <h2>Mi perfil</h2>
            <div>
                <img src={user.profile_picture} alt={`Foto de ${user.name}`} style={{ width: '150px', borderRadius: '50%' }} />
                <h3>{user.name}</h3>
                <p>{user.description}</p>
            </div>
            <div>
                <button onClick={() => navigate('/my-posts')}>Ver mis posts</button>
                <button onClick={() => navigate('/edit-profile')}>Editar perfil</button>
                <button onClick={() => alert('Funcionalidad próximamente')}>Cambiar Contraseña</button>
            </div>
        </div>
    );
};

export default ProfileView;
