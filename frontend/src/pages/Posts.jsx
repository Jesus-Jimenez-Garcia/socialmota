import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post.jsx';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // Estado para la página actual
    const [isLastPage, setIsLastPage] = useState(false); // Estado para manejar la última página
    const [sortByPopularity, setSortByPopularity] = useState(false); // Estado para manejar la ordenación por popularidad
    const [showFollowed, setShowFollowed] = useState(false); // Estado para manejar la visualización de posts seguidos
    const navigate = useNavigate();

    const fetchPosts = async (page, sortByPopularity = false, showFollowed = false) => {
        try {
            const token = localStorage.getItem('token');
            let endpoint = '';
            if (showFollowed) {
                endpoint = sortByPopularity ? 'followed/likes' : 'followed';
            } else {
                endpoint = sortByPopularity ? 'popular' : '';
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${endpoint}?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.length < 10) {
                    setIsLastPage(true); // Si hay menos de 10 posts, es la última página
                } else {
                    setIsLastPage(false); // Si hay 10 posts, aún puede haber más páginas
                }
                setPosts(data);
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al obtener los posts');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

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
                setUserName(data.name);
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al obtener la información del usuario');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    useEffect(() => {
        fetchPosts(page, sortByPopularity, showFollowed);
        fetchUserProfile();
    }, [page, sortByPopularity, showFollowed]); // Agregar page, sortByPopularity y showFollowed como dependencias

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
        }); // Desplazamiento suave hacia la parte superior de la página
    };

    const handleSortByPopularity = () => {
        setSortByPopularity(prev => !prev);
        setPage(1); // Reiniciar a la primera página
    };

    const handleToggleFollowed = () => {
        setShowFollowed(prevState => !prevState);
        setSortByPopularity(false);
        setPage(1); // Reiniciar a la primera página
    };

    const handleNavigateToCreatePost = () => {
        navigate('/create-post');
    };

    if (loading) {
        return <p>Cargando posts...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h1>{userName}, te estábamos esperando</h1>
            {/* Botón para redirigir a la página de usuarios */}
            <button onClick={() => navigate('/users')}>Conocer gente</button>
            {/* Botón para alternar entre todos los posts y posts de usuarios seguidos */}
            <button onClick={handleToggleFollowed}>{showFollowed ? 'Todos' : 'Seguidos'}</button>
            {/* Botón para ordenar por popularidad */}
            <button onClick={handleSortByPopularity}>{sortByPopularity ? 'Ordenar por fecha' : 'Más populares'}</button>
            {/* Botón para publicar */}
            <button onClick={handleNavigateToCreatePost}>Publicar</button>
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
            <div className="pagination-buttons">
                <button onClick={handleFirstPage}>Volver al inicio</button>
                <button onClick={handleNextPage} disabled={isLastPage}>Ver más posts</button>
            </div>
        </div>
    );
};

export default Posts;
