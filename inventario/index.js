// inventarioService.js

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

// CRUD Operations for "inventario"

// Create a new inventario record
app.get('/inventarios', async (req, res) => {
  try {
    // Query the 'inventario_depart_prod' view
    const result = await pool.query('SELECT * FROM inventario_depart_prod');
    res.status(200).json(result.rows); // Return data from the view
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving inventarios' });
  }
});

// Read all inventario records
app.get('/inventarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario');
    res.status(200).json(result.rows); // Return all inventarios
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving inventarios' });
  }
});

// Read a single inventario by ID
app.get('/inventario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM inventario WHERE inventario_id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return single inventario data
    } else {
      res.status(404).json({ message: 'Inventario not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving inventario' });
  }
});

// Update an inventario record
app.put('/inventario/:id', async (req, res) => {
  const { id } = req.params;
  const { producto_id, departamento_id, inventario_cantidad } = req.body;

  try {
    const result = await pool.query(
      `UPDATE inventario SET 
        producto_id = $1, 
        departamento_id = $2, 
        inventario_cantidad = $3
       WHERE inventario_id = $4 RETURNING *`,
      [producto_id, departamento_id, inventario_cantidad, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return updated inventario data
    } else {
      res.status(404).json({ message: 'Inventario not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating inventario' });
  }
});

// Delete an inventario record
app.delete('/inventario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM inventario WHERE inventario_id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Inventario deleted successfully' });
    } else {
      res.status(404).json({ message: 'Inventario not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting inventario' });
  }
});

// Start the server
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
