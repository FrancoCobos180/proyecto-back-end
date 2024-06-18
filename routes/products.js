const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

// Función para leer productos desde el archivo JSON
const readProducts = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

// Función para escribir productos al archivo JSON
const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Ruta para listar productos con limitación
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit) || undefined;
    const products = readProducts();
    res.json(limit ? products.slice(0, limit) : products);
});

// Ruta para crear un nuevo producto
router.post('/', (req, res) => {
    const { id, title, description, code, price, status, stock, category } = req.body;

    // Validación básica de campos
    if (id === undefined || !title || !description || !code || price === undefined || status === undefined || stock === undefined || !category) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const products = readProducts();
    const newProduct = { id, title, description, code, price, status, stock, category };
    products.push(newProduct);
    writeProducts(products);

    res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
});

// Ruta para obtener un producto por ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const products = readProducts();
    const product = products.find(p => p.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Ruta para actualizar un producto por ID
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, code, price, status, stock, category } = req.body;
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        products[productIndex] = { id, title, description, code, price, status, stock, category };
        writeProducts(products);
        res.json({ message: `Producto con ID: ${id} actualizado`, product: products[productIndex] });
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

// Ruta para eliminar un producto por ID
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let products = readProducts();
    products = products.filter(p => p.id !== id);
    writeProducts(products);
    res.json({ message: `Producto con ID: ${id} eliminado` });
});

module.exports = router;
