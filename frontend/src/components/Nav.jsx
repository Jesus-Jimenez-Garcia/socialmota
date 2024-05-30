import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
    const [user, setUser] = useState(null);
    const [isAtTop, setIsAtTop] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

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
          <div className="navbar-margin"></div> {/* Espacio extra para que el contenido no quede detrás del navbar */}
      </>
  );
};

export default Nav;
