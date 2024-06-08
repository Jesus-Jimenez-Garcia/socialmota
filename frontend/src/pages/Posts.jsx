import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post.jsx';
import './Posts.css';

const Posts = ({ filterByUser = false }) => {
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const [showFollowed, setShowFollowed] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const [following, setFollowing] = useState([]);
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async (page, sortByPopularity = false, showFollowed = false, filterByUser = false) => {
    try {
      const token = localStorage.getItem('token');
      let endpoint = '';
      if (filterByUser) {
        endpoint = 'user';
      } else if (showFollowed) {
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
          setIsLastPage(true);
        } else {
          setIsLastPage(false);
        }
        const formattedData = data.map(post => ({
          ...post,
          likes: post.likes || 0
        }));
        setPosts(formattedData);
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
        setFollowing(data);
      } else {
        const errorData = await response.json();
        setError(errorData.mensaje || 'Error al obtener los seguidos');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  useEffect(() => {
    fetchPosts(page, sortByPopularity, showFollowed, filterByUser);
    fetchUserProfile();
    fetchFollowing();
  }, [page, sortByPopularity, showFollowed, filterByUser]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0 && page === 1) {
        setShowTopButton(false);
      } else {
        setShowTopButton(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

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
    });
  };

  const handleSortByPopularity = () => {
    setSortByPopularity(prev => !prev);
    setPage(1);
  };

  const handleToggleFollowed = () => {
    setShowFollowed(prevState => !prevState);
    setSortByPopularity(false);
    setPage(1);
  };

  const handleNavigateToCreatePost = () => {
    navigate('/create-post');
  };

  if (loading) {
    return <p className="loading-message">Cargando posts...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="posts-container">
      {!filterByUser && <h1 className="welcome-message">Hola {userName.split(' ')[0]}</h1>}

      <div className="posts-buttons">
        <button onClick={() => navigate('/users')}>Conocer gente</button>
        {!filterByUser && (
          <>
            <button onClick={handleToggleFollowed}>{showFollowed ? 'Todos' : 'Seguidos'}</button>
            <button onClick={handleSortByPopularity}>{sortByPopularity ? 'Más actuales' : 'Más populares'}</button>
          </>
        )}
        <button onClick={handleNavigateToCreatePost}>Publicar</button>
      </div>
      {showFollowed && following.length === 0 && (
        <h2 className="no-following-message">Aún no sigues a nadie. Comienza a conocer gente de tu pueblo.</h2>
      )}
      {posts.length === 0 && filterByUser && (
        <h2 className="no-posts-message">Aún no has publicado en SocialMota. Tus vecinos te esperan</h2>
      )}
      {posts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          isUserPost={filterByUser} 
          openCommentsPostId={openCommentsPostId} 
          setOpenCommentsPostId={setOpenCommentsPostId} 
        />
      ))}
      <div className="pagination-buttons">
        {showTopButton && <button onClick={handleFirstPage}>Volver al inicio</button>}
        <button onClick={handleNextPage} disabled={isLastPage}>Ver más posts</button>
      </div>
    </div>
  );
};

export default Posts;
