import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
    const [user, setUser] = useState(null);
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
                    // Manejo del error si la solicitud falla
                    console.error('Error al obtener la información del usuario');
                }
            } catch (error) {
                console.error('Error: ' + error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/posts" className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                SocialMota
            </Link>
            <div className="navbar-links">
                {user && (
                    <>
                        {user.profile_picture && (
                            <img
                                src={user.profile_picture}
                                alt={`Foto de ${user.name}`}
                                className="nav-profile-picture"
                            />
                        )}
                        <Link to="/profile" className="nav-link">
                            Mi perfil
                        </Link>
                    </>
                )}
                <button onClick={handleLogout} className="nav-link">
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};

export default Nav;
