import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import { useNavigate } from 'react-router-dom';
import './Conversations.css';

const Conversations = () => {
    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setConversations(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.mensaje || 'Error al obtener las conversaciones');
                }
            } catch (error) {
                setError('Error: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    if (loading) {
        return <p className="loading-message">Cargando conversaciones...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="conversations-container">
            <h2>Conversaciones</h2>
            <div className="user-container">
                {conversations.map(user => (
                    <UserCard 
                        key={user.id} 
                        user={user} 
                        showChatButton={true} // Pasar la nueva propiedad
                    />
                ))}
            </div>
            <button className="back-button" onClick={() => navigate('/profile')}>
                Volver
            </button>
        </div>
    );
};

export default Conversations;
