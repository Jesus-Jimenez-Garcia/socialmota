import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { contactId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [contactName, setContactName] = useState('');

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
            } catch (error) {
                setError(error.message);
            }
        };

        const fetchContactName = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Token faltante');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${contactId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Error fetching contact name');
                }
                const data = await response.json();
                setContactName(data.name);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMessages();
        fetchContactName();
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
                    <div key={message.id} className={`message ${message.sender_id === contactId ? 'received' : 'sent'}`}>
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
