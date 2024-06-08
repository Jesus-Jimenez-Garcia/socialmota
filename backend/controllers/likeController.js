import db from '../config/db.js';

// Dar "me gusta" a una publicación
export const likePost = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    const { post_id } = req.body; // Obtener el ID de la publicación desde el cuerpo de la solicitud

    try {
        // Verificar si el usuario ya ha dado "me gusta" a esta publicación
        const [existingLike] = await db.execute('SELECT * FROM Likes WHERE user_id = ? AND post_id = ?', [userId, post_id]);
        if (existingLike.length > 0) {
            return res.status(400).json({ mensaje: 'Ya has dado me gusta a esta publicación' }); // Responder si el usuario ya ha dado "me gusta"
        }

        // Insertar un nuevo "me gusta" en la base de datos
        const query = 'INSERT INTO Likes (user_id, post_id) VALUES (?, ?)';
        await db.execute(query, [userId, post_id]);
        res.status(201).json({ mensaje: 'Me gusta añadido exitosamente' }); // Responder con un mensaje de éxito
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Quitar "me gusta" de una publicación
export const unlikePost = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    const { post_id } = req.body; // Obtener el ID de la publicación desde el cuerpo de la solicitud

    try {
        // Verificar que el "me gusta" pertenece al usuario autenticado
        const [like] = await db.execute('SELECT * FROM Likes WHERE post_id = ? AND user_id = ?', [post_id, userId]);
        if (like.length === 0) {
            return res.status(403).json({ mensaje: 'Acceso denegado' }); // Responder si el "me gusta" no pertenece al usuario autenticado
        }

        // Eliminar el "me gusta" de la base de datos
        const query = 'DELETE FROM Likes WHERE post_id = ? AND user_id = ?';
        const [results] = await db.execute(query, [post_id, userId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Me gusta no encontrado' }); // Responder si no se encuentra el "me gusta"
        }
        res.status(200).json({ mensaje: 'Me gusta eliminado exitosamente' }); // Responder con un mensaje de éxito
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Verificar el estado del "me gusta" de una publicación
export const checkLikeStatus = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    const { post_id } = req.body; // Obtener el ID de la publicación desde el cuerpo de la solicitud

    try {
        // Verificar si el usuario ha dado "me gusta" a la publicación
        const [like] = await db.execute('SELECT * FROM Likes WHERE post_id = ? AND user_id = ?', [post_id, userId]);
        res.status(200).json({ liked: like.length > 0 }); // Responder con el estado del "me gusta"
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};
