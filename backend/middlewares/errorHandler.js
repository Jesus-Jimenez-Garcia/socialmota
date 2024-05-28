const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Ocurrió un error interno en el servidor' });
};

export default errorHandler;
