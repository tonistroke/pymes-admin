const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Enable CORS
app.use(cors());

// Create a new Pool instance for PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// CRUD Operations for "producto"

// Create a new producto
app.post('/producto', async (req, res) => {
  const { producto_nombre, producto_categoria, producto_marca, producto_modelo, producto_precio_de_compra, producto_precio_de_venta, producto_barcode } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO producto (producto_nombre, producto_categoria, producto_marca, producto_modelo, producto_precio_de_compra, producto_precio_de_venta, producto_barcode)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [producto_nombre, producto_categoria, producto_marca, producto_modelo, producto_precio_de_compra, producto_precio_de_venta, producto_barcode]
    );
    res.status(201).json(result.rows[0]); // Return created product data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating producto' });
  }
});

// Read all productos
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM producto');
    res.status(200).json(result.rows); // Return all products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving productos' });
  }
});

// Read a single producto by ID
app.get('/producto/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM producto WHERE producto_id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return product data
    } else {
      res.status(404).json({ message: 'Producto not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving producto' });
  }
});

// Update a producto
app.put('/producto/:id', async (req, res) => {
  const { id } = req.params;
  const { producto_nombre, producto_categoria, producto_marca, producto_modelo, producto_precio_de_compra, producto_precio_de_venta, producto_barcode } = req.body;

  try {
    const result = await pool.query(
      `UPDATE producto SET 
        producto_nombre = $1, 
        producto_categoria = $2, 
        producto_marca = $3, 
        producto_modelo = $4, 
        producto_precio_de_compra = $5, 
        producto_precio_de_venta = $6, 
        producto_barcode = $7
       WHERE producto_id = $8 RETURNING *`,
      [producto_nombre, producto_categoria, producto_marca, producto_modelo, producto_precio_de_compra, producto_precio_de_venta, producto_barcode, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return updated product
    } else {
      res.status(404).json({ message: 'Producto not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating producto' });
  }
});

// Delete a producto
app.delete('/producto/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM producto WHERE producto_id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Producto deleted successfully' });
    } else {
      res.status(404).json({ message: 'Producto not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting producto' });
  }
});

// Start the server
const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
