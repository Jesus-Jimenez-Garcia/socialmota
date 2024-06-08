import db from '../config/db.js';

// Obtener comentarios de un post
export const getComments = async (req, res) => {
    const postId = req.params.id; // Obtener el ID del post de los parámetros de la solicitud
    try {
        // Query para obtener los comentarios de un post, junto con los nombres de usuario
        const query = 'SELECT Comments.*, Users.username FROM Comments JOIN Users ON Comments.user_id = Users.id WHERE post_id = ?';
        const [results] = await db.execute(query, [postId]); // Ejecutar la query con el ID del post
        res.status(200).json(results); // Enviar los resultados como respuesta
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Crear un nuevo comentario
export const createComment = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    const { post_id, comment } = req.body; // Obtener los datos del cuerpo de la solicitud
    try {
        // Query para insertar un nuevo comentario en la base de datos
        const query = 'INSERT INTO Comments (post_id, user_id, comment) VALUES (?, ?, ?)';
        await db.execute(query, [post_id, userId, comment]); // Ejecutar la query con los datos proporcionados
        res.status(201).json({ mensaje: 'Comentario creado exitosamente' }); // Responder con un mensaje de éxito
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Borrar un comentario
export const deleteComment = async (req, res) => {
    const commentId = req.params.id; // Obtener el ID del comentario de los parámetros de la solicitud
    const userId = req.user.userId; // Obtener el ID del usuario autenticado

    try {
        // Verificar que el comentario pertenece al usuario autenticado
        const [comment] = await db.execute('SELECT * FROM Comments WHERE id = ? AND user_id = ?', [commentId, userId]);
        if (comment.length === 0) {
            return res.status(403).json({ mensaje: 'Acceso denegado' }); // Responder con un mensaje de acceso denegado si el comentario no pertenece al usuario
        }

        // Query para borrar el comentario
        const query = 'DELETE FROM Comments WHERE id = ?';
        const [results] = await db.execute(query, [commentId]); // Ejecutar la query con el ID del comentario
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Comentario no encontrado' }); // Responder con un mensaje si el comentario no se encontró
        }
        res.status(200).json({ mensaje: 'Comentario borrado exitosamente' }); // Responder con un mensaje de éxito
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};
