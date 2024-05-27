import db from '../db.js';

// Crear una nueva publicación
export const createPost = async (req, res) => {
    const { user_id, content, image_url } = req.body;
    try {
        const query = 'INSERT INTO Posts (user_id, content, image_url) VALUES (?, ?, ?)';
        await db.execute(query, [user_id, content, image_url]);
        res.status(201).json({ mensaje: 'Publicación creada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todas las publicaciones
export const getAllPosts = async (req, res) => {
    try {
        const [results] = await db.execute('SELECT * FROM Posts');
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener las publicaciones de los usuarios seguidos
export const getFollowedPosts = async (req, res) => {
    const userId = req.user.userId;
    try {
        const query = `
            SELECT Posts.* FROM Posts
            JOIN Followers ON Posts.user_id = Followers.followed_id
            WHERE Followers.follower_id = ?
        `;
        const [results] = await db.execute(query, [userId]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Borrar una publicación
export const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const query = 'DELETE FROM Posts WHERE id = ?';
        const [results] = await db.execute(query, [postId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Publicación no encontrada' });
        }
        res.status(200).json({ mensaje: 'Publicación borrada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
