import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear la conexión a la base de datos utilizando las variables de entorno
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Verificar la conexión a la base de datos
connection.connect()
    .then(() => {
        console.log('Conectado a la base de datos.');
    })
    .catch(err => {
        console.error('Error al conectar con la base de datos:', err.stack);
    });

export default connection;
