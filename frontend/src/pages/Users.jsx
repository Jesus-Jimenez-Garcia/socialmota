import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState([]); // Estado para los usuarios seguidos
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // Estado para la página actual
    const [isLastPage, setIsLastPage] = useState(false); // Estado para manejar la última página

    const fetchUsers = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
                if (data.length < 10) {
                    setIsLastPage(true); // Si hay menos de 10 usuarios, es la última página
                } else {
                    // Verificar si hay más usuarios en la siguiente página
                    const nextPageResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users?page=${page + 1}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (nextPageResponse.ok) {
                        const nextPageData = await nextPageResponse.json();
                        setIsLastPage(nextPageData.length === 0); // Si la siguiente página está vacía, es la última página
                    } else {
                        setIsLastPage(true);
                    }
                }
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

    const fetchFollowing = async () => {
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
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al obtener los seguidores');
            }
        } catch (error) {
            setError('Error: ' + error.message);
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
        fetchUsers(page);
        fetchFollowing();
    }, [page]); // Agregar page como dependencia

    const handleNextPage = () => {
        if (!isLastPage) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handleFirstPage = () => {
        setPage(1);
        window.scrollTo(0, 0); // Volver al inicio de la página
    };

    if (loading) {
        return <p>Cargando usuarios...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Usuarios</h2>
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
            <div className="pagination-buttons">
                <button onClick={handleFirstPage}>Volver al inicio</button>
                <button onClick={handleNextPage} disabled={isLastPage}>Ver más usuarios</button>
            </div>
        </div>
    );
};

export default Users;
