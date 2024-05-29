import db from '../config/db.js';

// Seguir a un usuario
export const followUser = async (req, res) => {
    const followerId = req.user.userId;
    const { followed_id } = req.body;
    try {
        const query = 'INSERT INTO Followers (follower_id, followed_id) VALUES (?, ?)';
        await db.execute(query, [followerId, followed_id]);
        res.status(201).json({ mensaje: 'Usuario seguido exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener la lista de seguidos del usuario autenticado
export const getFollowedUsers = async (req, res) => {
  const userId = req.user.userId;
  try {
      const query = `
          SELECT Users.id, Users.username, Users.profile_picture, Users.name, Users.description
          FROM Users
          JOIN Followers ON Users.id = Followers.followed_id
          WHERE Followers.follower_id = ?`;
      const [results] = await db.execute(query, [userId]);
      res.status(200).json(results);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Obtener la lista de seguidores del usuario autenticado
export const getFollowers = async (req, res) => {
  const userId = req.user.userId;
  try {
      const query = `
          SELECT Users.id, Users.username, Users.profile_picture, Users.name, Users.description
          FROM Users
          JOIN Followers ON Users.id = Followers.follower_id
          WHERE Followers.followed_id = ?`;
      const [results] = await db.execute(query, [userId]);
      res.status(200).json(results);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Dejar de seguir a un usuario
export const unfollowUser = async (req, res) => {
    const followerId = req.user.userId;
    const { followed_id } = req.body;
    try {
        const query = 'DELETE FROM Followers WHERE follower_id = ? AND followed_id = ?';
        const [results] = await db.execute(query, [followerId, followed_id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Relación de seguimiento no encontrada' });
        }
        res.status(200).json({ mensaje: 'Usuario dejado de seguir exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
