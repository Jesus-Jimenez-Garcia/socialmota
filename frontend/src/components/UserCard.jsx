import React from 'react';
import PropTypes from 'prop-types';
import './UserCard.css'; // Importa los estilos del componente

const UserCard = ({ user, isFollowing, onFollow, onUnfollow }) => {
    return (
        <div className="user-card">
            {user.profile_picture && <img src={user.profile_picture} alt={`Foto de ${user.username}`} />}
            <p><strong>{user.username}</strong></p>
            <p>{user.name}</p>
            <p>{user.description}</p>
            <button onClick={() => isFollowing ? onUnfollow(user.id) : onFollow(user.id)}>
                {isFollowing ? 'Dejar de seguir' : 'Seguir'}
            </button>
        </div>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        profile_picture: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string
    }).isRequired,
    isFollowing: PropTypes.bool.isRequired,
    onFollow: PropTypes.func.isRequired,
    onUnfollow: PropTypes.func.isRequired,
};

export default UserCard;
