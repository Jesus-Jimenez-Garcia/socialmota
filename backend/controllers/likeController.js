import db from '../db.js';

// Dar "me gusta" a una publicación
export const likePost = async (req, res) => {
    const { user_id, post_id } = req.body;
    try {
        const query = 'INSERT INTO Likes (user_id, post_id) VALUES (?, ?)';
        await db.execute(query, [user_id, post_id]);
        res.status(201).json({ mensaje: 'Me gusta añadido exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Quitar "me gusta" de una publicación
export const unlikePost = async (req, res) => {
    const likeId = req.params.id;
    try {
        const query = 'DELETE FROM Likes WHERE id = ?';
        const [results] = await db.execute(query, [likeId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Me gusta no encontrado' });
        }
        res.status(200).json({ mensaje: 'Me gusta eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
