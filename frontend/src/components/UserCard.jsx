import React from 'react';
import PropTypes from 'prop-types';
import './UserCard.css';

// Componente UserCard
const UserCard = ({ user, isFollowing = false, onFollow, onUnfollow, showChatButton }) => {
    // URL de imagen de perfil por defecto
    const defaultProfilePicture = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

    return (
        <div className="user-card">
            <img 
                src={user.profile_picture || defaultProfilePicture} 
                alt={`Foto de ${user.name}`}
                onError={(e) => e.target.src = defaultProfilePicture} 
            />
            <p className="user-name"><strong>{user.name}</strong></p>
            <p className="user-description">{user.description}</p>
            {showChatButton ? (
                <button onClick={() => window.location.href = `/chat/${user.id}`}>Chat</button>
            ) : (
                <>
                    <button onClick={() => isFollowing ? onUnfollow(user.id) : onFollow(user.id)}>
                        {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                    </button>
                    {isFollowing && (
                        <button onClick={() => window.location.href = `/chat/${user.id}`} className="private-message-button">
                            Enviar privado
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

// Definir los tipos de las propiedades del componente UserCard
UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        profile_picture: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string
    }).isRequired,
    isFollowing: PropTypes.bool,
    onFollow: PropTypes.func,
    onUnfollow: PropTypes.func,
    showChatButton: PropTypes.bool 
};

export default UserCard;
