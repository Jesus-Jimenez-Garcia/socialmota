import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import './Users.css';
import { useNavigate } from 'react-router-dom'; 

const Users = ({ showFollowedOnly = false }) => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); 
    const [isLastPage, setIsLastPage] = useState(false);
    const navigate = useNavigate(); 

    const fetchUsers = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users?page=${page}&limit=16`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length < 16) {
                    setIsLastPage(true); // Si hay menos de 16 usuarios, es la última página
                } else {
                    setIsLastPage(false);
                }
                setUsers(data);
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al obtener los usuarios');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowedUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/followers/followed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFollowing(data.map(f => f.id)); // Almacenar solo los IDs de los usuarios seguidos
                setUsers(data); // Mostrar solo los usuarios seguidos si showFollowedOnly es true
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al obtener los seguidores');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/followers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ followed_id: userId })
            });
            if (response.ok) {
                setFollowing(prev => [...prev, userId]); // Añadir el ID del usuario seguido
                if (showFollowedOnly) {
                    setUsers(prev => [...prev, { id: userId }]); // Añadir el usuario a la lista si se muestra solo usuarios seguidos
                }
                alert('Usuario seguido exitosamente');
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al seguir al usuario');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/followers`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ followed_id: userId })
            });
            if (response.ok) {
                setFollowing(prev => prev.filter(id => id !== userId)); // Remover el ID del usuario dejado de seguir
                if (showFollowedOnly) {
                    setUsers(prev => prev.filter(user => user.id !== userId)); // Remover el usuario de la lista si se muestra solo usuarios seguidos
                }
                alert('Usuario dejado de seguir exitosamente');
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al dejar de seguir al usuario');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchFollowedUsers(); // Obtener la lista de usuarios seguidos al montar el componente
    }, []);

    useEffect(() => {
        if (showFollowedOnly) {
            fetchFollowedUsers();
        } else {
            fetchUsers(page);
        }
    }, [page, showFollowedOnly]); // Agregar page y showFollowedOnly como dependencias

    const handleNextPage = () => {
        if (!isLastPage) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleFirstPage = () => {
        setPage(1);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        }); // Volver al inicio de la página
    };

    if (loading) {
        return <p>Cargando usuarios...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>{showFollowedOnly ? 'Usuarios Seguidos' : 'Usuarios'}</h2>
            <div className="user-container">
                {users.map(user => (
                    <UserCard 
                        key={user.id} 
                        user={user} 
                        isFollowing={following.includes(user.id)}
                        onFollow={handleFollow} 
                        onUnfollow={handleUnfollow} 
                    />
                ))}
            </div>
            {!showFollowedOnly && (
                <div className="pagination-buttons">
                    <button onClick={handleFirstPage}>Volver al inicio</button>
                    {!isLastPage && <button onClick={handleNextPage}>Ver más usuarios</button>}
                </div>
            )}
            {showFollowedOnly && (
                <button className="back-button" onClick={() => navigate('/profile')}>
                    Volver
                </button>
            )}
        </div>
    );
};

export default Users;
