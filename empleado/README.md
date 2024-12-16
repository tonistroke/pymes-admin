# REST API CRUD de empleados:

- Create (POST /empleado): Insertar nuevo usuario.
- Read (GET /empleados): Fetching de todos los empleados.
- Read (Single) (GET /empleado/:id): Fetching de un solo empleado utilizando empleado_id.
- Update (PUT /empleado/:id): Actualiza datos de un empleado utilizando empleado_id.
- Delete (DELETE /empleado/:id): Eliminacion de un empleado.

POST http://localhost:3000/empleado
```json
{
  "empleado_nombre": "Juan Perez",
  "empleado_email": "juan@example.com",
  "empleado_telefono": "1234567890",
  "empleado_pass": "password123",
  "empleado_cargo": "Manager",
  "departamento_id": 1,
  "empleado_num_seguro": "A123456789"
}
```
### Fetching de todos los empleados
GET http://localhost:3000/empleados

### Seleccionar un empleado
GET http://localhost:3000/empleado/1

### Actualizar datos:
PUT http://localhost:3000/empleado/1
```json
{
  "empleado_nombre": "Juan Perez Updated",
  "empleado_telefono": "0987654321",
  "empleado_pass": "newpassword123",
  "empleado_cargo": "Senior Manager",
  "departamento_id": 1,
  "empleado_num_seguro": "A987654321"
}
```

### Eliminacion de un empleado usando `empleado_id`:
DELETE http://localhost:3000/empleado/1