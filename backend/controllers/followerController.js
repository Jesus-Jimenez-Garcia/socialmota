import db from '../config/db.js';

// Seguir a un usuario
export const followUser = async (req, res) => {
    const followerId = req.user.userId; // Obtener el ID del usuario que sigue
    const { followed_id } = req.body; // Obtener el ID del usuario a ser seguido
    try {
        // Query para insertar una nueva relación de seguimiento en la base de datos
        const query = 'INSERT INTO Followers (follower_id, followed_id) VALUES (?, ?)';
        await db.execute(query, [followerId, followed_id]); // Ejecutar la query con los IDs correspondientes
        res.status(201).json({ mensaje: 'Usuario seguido exitosamente' }); // Responder con un mensaje de éxito
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Obtener la lista de seguidos del usuario autenticado
export const getFollowedUsers = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    try {
        // Query para obtener la lista de usuarios seguidos por el usuario autenticado
        const query = `
            SELECT Users.id, Users.username, Users.profile_picture, Users.name, Users.description
            FROM Users
            JOIN Followers ON Users.id = Followers.followed_id
            WHERE Followers.follower_id = ?`;
        const [results] = await db.execute(query, [userId]); // Ejecutar la query con el ID del usuario autenticado
        res.status(200).json(results); // Enviar los resultados como respuesta
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Obtener la lista de seguidores del usuario autenticado
export const getFollowers = async (req, res) => {
    const userId = req.user.userId; // Obtener el ID del usuario autenticado
    try {
        // Query para obtener la lista de seguidores del usuario autenticado
        const query = `
            SELECT Users.id, Users.username, Users.profile_picture, Users.name, Users.description
            FROM Users
            JOIN Followers ON Users.id = Followers.follower_id
            WHERE Followers.followed_id = ?`;
        const [results] = await db.execute(query, [userId]); // Ejecutar la query con el ID del usuario autenticado
        res.status(200).json(results); // Enviar los resultados como respuesta
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};

// Dejar de seguir a un usuario
export const unfollowUser = async (req, res) => {
    const followerId = req.user.userId; // Obtener el ID del usuario que deja de seguir
    const { followed_id } = req.body; // Obtener el ID del usuario que es dejado de seguir
    try {
        // Query para eliminar una relación de seguimiento de la base de datos
        const query = 'DELETE FROM Followers WHERE follower_id = ? AND followed_id = ?';
        const [results] = await db.execute(query, [followerId, followed_id]); // Ejecutar la query con los IDs correspondientes
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Relación de seguimiento no encontrada' }); // Responder si la relación no se encontró
        }
        res.status(200).json({ mensaje: 'Usuario dejado de seguir exitosamente' }); // Responder con un mensaje de éxito
    } catch (err) {
        res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
    }
};
