import jwt from 'jsonwebtoken';

const secretKey = 'tu_clave_secreta'; // Debe ser almacenada de forma segura
let blacklistedTokens = []; // Lista negra de tokens

// Middleware para verificar el token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    if (blacklistedTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
