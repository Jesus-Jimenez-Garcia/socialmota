import db from '../db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const secretKey = 'tu_clave_secreta'; // Debe ser almacenada de forma segura
let blacklistedTokens = []; // Lista negra de tokens

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    const { username, password, profile_picture, name, description } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Users (username, password, profile_picture, name, description) VALUES (?, ?, ?, ?, ?)';
        await db.execute(query, [username, hashedPassword, profile_picture, name, description]);
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const query = 'SELECT * FROM Users WHERE username = ?';
        const [results] = await db.execute(query, [username]);
        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Cerrar sesión
export const logoutUser = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    blacklistedTokens.push(token);
    res.status(200).json({ mensaje: 'Cierre de sesión exitoso' });
};
