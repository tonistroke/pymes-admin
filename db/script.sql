-- TABLAS
CREATE TABLE "producto" (
    producto_id SERIAL UNIQUE NOT NULL,
    producto_nombre VARCHAR(255) NOT NULL,
    producto_categoria VARCHAR(100) NOT NULL,
    producto_marca VARCHAR(100) NOT NULL,
    producto_modelo VARCHAR(100) NOT NULL,
    producto_precio_de_compra NUMERIC(10,2) NOT NULL,
    producto_precio_de_venta NUMERIC(10,2) NOT NULL,

	PRIMARY KEY (producto_id)
);

CREATE TABLE "departamento" (
    departamento_id SERIAL UNIQUE NOT NULL,
    depart_nombre VARCHAR(100) NOT NULL,
    depart_telefono VARCHAR(20),
    depart_direccion TEXT,

	PRIMARY KEY (departamento_id)
);

CREATE TABLE "inventario" (
    inventario_id SERIAL UNIQUE NOT NULL,
    producto_id INTEGER NOT NULL,
    departamento_id INTEGER NOT NULL,
    inventario_cantidad INTEGER,

	PRIMARY KEY (inventario_id),
	FOREIGN KEY (producto_id) REFERENCES "producto"(producto_id),
	FOREIGN KEY (departamento_id) REFERENCES "departamento"(departamento_id)
);

CREATE TABLE "empleado" (
    empleado_id SERIAL UNIQUE NOT NULL,
    empleado_nombre VARCHAR(100) NOT NULL,
    empleado_email VARCHAR(100) UNIQUE NOT NULL,
    empleado_telefono VARCHAR(20),
    empleado_pass TEXT NOT NULL,
    empleado_cargo VARCHAR(100),
    departamento_id INTEGER NOT NULL,
    empleado_num_seguro VARCHAR(20) UNIQUE,

	PRIMARY KEY (empleado_id) ,
	FOREIGN KEY (departamento_id) REFERENCES "departamento"(departamento_id)
);

CREATE TABLE "cliente"(
    cliente_id SERIAL UNIQUE NOT NULL,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) UNIQUE NOT NULL,
    cliente_direccion TEXT,
    cliente_telefono VARCHAR(50),
	
	PRIMARY KEY (cliente_id)
);

CREATE TABLE "venta" (
    venta_id SERIAL UNIQUE NOT NULL,
    venta_fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    empleado_id INTEGER REFERENCES empleado(empleado_id) NOT NULL,
    departamento_id INTEGER REFERENCES departamento(departamento_id) NOT NULL,
    cliente_id INTEGER REFERENCES cliente(cliente_id) NOT NULL,
    venta_importe_total NUMERIC(10,2) NOT NULL,

	PRIMARY KEY (venta_id)
);

CREATE TABLE "venta_items" (
    venta_items_id SERIAL UNIQUE NOT NULL,
    producto_id INTEGER NOT NULL,
    orden_id INTEGER NOT NULL,
    venta_items_cantidad INTEGER NOT NULL,
    venta_items_precio NUMERIC(10,2) NOT NULL,

	PRIMARY KEY (venta_items_id),
	producto_id (producto_id) REFERENCES "producto"(producto_id),
	orden_id (orden_id) REFERENCES "orden"(orden_id)
);

-- DATA INSERT

-- VISTAS

-- STORED PROCEDURES
