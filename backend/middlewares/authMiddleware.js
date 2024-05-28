import jwt from 'jsonwebtoken';

const secretKey = 'tu_clave_secreta'; // Debe ser almacenada de forma segura
let blacklistedTokens = []; // Lista negra de tokens

// Middleware para verificar el token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ mensaje: 'Acceso denegado, token faltante' });

    if (blacklistedTokens.includes(token)) {
        return res.status(403).json({ mensaje: 'Acceso denegado, token en lista negra' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ mensaje: 'Token no válido' });
        req.user = user;
        next();
    });
};

// Añadir token a la lista negra
export const blacklistToken = (token) => {
    blacklistedTokens.push(token);
};
