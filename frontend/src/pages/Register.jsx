import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ isEditMode = false }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode) {
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
                        setUsername(data.username);
                        setName(data.name);
                        setDescription(data.description);
                        setProfilePicture(data.profile_picture);
                    } else {
                        const errorData = await response.json();
                        setError(errorData.mensaje || 'Error al obtener la información del usuario');
                    }
                } catch (error) {
                    setError('Error: ' + error.message);
                }
            };

            fetchUserProfile();
        }
    }, [isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const url = isEditMode ? `${process.env.REACT_APP_BACKEND_URL}/api/users/profile` : `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`;
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': isEditMode ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({ username, password, profile_picture: profilePicture, name, description })
            });

            if (response.ok) {
                navigate(isEditMode ? '/posts' : '/login');
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al procesar la solicitud');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm('¿Estás seguro que quieres borrar tu cuenta?');
        if (!confirmation) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al borrar la cuenta');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    return (
        <div>
            <h2>{isEditMode ? 'Editar Perfil' : 'Registrar Usuario'}</h2>
            <form onSubmit={handleSubmit}>
                {!isEditMode && (
                    <>
                        <div>
                            <label>Nombre de Usuario</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div>
                            <label>Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </>
                )}
                <div>
                    <label>Foto de Perfil (URL)</label>
                    <input type="text" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
                </div>
                <div>
                    <label>Nombre</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Descripción</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>{loading ? 'Cargando...' : isEditMode ? 'Actualizar' : 'Registrar'}</button>
                {isEditMode && (
                    <button type="button" onClick={handleDeleteAccount} className="delete-button" style={{ marginLeft: '10px' }}>
                        Borrar cuenta
                    </button>
                )}
            </form>
        </div>
    );
};

export default Register;
