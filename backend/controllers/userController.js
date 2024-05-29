import db from '../config/db.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios con paginación

export const getAllUsers = async (req, res) => {
  const userId = req.user.userId; // ID del usuario autenticado
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
      const query = `SELECT id, username, profile_picture, name, description 
                     FROM Users 
                     WHERE id != ? 
                     LIMIT ${limit} OFFSET ${offset}`;
      const [results] = await db.execute(query, [userId]);
      res.status(200).json(results);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


// Obtener el perfil del usuario autenticado
export const getUserProfile = async (req, res) => {
  const userId = req.user.userId;
  try {
      const query = 'SELECT id, username, profile_picture, name, description FROM Users WHERE id = ?';
      const [results] = await db.execute(query, [userId]);
      if (results.length === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json(results[0]);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const userId = req.user.userId; // Obtener el userId del token de autenticación
  const { username, password, profile_picture, name, description } = req.body;
  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'UPDATE Users SET username = ?, password = ?, profile_picture = ?, name = ?, description = ? WHERE id = ?';
      const [results] = await db.execute(query, [username, hashedPassword, profile_picture, name, description, userId]);
      if (results.affectedRows === 0) {
          return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
// Borrar un usuario
export const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const query = 'DELETE FROM Users WHERE id = ?';
        const [results] = await db.execute(query, [userId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json({ mensaje: 'Usuario borrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
