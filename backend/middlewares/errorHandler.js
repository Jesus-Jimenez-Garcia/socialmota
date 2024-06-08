const errorHandler = (err, req, res, next) => {
  // Registrar el error en la consola del servidor para propósitos de depuración
  console.error(err.stack);

  // Enviar una respuesta de error al cliente con un estado 500 (Error interno del servidor)
  res.status(500).json({ mensaje: 'Ocurrió un error interno en el servidor' });
};

export default errorHandler;
