# REST API CRUD de productos:
POST /producto – Create un nuevo producto en la BD.
GET /productos – Fetch de todos los productos de la BD.
GET /producto/:id – Retrive un producto producto_id.
PUT /producto/:id – Update de un producto con su producto_id.
DELETE /producto/:id – Delete un producto con producto_id.


### Create producto `POST`:
```
POST http://localhost:8083/producto
```

**Cuerpo**
```json
{
  "producto_nombre": "Laptop",
  "producto_categoria": "Electronics",
  "producto_marca": "Dell",
  "producto_modelo": "Inspiron 15",
  "producto_precio_de_compra": 500.00,
  "producto_precio_de_venta": 600.00,
  "producto_barcode": "1234567890"
}
```

Get All Products (GET)
```json
GET http://localhost:8083/productos
```

Get Product by ID (GET)
```json
GET http://localhost:8083/producto/1
```

Update Product (PUT)
```
PUT http://localhost:8083/producto/1
```

```json
{
  "producto_nombre": "Laptop Updated",
  "producto_categoria": "Electronics",
  "producto_marca": "Dell",
  "producto_modelo": "Inspiron 15 Updated",
  "producto_precio_de_compra": 550.00,
  "producto_precio_de_venta": 650.00,
  "producto_barcode": "1234567891"
}
```

Delete Product (DELETE)
```
DELETE http://localhost:8083/producto/1
```