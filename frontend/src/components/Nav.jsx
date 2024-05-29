import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [atTop, setAtTop] = useState(false);

    useEffect(() => {
        if (location.pathname === '/posts') {
            const handleScroll = () => {
                setAtTop(window.scrollY === 0);
            };
            // Agregar el event listener para el scroll
            window.addEventListener('scroll', handleScroll);
            // Verificar la posición inicial
            handleScroll();

            // Limpiar el event listener al desmontar el componente o cambiar de ruta
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        } else {
            setAtTop(false);
        }
    }, [location.pathname]);

    const handleLogout = () => {
        // Eliminar el token de localStorage
        localStorage.removeItem('token');
        // Redirigir a la página de inicio
        navigate('/');
    };

    const handleBrandClick = () => {
        if (location.pathname === '/posts') {
            if (!atTop) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        } else {
            navigate('/posts');
        }
    };

    return (
        <nav className="navbar">
            <div
                onClick={handleBrandClick}
                className={`navbar-brand ${atTop ? '' : 'pointer'}`}
                style={{ cursor: atTop ? 'default' : 'pointer' }}
            >
                SocialMota
            </div>
            <div className="navbar-links">
                <Link to="/profile" className="nav-link">Mi perfil</Link>
                <button className="nav-link logout-button" onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </nav>
    );
};

export default Nav;
