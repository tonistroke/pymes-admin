const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// Pool instance for PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ______________________________________________ CRUD ______________________________________________

// Create a new empleado with hashed password
app.post('/empleado', async (req, res) => {
  const {
    empleado_nombre,
    empleado_email,
    empleado_telefono,
    empleado_pass,
    empleado_cargo,
    departamento_id,
    empleado_num_seguro,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(empleado_pass, 10);

    const result = await pool.query(
      `INSERT INTO empleado 
      (empleado_nombre, empleado_email, empleado_telefono, empleado_pass, empleado_cargo, departamento_id, empleado_num_seguro) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        empleado_nombre,
        empleado_email,
        empleado_telefono,
        hashedPassword,
        empleado_cargo,
        departamento_id,
        empleado_num_seguro,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating empleado' });
  }
});

// Get all empleados
app.get('/empleados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empleado');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving empleados' });
  }
});

// Login and verify user credentials
app.post('/login', async (req, res) => {
  const { empleado_email, empleado_pass } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM empleado WHERE empleado_email = $1',
      [empleado_email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Empleado not found' });
    }

    const empleado = result.rows[0];

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(empleado_pass, empleado.empleado_pass);

    if (isPasswordValid) {
      res.status(200).json({
        message: 'Login successful',
        empleado_cargo: empleado.empleado_cargo,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Start the server
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
