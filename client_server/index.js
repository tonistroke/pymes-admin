const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/sell-dash', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'seller_dash.html'));
});

app.get('/sell-dash/venta', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'venta.html'));
});

app.get('/admin-dash', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin_dash.html'));
});

app.get('/admin-dash/empleado', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'empleado.html'));
});

app.get('/admin-dash/clientes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cliente.html'));
});

app.get('/admin-dash/inventario', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inventario.html'));
});

app.get('/admin-dash/data-visualizer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'visualizer.html'));
});

// CRUD De departamentos de la empresa
app.get('/admin-dash/departamentos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'departamento.html'));
});


// CRUD De productos
app.get('/admin-dash/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'producto.html'));
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
