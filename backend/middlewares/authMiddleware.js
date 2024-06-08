import jwt from 'jsonwebtoken';

const secretKey = 'tu_clave_secreta'; // Debe ser almacenada de forma segura
let blacklistedTokens = []; // Lista negra de tokens

// Middleware para verificar el token de autenticación
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Obtener el encabezado de autorización
    const token = authHeader && authHeader.split(' ')[1]; // Extraer el token del encabezado
    if (token == null) return res.status(401).json({ mensaje: 'Acceso denegado, token faltante' }); // Verificar si el token está presente

    // Verificar si el token está en la lista negra
    if (blacklistedTokens.includes(token)) {
        return res.status(403).json({ mensaje: 'Acceso denegado, token en lista negra' }); // Denegar acceso si el token está en la lista negra
    }

    // Verificar la validez del token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ mensaje: 'Token no válido' }); // Denegar acceso si el token no es válido
        req.user = user; // Almacenar la información del usuario en la solicitud
        next(); // Pasar al siguiente middleware o controlador
    });
};

// Añadir token a la lista negra
export const blacklistToken = (token) => {
    blacklistedTokens.push(token); // Añadir el token a la lista negra
};
