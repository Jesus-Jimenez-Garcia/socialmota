import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment"; // Usaremos moment.js para el formato de fechas
import "./Post.css"; // Importa los estilos del componente

const Post = ({ post, isUserPost }) => {
  const { id, name, content, image_url, created_at, profile_picture, likes, comments } = post;
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  // Calcular el tiempo transcurrido desde la fecha de publicación
  const timeAgo = moment(created_at).fromNow();

  useEffect(() => {
    // Verificar si el post ya tiene un "me gusta" del usuario
    const fetchLikeStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/likes/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ post_id: id })
        });

        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error('Error al verificar el estado del me gusta:', error);
      }
    };

    fetchLikeStatus();
  }, [id]);

  const handleLikeClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debe iniciar sesión para dar me gusta');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/likes`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ post_id: id })
      });

      if (response.ok) {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
      } else {
        const errorData = await response.json();
        alert(errorData.mensaje || 'Error al procesar la solicitud');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteClick = async () => {
    const confirmation = window.confirm('¿Seguro que quieres borrar el post?');
    if (!confirmation) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Post borrado exitosamente');
        window.location.reload(); // Recargar la página para reflejar los cambios
      } else {
        const errorData = await response.json();
        alert(errorData.mensaje || 'Error al borrar el post');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="post">
      <div className={`post-content ${image_url ? '' : 'full'}`}>
        <div className="post-header">
          {profile_picture && <img src={profile_picture} alt={`Foto de ${name}`} className="profile-picture" />}
          <p className="post-name"><strong>{name}</strong></p>
        </div>
        <p>{content}</p>
        <div className="post-footer">
          <p className="post-date"><small>Publicado {timeAgo}</small></p>
          <div className="post-likes-comments">
            <div className="post-likes" onClick={handleLikeClick}>
              <span role="img" aria-label="like" className={`heart-icon ${liked ? 'liked' : ''}`}>
                {liked ? '❤️' : '🤍'}
              </span>
              <span>{likeCount}</span>
            </div>
            <div className="post-comments">
              <span role="img" aria-label="comments" className="comment-icon">💬</span>
              <span>{comments}</span>
            </div>
          </div>
          {isUserPost && (
            <button type="button" className="delete-button" onClick={handleDeleteClick} style={{ marginLeft: '10px' }}>
              Borrar
            </button>
          )}
        </div>
      </div>
      {image_url && <img src={image_url} alt="Contenido del post" />}
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    created_at: PropTypes.string.isRequired,
    profile_picture: PropTypes.string,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
  }).isRequired,
  isUserPost: PropTypes.bool
};

export default Post;
