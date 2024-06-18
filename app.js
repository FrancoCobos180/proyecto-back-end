const express = require('express');
const app = express();
const port = 8080;

app.use(express.json()); // Middleware para analizar JSON

// Importar los routers
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Usar los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
