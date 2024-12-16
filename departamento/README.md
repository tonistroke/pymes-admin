# REST API CRUD de departamentos (tiendas, locales, puestos, oficinas).

### Rutas:
POST /departamento – Create nuevo departamento.
GET /departamentos – Fetch todos los depart.
GET /departamento/:id – Fetch un departamento utilizando su departamento_id.
PUT /departamento/:id – Update un departamento con departamento_id.
DELETE /departamento/:id – Delete un departamento con departamento_id.


### Metodo `POST`: Crear un departamento nuevo
```
POST http://localhost:8081/departamento
```
```json
{
  "depart_nombre": "HR",
  "depart_telefono": "555-1234",
  "depart_direccion": "Building A, 2nd Floor"
}
```

### Metodo `GET`: Fetch de todos los departamentos
```
GET http://localhost:8081/departamentos
```

### Metodo `GET`: Para insertar un solo usuario
```
GET http://localhost:8081/departamento/1
```

### Metodo `PUT`: Actualizar Departamento
```
PUT http://localhost:8081/departamento/1
```

```json
{
  "depart_nombre": "Tienda N23",
  "depart_telefono": "355-5678",
  "depart_direccion": "Condado del Rey, Edificio A, 3er Piso"
}
```

### Metodo: `DELETE`: Eliminar Tienda
```
DELETE http://localhost:8081/departamento/1
```
