import db from '../config/db.js';

// Enviar un mensaje
export const sendMessage = async (req, res) => {
    const { receiver_id, content } = req.body; // Obtener el ID del receptor y el contenido del mensaje desde el cuerpo de la solicitud
    const sender_id = req.user.userId; // Obtener el ID del usuario autenticado (remitente)

    try {
        // Insertar el mensaje en la base de datos
        const query = 'INSERT INTO Messages (sender_id, receiver_id, content) VALUES (?, ?, ?)';
        await db.execute(query, [sender_id, receiver_id, content]);
        res.status(201).json({ message: 'Mensaje enviado exitosamente' }); // Responder con un mensaje de éxito
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Obtener los mensajes entre el usuario autenticado y otro usuario
export const getMessages = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    const { contactId } = req.params; // Obtener el ID del contacto desde los parámetros de la solicitud

    try {
        // Seleccionar los mensajes entre el usuario autenticado y el contacto
        const query = `
            SELECT * FROM Messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?) 
            ORDER BY created_at`;
        const [results] = await db.execute(query, [userId, contactId, contactId, userId]);
        res.status(200).json(results); // Responder con los mensajes
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Obtener las conversaciones del usuario autenticado
export const getConversations = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado

    try {
        // Seleccionar usuarios con los que el usuario autenticado ha tenido conversaciones
        const query = `
            SELECT DISTINCT u.id, u.username, u.profile_picture, u.name
            FROM Users u
            JOIN Messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
            WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?
        `;
        const [results] = await db.execute(query, [userId, userId, userId]);
        res.status(200).json(results); // Responder con la lista de conversaciones
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};
