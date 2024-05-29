import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'; // Usaremos moment.js para el formato de fechas


const Post = ({ post }) => {
    const { name, content, image_url, created_at, profile_picture, likes } = post;

    // Calcular el tiempo transcurrido desde la fecha de publicación
    const timeAgo = moment(created_at).fromNow();

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
                    <div className="post-likes">
                        <span role="img" aria-label="like" className="heart-icon">❤️</span>
                        <span>{likes}</span>
                    </div>
                </div>
            </div>
            {image_url && <img src={image_url} alt="Contenido del post" />}
        </div>
    );
};

Post.propTypes = {
    post: PropTypes.shape({
        name: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        image_url: PropTypes.string,
        created_at: PropTypes.string.isRequired,
        profile_picture: PropTypes.string,
        likes: PropTypes.number.isRequired, // Asegurar que likes sea un número requerido
    }).isRequired,
};

export default Post;
