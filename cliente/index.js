// clienteService.js

const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// CRUD Operations for "cliente"

// Create a new cliente
app.post('/cliente', async (req, res) => {
  const { cliente_nombre, cliente_email, cliente_direccion, cliente_telefono } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cliente (cliente_nombre, cliente_email, cliente_direccion, cliente_telefono)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [cliente_nombre, cliente_email, cliente_direccion, cliente_telefono]
    );
    res.status(201).json(result.rows[0]); // Return created cliente data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating cliente' });
  }
});

// Read all clientes
app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cliente');
    res.status(200).json(result.rows); // Return all clientes
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving clientes' });
  }
});

// Read a single cliente by ID
app.get('/cliente/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM cliente WHERE cliente_id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return single cliente data
    } else {
      res.status(404).json({ message: 'Cliente not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving cliente' });
  }
});

// Update a cliente
app.put('/cliente/:id', async (req, res) => {
  const { id } = req.params;
  const { cliente_nombre, cliente_email, cliente_direccion, cliente_telefono } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cliente SET 
        cliente_nombre = $1, 
        cliente_email = $2, 
        cliente_direccion = $3, 
        cliente_telefono = $4
       WHERE cliente_id = $5 RETURNING *`,
      [cliente_nombre, cliente_email, cliente_direccion, cliente_telefono, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return updated cliente data
    } else {
      res.status(404).json({ message: 'Cliente not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating cliente' });
  }
});

// Delete a cliente
app.delete('/cliente/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM cliente WHERE cliente_id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Cliente deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cliente not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting cliente' });
  }
});

// Start the server
const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
