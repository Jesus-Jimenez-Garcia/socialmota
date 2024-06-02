// src/components/Nav.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithToken } from '../utils/fetchWithToken';
import './Nav.css';

const Nav = () => {
    const [user, setUser] = useState(null);
    const [isAtTop, setIsAtTop] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const defaultProfilePicture = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetchWithToken(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {}, logout);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error('Error al obtener la información del usuario');
                }
            } catch (error) {
                console.error('Error: ' + error.message);
            }
        };

        fetchUserProfile();
    }, [logout]);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY === 0);
        };

        if (location.pathname === '/posts') {
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [location.pathname]);

    const handleSocialMotaClick = (e) => {
        if (location.pathname === '/posts' && isAtTop) {
            e.preventDefault();
        } else {
            navigate('/posts');
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
                        </>
                    )}
                    <button onClick={logout} className="nav-link">
                        Cerrar sesión
                    </button>
                </div>
            </nav>
            <div className="navbar-margin"></div>
        </>
    );
};

export default Nav;
