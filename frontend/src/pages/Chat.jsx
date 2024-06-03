import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { contactId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [contactName, setContactName] = useState('');
    const [userProfiles, setUserProfiles] = useState({});

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token faltante');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${contactId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error fetching messages');
                }
                const data = await response.json();
                setMessages(data);

                // Fetch the contact's name
                const contactResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${contactId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!contactResponse.ok) {
                    throw new Error('Error fetching contact name');
                }
                const contactData = await contactResponse.json();
                setContactName(contactData.name);

                // Fetch the user profiles (sender and receiver)
                const userIds = [...new Set(data.map(msg => msg.sender_id))];
                const profiles = {};
                for (const id of userIds) {
                    const profileResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!profileResponse.ok) {
                        throw new Error('Error fetching user profiles');
                    }
                    const profileData = await profileResponse.json();
                    profiles[id] = profileData;
                }
                setUserProfiles(profiles);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMessages();
    }, [contactId]);

    const handleSendMessage = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token faltante');
            return;
        }

        try {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ receiver_id: contactId, content: newMessage })
            });
            setNewMessage('');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${contactId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setMessages(data); // Refresca los mensajes
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2>Tu conversación con {contactName}</h2>
            <div className="message-list">
                {messages.map(message => (
                    <div key={message.id} className={`message ${message.sender_id === parseInt(contactId) ? 'received' : 'sent'}`}>
                        <img
                            src={userProfiles[message.sender_id]?.profile_picture || 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'}
                            alt={`Foto de ${userProfiles[message.sender_id]?.name}`}
                            className="message-profile-picture"
                        />
                        {message.content}
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                />
                <button onClick={handleSendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chat;
