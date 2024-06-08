import db from '../config/db.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios con paginación
export const getAllUsers = async (req, res) => {
  const userId = req.user.userId; // ID del usuario autenticado
  const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
  const limit = parseInt(req.query.limit) || 10; // Límite de usuarios por página, por defecto 10
  const offset = (page - 1) * limit; // Calcular el offset para la consulta

  try {
    const query = `SELECT id, username, profile_picture, name, description 
                   FROM Users 
                   WHERE id != ? 
                   LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener los usuarios
    res.status(200).json(results); // Responder con los usuarios obtenidos
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Obtener el perfil del usuario autenticado
export const getUserProfile = async (req, res) => {
  const userId = req.user.userId; // ID del usuario autenticado
  try {
    const query = 'SELECT id, username, profile_picture, name, description FROM Users WHERE id = ?';
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener el perfil del usuario
    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); // Responder con un mensaje de error si el usuario no existe
    }
    res.status(200).json(results[0]); // Responder con el perfil del usuario
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Obtener los detalles de un usuario específico
export const getUserDetails = async (req, res) => {
  const userId = req.params.id; // ID del usuario específico a obtener
  try {
    const query = 'SELECT id, username, profile_picture, name, description FROM Users WHERE id = ?';
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener los detalles del usuario
    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); // Responder con un mensaje de error si el usuario no existe
    }
    res.status(200).json(results[0]); // Responder con los detalles del usuario
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Cambiar la contraseña del usuario
export const changePassword = async (req, res) => {
  const userId = req.user.userId; // ID del usuario autenticado
  const { oldPassword, newPassword } = req.body; // Obtener la contraseña antigua y la nueva desde el cuerpo de la solicitud

  if (newPassword.length < 6) {
    return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' }); // Verificar que la nueva contraseña tiene al menos 6 caracteres
  }

  try {
    const [user] = await db.execute('SELECT * FROM Users WHERE id = ?', [userId]); // Obtener el usuario actual
    if (user.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); // Responder con un mensaje de error si el usuario no existe
    }

    const isMatch = await bcrypt.compare(oldPassword, user[0].password); // Verificar que la contraseña antigua coincide
    if (!isMatch) {
      return res.status(400).json({ mensaje: 'Contraseña antigua no correcta' }); // Responder con un mensaje de error si la contraseña antigua no coincide
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hashear la nueva contraseña
    const query = 'UPDATE Users SET password = ? WHERE id = ?';
    await db.execute(query, [hashedPassword, userId]); // Ejecutar la consulta para actualizar la contraseña

    res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' }); // Responder con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const userId = req.user.userId; // Obtener el userId del token de autenticación
  const { username, password, profile_picture, name, description } = req.body; // Obtener los datos del usuario desde el cuerpo de la solicitud

  try {
    // Obtener los valores actuales del usuario
    const [currentUser] = await db.execute('SELECT * FROM Users WHERE id = ?', [userId]);
    
    if (currentUser.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); // Responder con un mensaje de error si el usuario no existe
    }

    const existingUser = currentUser[0];

    // Usar los valores existentes si no se proporcionan nuevos valores
    const newUsername = username || existingUser.username;
    const newProfilePicture = profile_picture || existingUser.profile_picture;
    const newName = name || existingUser.name;
    const newDescription = description || existingUser.description;
    const newPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    const query = 'UPDATE Users SET username = ?, password = ?, profile_picture = ?, name = ?, description = ? WHERE id = ?';
    const [results] = await db.execute(query, [newUsername, newPassword, newProfilePicture, newName, newDescription, userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); // Responder con un mensaje de error si no se actualizó ningún usuario
    }
    
    res.status(200).json({ mensaje: 'Usuario actualizado exitosamente' }); // Responder con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Borrar un usuario
export const deleteUser = async (req, res) => {
  const userId = req.user.userId; // Obtener el ID del usuario autenticado
  try {
    const query = 'DELETE FROM Users WHERE id = ?';
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para borrar el usuario
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' }); // Responder con un mensaje de error si el usuario no existe
    }
    res.status(200).json({ mensaje: 'Usuario borrado exitosamente' }); // Responder con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};
