import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
    const { contactId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${contactId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                setError('Error fetching messages');
            }
        } catch (err) {
            setError('Error fetching messages: ' + err.message);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [contactId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ receiver_id: contactId, content: newMessage })
            });
            if (response.ok) {
                setNewMessage('');
                fetchMessages(); // Refresca los mensajes después de enviar uno nuevo
            } else {
                setError('Error sending message');
            }
        } catch (err) {
            setError('Error sending message: ' + err.message);
        }
    };

    return (
        <div>
            <div className="message-list">
                {messages.map(message => (
                    <div key={message.id} className={`message ${message.sender_id === parseInt(contactId) ? 'received' : 'sent'}`}>
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Chat;
