import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './UserCard.css'; // Importa los estilos del componente

const UserCard = ({ user, isFollowing, onFollow, onUnfollow }) => {
    const navigate = useNavigate();
    const defaultProfilePicture = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

    const handleSendMessage = () => {
        navigate(`/chat/${user.id}`);
    };

    return (
        <div className="user-card">
            <img 
                src={user.profile_picture || defaultProfilePicture} 
                alt={`Foto de ${user.name}`} 
                onError={(e) => e.target.src = defaultProfilePicture} 
            />
            <p className="user-name"><strong>{user.name}</strong></p>
            <p>{user.description}</p>
            <button onClick={() => isFollowing ? onUnfollow(user.id) : onFollow(user.id)}>
                {isFollowing ? 'Dejar de seguir' : 'Seguir'}
            </button>
            {isFollowing && (
                <button onClick={handleSendMessage} style={{ marginTop: '10px' }}>
                    Enviar privado
                </button>
            )}
        </div>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        profile_picture: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string
    }).isRequired,
    isFollowing: PropTypes.bool.isRequired,
    onFollow: PropTypes.func.isRequired,
    onUnfollow: PropTypes.func.isRequired,
};

export default UserCard;
