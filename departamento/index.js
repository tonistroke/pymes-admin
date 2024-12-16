const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Enable CORS
app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ______________________________________________ CRUD ______________________________________________

// Create nuevo departamento
app.post('/departamento', async (req, res) => {
  const { depart_nombre, depart_telefono, depart_direccion } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO departamento (depart_nombre, depart_telefono, depart_direccion)
       VALUES ($1, $2, $3) RETURNING *`,
      [depart_nombre, depart_telefono, depart_direccion]
    );
    res.status(201).json(result.rows[0]); // Return created departamento data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating departamento' });
  }
});

// Read all departamentos
app.get('/departamentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departamento');
    res.status(200).json(result.rows); // Return all departamentos
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving departamentos' });
  }
});

// Read a single departamento by ID
app.get('/departamento/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM departamento WHERE departamento_id = $1', [id]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return single departamento data
    } else {
      res.status(404).json({ message: 'Departamento not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving departamento' });
  }
});

// Update a departamento
app.put('/departamento/:id', async (req, res) => {
  const { id } = req.params;
  const { depart_nombre, depart_telefono, depart_direccion } = req.body;

  try {
    const result = await pool.query(
      `UPDATE departamento SET 
        depart_nombre = $1, 
        depart_telefono = $2, 
        depart_direccion = $3
       WHERE departamento_id = $4 RETURNING *`,
      [depart_nombre, depart_telefono, depart_direccion, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return updated departamento data
    } else {
      res.status(404).json({ message: 'Departamento no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar datos' });
  }
});

// Delete a departamento
app.delete('/departamento/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM departamento WHERE departamento_id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Departamento eliminado!' });
    } else {
      res.status(404).json({ message: 'Departamento no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar departamento' });
  }
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
