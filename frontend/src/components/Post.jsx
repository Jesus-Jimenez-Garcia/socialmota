import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/es';
import './Post.css';

const Post = ({ post, isUserPost, openCommentsPostId, setOpenCommentsPostId }) => {
    const { id, name, content, image_url, created_at, profile_picture, likes, comments } = post;
    const [likeCount, setLikeCount] = useState(likes);
    const [liked, setLiked] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userId, setUserId] = useState(null);
    const showComments = openCommentsPostId === id;

    // Verificar el estado del "me gusta" del usuario para el post actual
    useEffect(() => {
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

    // Obtener el perfil del usuario autenticado
    useEffect(() => {
        const fetchUserProfile = async () => {
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
                setUserId(data.id);
            }
        };

        fetchUserProfile();
    }, []);

    // Manejar clic en el botón de "me gusta"
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

    // Manejar clic en el botón de borrar post
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
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.mensaje || 'Error al borrar el post');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    // Obtener los comentarios del post
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

    // Manejar el envío de un nuevo comentario
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

    // Manejar clic en el botón de comentarios para mostrar/ocultar
    const handleCommentsClick = () => {
        if (showComments) {
            setOpenCommentsPostId(null);
        } else {
            setOpenCommentsPostId(id);
            fetchComments();
        }
    };

    // Manejar clic en el botón de borrar comentario
    const handleDeleteComment = async (commentId) => {
        const confirmation = window.confirm('¿Seguro que quieres borrar este comentario?');
        if (!confirmation) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchComments();
            } else {
                const errorData = await response.json();
                alert(errorData.mensaje || 'Error al borrar el comentario');
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const timeAgo = moment(created_at).fromNow();

    return (
      <div className="post">
      <div className="post-content">
          <div className={`post-text ${image_url ? '' : 'full'}`}>
              <div className="post-header">
                  {profile_picture && <img src={profile_picture} alt={`Foto de ${name}`} className="profile-picture" />}
                  <p className="post-name"><strong>{name}</strong></p>
              </div>
              <p className="post-comment">{content}</p>
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
                      <strong>{comment.name}</strong>
                      <p>{comment.comment}</p>
                      {comment.user_id === userId && (
                          <button type="button" className="delete-comment-button" onClick={() => handleDeleteComment(comment.id)}>
                              Borrar comentario
                          </button>
                      )}
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
