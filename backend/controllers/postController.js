import db from "../config/db.js";

// Crear una nueva publicación
export const createPost = async (req, res) => {
  const userId = req.user.userId; // Obtener el ID del usuario autenticado
  const { content, image_url } = req.body; // Obtener el contenido y la URL de la imagen desde el cuerpo de la solicitud
  try {
    const query = "INSERT INTO Posts (user_id, content, image_url) VALUES (?, ?, ?)";
    await db.execute(query, [userId, content, image_url]); // Ejecutar la consulta para insertar la nueva publicación
    res.status(201).json({ mensaje: "Publicación creada exitosamente" }); // Responder con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Obtener todos los posts con paginación
export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Obtener el número de página de la solicitud, por defecto 1
  const limit = parseInt(req.query.limit) || 10; // Obtener el límite de publicaciones por página, por defecto 10
  const offset = (page - 1) * limit; // Calcular el offset para la consulta
  const userId = req.user ? req.user.userId : null; // Verificar si el usuario está autenticado

  try {
    const query = `
      SELECT Posts.*, Users.name, Users.profile_picture, 
      (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Posts.id) AS likes,
      (SELECT COUNT(*) FROM Comments WHERE Comments.post_id = Posts.id) AS comments,
      (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Posts.id AND Likes.user_id = ?) AS likedByUser
      FROM Posts 
      JOIN Users ON Posts.user_id = Users.id 
      ORDER BY Posts.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener las publicaciones
    res.status(200).json(results); // Responder con las publicaciones
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Obtener los posts más populares con paginación
export const getPopularPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Obtener el número de página de la solicitud, por defecto 1
  const limit = parseInt(req.query.limit) || 10; // Obtener el límite de publicaciones por página, por defecto 10
  const offset = (page - 1) * limit; // Calcular el offset para la consulta
  const userId = req.user ? req.user.userId : null; // Verificar si el usuario está autenticado

  try {
    const query = `
      SELECT Posts.*, Users.name, Users.profile_picture, 
      (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Posts.id) AS likes,
      (SELECT COUNT(*) FROM Comments WHERE Comments.post_id = Posts.id) AS comments,
      (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Posts.id AND Likes.user_id = ?) AS likedByUser
      FROM Posts 
      JOIN Users ON Posts.user_id = Users.id 
      ORDER BY likes DESC, Posts.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener las publicaciones populares
    res.status(200).json(results); // Responder con las publicaciones populares
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Obtener las publicaciones de los usuarios seguidos con paginación
export const getFollowedPosts = async (req, res) => {
  const userId = req.user.userId; // Obtener el ID del usuario autenticado
  const page = parseInt(req.query.page) || 1; // Obtener el número de página de la solicitud, por defecto 1
  const limit = parseInt(req.query.limit) || 10; // Obtener el límite de publicaciones por página, por defecto 10
  const offset = (page - 1) * limit; // Calcular el offset para la consulta

  try {
    const query = `
      SELECT Posts.*, Users.name, Users.profile_picture,
      (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Posts.id) AS likes,
      (SELECT COUNT(*) FROM Comments WHERE Comments.post_id = Posts.id) AS comments
      FROM Posts
      JOIN Followers ON Posts.user_id = Followers.followed_id
      JOIN Users ON Posts.user_id = Users.id
      WHERE Followers.follower_id = ?
      ORDER BY Posts.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener las publicaciones de los seguidos
    res.status(200).json(results); // Responder con las publicaciones de los seguidos
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Obtener las publicaciones de los usuarios seguidos ordenadas por mayor cantidad de likes con paginación
export const getFollowedPostsByLikes = async (req, res) => {
  const userId = req.user.userId; // Obtener el ID del usuario autenticado
  const page = parseInt(req.query.page) || 1; // Obtener el número de página de la solicitud, por defecto 1
  const limit = parseInt(req.query.limit) || 10; // Obtener el límite de publicaciones por página, por defecto 10
  const offset = (page - 1) * limit; // Calcular el offset para la consulta

  try {
    const query = `
      SELECT Posts.*, Users.name, Users.profile_picture, 
      (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Posts.id) AS likes,
      (SELECT COUNT(*) FROM Comments WHERE Comments.post_id = Posts.id) AS comments
      FROM Posts
      JOIN Followers ON Posts.user_id = Followers.followed_id
      JOIN Users ON Posts.user_id = Users.id
      WHERE Followers.follower_id = ?
      ORDER BY likes DESC, Posts.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener las publicaciones de los seguidos ordenadas por likes
    res.status(200).json(results); // Responder con las publicaciones de los seguidos ordenadas por likes
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Obtener las publicaciones del usuario autenticado con paginación
export const getUserPosts = async (req, res) => {
  const userId = req.user.userId; // Obtener el ID del usuario autenticado
  const page = parseInt(req.query.page) || 1; // Obtener el número de página de la solicitud, por defecto 1
  const limit = parseInt(req.query.limit) || 10; // Obtener el límite de publicaciones por página, por defecto 10
  const offset = (page - 1) * limit; // Calcular el offset para la consulta

  try {
    const query = `
      SELECT Posts.*, Users.name, Users.profile_picture,
      (SELECT COUNT(*) FROM Likes WHERE Likes.post_id = Posts.id) AS likes,
      (SELECT COUNT(*) FROM Comments WHERE Comments.post_id = Posts.id) AS comments
      FROM Posts 
      JOIN Users ON Posts.user_id = Users.id 
      WHERE Posts.user_id = ? 
      ORDER BY Posts.created_at DESC
      LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await db.execute(query, [userId]); // Ejecutar la consulta para obtener las publicaciones del usuario autenticado
    res.status(200).json(results); // Responder con las publicaciones del usuario autenticado
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Actualizar una publicación
export const updatePost = async (req, res) => {
  const postId = req.params.id; // Obtener el ID de la publicación desde los parámetros de la solicitud
  const userId = req.user.userId; // Obtener el ID del usuario autenticado
  const { content, image_url } = req.body; // Obtener el contenido y la URL de la imagen desde el cuerpo de la solicitud

  try {
    // Verificar que el post pertenece al usuario autenticado
    const [post] = await db.execute("SELECT * FROM Posts WHERE id = ? AND user_id = ?", [postId, userId]);
    if (post.length === 0) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const query = "UPDATE Posts SET content = ?, image_url = ? WHERE id = ?";
    const [results] = await db.execute(query, [content, image_url, postId]); // Ejecutar la consulta para actualizar la publicación
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }
    res.status(200).json({ mensaje: "Publicación actualizada exitosamente" }); // Responder con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};

// Borrar una publicación
export const deletePost = async (req, res) => {
  const postId = req.params.id; // Obtener el ID de la publicación desde los parámetros de la solicitud
  const userId = req.user.userId; // Obtener el ID del usuario autenticado

  try {
    // Verificar que el post pertenece al usuario autenticado
    const [post] = await db.execute("SELECT * FROM Posts WHERE id = ? AND user_id = ?", [postId, userId]);
    if (post.length === 0) {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const query = "DELETE FROM Posts WHERE id = ?";
    const [results] = await db.execute(query, [postId]); // Ejecutar la consulta para borrar la publicación
    if (results.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }
    res.status(200).json({ mensaje: "Publicación borrada exitosamente" }); // Responder con un mensaje de éxito
  } catch (err) {
    res.status(500).json({ error: err.message }); // Manejar errores y responder con un mensaje de error
  }
};
