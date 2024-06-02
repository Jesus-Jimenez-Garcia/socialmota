import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment"; // Usaremos moment.js para el formato de fechas
import "./Post.css"; // Importa los estilos del componente

const Post = ({ post, isUserPost, openCommentsPostId, setOpenCommentsPostId }) => {
  const { id, name, content, image_url, created_at, profile_picture, likes, comments } = post;
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const showComments = openCommentsPostId === id;
  const defaultProfilePicture = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

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

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/comments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCommentList(data);
      } else {
        const errorData = await response.json();
        alert(errorData.mensaje || 'Error al obtener los comentarios');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ post_id: id, comment: newComment })
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        const errorData = await response.json();
        alert(errorData.mensaje || 'Error al añadir el comentario');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCommentsClick = () => {
    if (showComments) {
      setOpenCommentsPostId(null);
    } else {
      setOpenCommentsPostId(id);
      fetchComments();
    }
  };

  return (
    <div className="post">
      <div className="post-content">
        <div className={`post-text ${image_url ? '' : 'full'}`}>
          <div className="post-header">
            <img
              src={profile_picture || defaultProfilePicture}
              alt={`Foto de ${name}`}
              className="profile-picture"
              onError={(e) => e.target.src = defaultProfilePicture}
            />
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
              <div className="post-comments" onClick={handleCommentsClick}>
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
        {image_url && (
          <div className="post-image">
            <img src={image_url} alt="Contenido del post" />
          </div>
        )}
      </div>
      {showComments && (
        <div className="comments-section">
          {commentList.map(comment => (
            <div key={comment.id} className="comment">
              <strong>{comment.username}</strong>
              <p>{comment.comment}</p>
            </div>
          ))}
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Añadir un comentario..."
              required
            />
            <button type="submit">Comentar</button>
          </form>
        </div>
      )}
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
  isUserPost: PropTypes.bool,
  openCommentsPostId: PropTypes.number,
  setOpenCommentsPostId: PropTypes.func.isRequired,
};

export default Post;
