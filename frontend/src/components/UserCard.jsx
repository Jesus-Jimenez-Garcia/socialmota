import React from 'react';
import PropTypes from 'prop-types';

const UserCard = ({ user }) => {
    return (
        <div className="user-card">
            {user.profile_picture && <img src={user.profile_picture} alt={`Foto de ${user.username}`} />}
            <p><strong>{user.username}</strong></p>
            <p>{user.name}</p>
            <p>{user.description}</p>
            <button>Seguir</button> {/* Botón Seguir */}
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
    }).isRequired
};

export default UserCard;
