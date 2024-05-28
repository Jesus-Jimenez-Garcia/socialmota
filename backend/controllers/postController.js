import db from "../config/db.js";

// Crear una nueva publicación
export const createPost = async (req, res) => {
  const userId = req.user.userId;
  const { content, image_url } = req.body;
  try {
    const query =
      "INSERT INTO Posts (user_id, content, image_url) VALUES (?, ?, ?)";
    await db.execute(query, [userId, content, image_url]);
    res.status(201).json({ mensaje: "Publicación creada exitosamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los posts con paginación
export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const query = `SELECT * FROM Posts LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener las publicaciones de los usuarios seguidos con paginación
export const getFollowedPosts = async (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const query = `
          SELECT Posts.* FROM Posts
          JOIN Followers ON Posts.user_id = Followers.followed_id
          WHERE Followers.follower_id = ?
          LIMIT ${limit} OFFSET ${offset}
      `;
    const [results] = await db.execute(query, [userId]);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener las publicaciones del usuario autenticado con paginación
export const getUserPosts = async (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const query = `SELECT * FROM Posts WHERE user_id = ? LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, [userId]);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar una publicación
export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  const { content, image_url } = req.body;

  try {
    // Verificar que el post pertenece al usuario autenticado
    const [post] = await db.execute(
      "SELECT * FROM Posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );
    if (post.length === 0) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const query = "UPDATE Posts SET content = ?, image_url = ? WHERE id = ?";
    const [results] = await db.execute(query, [content, image_url, postId]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }
    res.status(200).json({ mensaje: "Publicación actualizada exitosamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Borrar una publicación
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;

  try {
    // Verificar que el post pertenece al usuario autenticado
    const [post] = await db.execute(
      "SELECT * FROM Posts WHERE id = ? AND user_id = ?",
      [postId, userId]
    );
    if (post.length === 0) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const query = "DELETE FROM Posts WHERE id = ?";
    const [results] = await db.execute(query, [postId]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }
    res.status(200).json({ mensaje: "Publicación borrada exitosamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
