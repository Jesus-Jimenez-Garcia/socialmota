import db from '../config/db.js';

export const sendMessage = async (req, res) => {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.userId;

    try {
        const query = 'INSERT INTO Messages (sender_id, receiver_id, content) VALUES (?, ?, ?)';
        await db.execute(query, [sender_id, receiver_id, content]);
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMessages = async (req, res) => {
    const userId = req.user.userId;
    const { contactId } = req.params;

    try {
        const query = `
            SELECT * FROM Messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?) 
            ORDER BY created_at`;
        const [results] = await db.execute(query, [userId, contactId, contactId, userId]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Nueva función para obtener las conversaciones
export const getConversations = async (req, res) => {
  const userId = req.user.userId;

  try {
      const query = `
          SELECT DISTINCT u.id, u.username, u.profile_picture, u.name
          FROM Users u
          JOIN Messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
          WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id != ?
      `;
      const [results] = await db.execute(query, [userId, userId, userId]);
      res.status(200).json(results);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};
