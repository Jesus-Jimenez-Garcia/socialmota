import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Clave secreta para firmar los tokens JWT (debe ser almacenada de forma segura)
const secretKey = 'tu_clave_secreta';

// Lista negra de tokens para manejar el cierre de sesión
let blacklistedTokens = [];

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    const { username, password, profile_picture, name, description } = req.body;

    // Verificar que la longitud de la contraseña sea de al menos 6 caracteres
    if (password.length < 6) {
        return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    try {
        // Encriptar la contraseña del usuario
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query para insertar un nuevo usuario en la base de datos
        const query = 'INSERT INTO Users (username, password, profile_picture, name, description) VALUES (?, ?, ?, ?, ?)';
        
        // Ejecutar la query con los datos proporcionados
        await db.execute(query, [username, hashedPassword, profile_picture, name, description]);
        
        // Responder con un mensaje de éxito
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (err) {
        // Manejar errores y responder con un mensaje de error
        res.status(500).json({ error: err.message });
    }
};

// Iniciar sesión
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query para seleccionar al usuario por nombre de usuario
        const query = 'SELECT * FROM Users WHERE username = ?';
        const [results] = await db.execute(query, [username]);
        
        // Verificar si el usuario existe
        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const user = results[0];

        // Comparar la contraseña proporcionada con la contraseña encriptada almacenada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // Crear un token JWT
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

        // Responder con un mensaje de éxito y el token
        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (err) {
        // Manejar errores y responder con un mensaje de error
        res.status(500).json({ error: err.message });
    }
};

// Cerrar sesión
export const logoutUser = (req, res) => {
    // Obtener el token de autorización de los encabezados de la solicitud
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // Verificar si el token está presente
    if (token == null) return res.status(401).json({ mensaje: 'Token faltante' });

    // Añadir el token a la lista negra
    blacklistedTokens.push(token);

    // Responder con un mensaje de éxito
    res.status(200).json({ mensaje: 'Cierre de sesión exitoso' });
};
