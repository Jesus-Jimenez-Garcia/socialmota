import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithToken } from '../utils/fetchWithToken';
import './Nav.css';

const Nav = () => {
    const [user, setUser] = useState(null); // Estado para almacenar la información del usuario
    const [isAtTop, setIsAtTop] = useState(true); // Estado para verificar si la página está en la parte superior
    const navigate = useNavigate(); // Hook para navegar entre rutas
    const location = useLocation(); // Hook para obtener la ubicación actual
    const { logout } = useAuth(); // Obtener la función de logout del contexto de autenticación
    const defaultProfilePicture = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

    // Efecto para obtener el perfil del usuario cuando el componente se monta
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetchWithToken(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {}, logout);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data); // Almacenar la información del usuario en el estado
                } else {
                    console.error('Error al obtener la información del usuario');
                }
            } catch (error) {
                console.error('Error: ' + error.message);
            }
        };

        fetchUserProfile();
    }, [logout]);

    // Efecto para manejar el evento de scroll cuando la ruta es '/posts'
    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY === 0); // Verificar si el scroll está en la parte superior
        };

        if (location.pathname === '/posts') {
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [location.pathname]);

    // Función para manejar el click en el link de SocialMota
    const handleSocialMotaClick = (e) => {
        if (location.pathname === '/posts' && isAtTop) {
            e.preventDefault(); // Evitar la navegación si ya está en '/posts' y en la parte superior
        } else {
            navigate('/posts'); // Navegar a '/posts'
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Hacer scroll a la parte superior
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link
                    to="/posts"
                    className={`navbar-brand ${location.pathname === '/posts' && isAtTop ? 'inactive-link' : ''}`}
                    onClick={handleSocialMotaClick}
                >
                    SocialMota
                </Link>
                <div className="navbar-links">
                    {user && (
                        <>
                            <img
                                src={user.profile_picture || defaultProfilePicture}
                                alt={`Foto de ${user.name}`}
                                className="nav-profile-picture"
                                onError={(e) => e.target.src = defaultProfilePicture}
                            />
                            <Link to="/profile" className="nav-link">
                                Mi perfil
                            </Link>
                            <Link onClick={logout} className="nav-link">
                                Cerrar sesión
                            </Link>
                        </>
                    )}
                </div>
                {user && (
                    <div className="nav-profile-picture-container">
                        <img
                            src={user.profile_picture || defaultProfilePicture}
                            alt={`Foto de ${user.name}`}
                            className="nav-profile-picture"
                            onError={(e) => e.target.src = defaultProfilePicture}
                        />
                        <div className="dropdown">
                            <Link to="/profile">Mi perfil</Link>
                            <Link onClick={logout}>Cerrar sesión</Link>
                        </div>
                    </div>
                )}
            </nav>
            <div className="navbar-margin"></div>
        </>
    );
};

export default Nav;
