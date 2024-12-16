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

// Insert a new sale (venta)
app.post('/venta', async (req, res) => {
  const { empleado_id, cliente_id, productos } = req.body; // productos should be an array with product_id, cantidad

  // Validate products array
  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ message: "Productos are required." });
  }

  try {
    // Get the department id from the empleado
    const empleadoResult = await pool.query('SELECT departamento_id FROM empleado WHERE empleado_id = $1', [empleado_id]);
    if (empleadoResult.rows.length === 0) {
      return res.status(404).json({ message: 'Empleado not found' });
    }
    const departamento_id = empleadoResult.rows[0].departamento_id;

    // Start a transaction for creating the venta and venta_items
    await pool.query('BEGIN');

    // Calculate the total price
    let totalImporte = 0;
    const ventaItems = [];

    // Loop through the products to calculate total price and gather items
    for (let producto of productos) {
      // Query the product's selling price from the producto table
      const productoResult = await pool.query(
        'SELECT producto_precio_de_venta FROM producto WHERE producto_id = $1',
        [producto.producto_id]
      );

      if (productoResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ message: 'Producto not found for ID ' + producto.producto_id });
      }

      const producto_precio_de_venta = productoResult.rows[0].producto_precio_de_venta;
      const precio = producto.cantidad * producto_precio_de_venta;
      totalImporte += precio;

      ventaItems.push({ producto_id: producto.producto_id, cantidad: producto.cantidad, precio });
    }

    // Insert into venta
    const ventaResult = await pool.query(
      `INSERT INTO venta (empleado_id, departamento_id, cliente_id, venta_importe_total, venta_estatus)
       VALUES ($1, $2, $3, $4, 'pendiente') RETURNING venta_id`,
      [empleado_id, departamento_id, cliente_id || null, totalImporte]
    );
    const venta_id = ventaResult.rows[0].venta_id;

    // Insert into venta_items
    for (let item of ventaItems) {
      await pool.query(
        `INSERT INTO venta_items (producto_id, venta_id, venta_items_cantidad, venta_items_precio)
         VALUES ($1, $2, $3, $4)`,
        [item.producto_id, venta_id, item.cantidad, item.precio]
      );

      // Decrement inventory
      const inventarioResult = await pool.query(
        `SELECT inventario_cantidad FROM inventario WHERE producto_id = $1 AND departamento_id = $2`,
        [item.producto_id, departamento_id]
      );

      if (inventarioResult.rows.length === 0 || inventarioResult.rows[0].inventario_cantidad < item.cantidad) {
        await pool.query('ROLLBACK');
        return res.status(400).json({ message: 'Not enough inventory for product ' + item.producto_id });
      }

      const newQuantity = inventarioResult.rows[0].inventario_cantidad - item.cantidad;
      await pool.query(
        `UPDATE inventario SET inventario_cantidad = $1 WHERE producto_id = $2 AND departamento_id = $3`,
        [newQuantity, item.producto_id, departamento_id]
      );
    }

    // Commit the transaction
    await pool.query('COMMIT');
    res.status(201).json({ message: 'Venta created successfully', venta_id });
  } catch (error) {
    console.error(error);
    await pool.query('ROLLBACK');
    res.status(500).json({ message: 'Error creating venta', error });
  }
});

// Start the server
const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
