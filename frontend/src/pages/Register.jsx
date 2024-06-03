import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = ({ isEditMode = false, isLoginMode = false, isChangePasswordMode = false }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode) {
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

        if (!isEditMode && !isChangePasswordMode && password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        if (isChangePasswordMode && newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = isEditMode
                ? `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`
                : isLoginMode
                ? `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`
                : isChangePasswordMode
                ? `${process.env.REACT_APP_BACKEND_URL}/api/users/change-password`
                : `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`;
            const method = isEditMode ? 'PUT' : 'POST';

            const body = isEditMode
                ? { profile_picture: profilePicture, name, description }
                : isChangePasswordMode
                ? { oldPassword, newPassword }
                : { username, password, profile_picture: profilePicture, name, description };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': isEditMode || isChangePasswordMode ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                if (isLoginMode) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);
                    navigate('/posts');
                } else if (isChangePasswordMode) {
                    alert('Contraseña actualizada exitosamente');
                    navigate('/profile');
                } else {
                    navigate(isEditMode ? '/profile' : '/login');
                }
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

    const handleBack = () => {
        navigate('/profile');
    };

    return (
        <div className="register-container">
            <h2 className="register-title">
                {isEditMode ? 'Editar Perfil' : isLoginMode ? 'Iniciar Sesión' : isChangePasswordMode ? 'Cambiar Contraseña' : 'Registrar Usuario'}
            </h2>
            <form onSubmit={handleSubmit} className="register-form">
                {!isEditMode && !isChangePasswordMode && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Nombre de Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                maxLength={40}
                                placeholder="Nombre de Usuario"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Contraseña"
                                className="form-input"
                            />
                        </div>
                    </>
                )}
                {isChangePasswordMode && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Contraseña Antigua</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                                placeholder="Contraseña Antigua"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nueva Contraseña</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Nueva Contraseña"
                                className="form-input"
                            />
                        </div>
                    </>
                )}
                {!isLoginMode && !isChangePasswordMode && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Foto de Perfil (URL)</label>
                            <input
                                type="text"
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                placeholder="Foto de Perfil (URL)"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={40}
                                placeholder="Nombre"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Descripción</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                                placeholder="Descripción"
                                className="form-textarea"
                            ></textarea>
                        </div>
                    </>
                )}
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading} className="form-button">
                    {loading ? 'Cargando...' : isEditMode ? 'Actualizar' : isLoginMode ? 'Iniciar Sesión' : isChangePasswordMode ? 'Cambiar Contraseña' : 'Registrar'}
                </button>
                {isEditMode && !isChangePasswordMode && (
                    <button type="button" onClick={handleDeleteAccount} className="form-button delete-button">
                        Borrar cuenta
                    </button>
                )}
                <button type="button" onClick={handleBack} className="form-button">
                    Volver
                </button>
            </form>
        </div>
    );
};

export default Register;
