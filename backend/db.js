import mysql from 'mysql2/promise';

// Crear la conexión a la base de datos
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Myalimoche6',
    database: 'socialMota'
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

export default connection;
