-- EXTENSIONES
--CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLAS
CREATE TABLE "producto" (
    producto_id SERIAL,
    producto_nombre VARCHAR(255) NOT NULL,
    producto_categoria VARCHAR(100) NOT NULL,
    producto_marca VARCHAR(100) NOT NULL,
    producto_modelo VARCHAR(100) NOT NULL,
    producto_precio_de_compra NUMERIC(10,2) NOT NULL,
    producto_precio_de_venta NUMERIC(10,2) NOT NULL,
	producto_barcode VARCHAR(100),

	PRIMARY KEY (producto_id)
);

CREATE TABLE "departamento" (
    departamento_id SERIAL,
    depart_nombre VARCHAR(100) NOT NULL,
    depart_telefono VARCHAR(20),
    depart_direccion TEXT,

	PRIMARY KEY (departamento_id)
);

CREATE TABLE "inventario" (
    inventario_id SERIAL,
    producto_id INTEGER NOT NULL,
    departamento_id INTEGER NOT NULL,
    inventario_cantidad INTEGER,

	PRIMARY KEY (inventario_id),
	FOREIGN KEY (producto_id) REFERENCES "producto"(producto_id),
	FOREIGN KEY (departamento_id) REFERENCES "departamento"(departamento_id)
);

CREATE TABLE "empleado" (
    empleado_id SERIAL,
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
    cliente_id SERIAL,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) UNIQUE NOT NULL,
    cliente_direccion TEXT,
    cliente_telefono VARCHAR(50),
	
	PRIMARY KEY (cliente_id)
);

CREATE TABLE "venta" (
    venta_id SERIAL,
    venta_fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    empleado_id INTEGER NOT NULL,
    departamento_id INTEGER NOT NULL,
    cliente_id INTEGER,
    venta_importe_total NUMERIC(10,2) NOT NULL,
	venta_estatus VARCHAR(50) NOT NULL DEFAULT 'pendiente',

	PRIMARY KEY (venta_id),
	FOREIGN KEY (empleado_id) REFERENCES empleado(empleado_id),
	FOREIGN KEY (departamento_id) REFERENCES departamento(departamento_id),
	FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id)
);

CREATE TABLE "venta_items" (
    venta_items_id SERIAL,
    producto_id INTEGER NOT NULL,
    venta_id INTEGER NOT NULL,
    venta_items_cantidad INTEGER NOT NULL,
    venta_items_precio NUMERIC(10,2) NOT NULL,

	PRIMARY KEY (venta_items_id),
	FOREIGN KEY (producto_id) REFERENCES "producto"(producto_id),
	FOREIGN KEY (venta_id) REFERENCES "venta"(venta_id)
);

-- VISTA
CREATE VIEW inventario_depart_prod AS
SELECT D.depart_nombre AS Departamento, P.producto_nombre AS Producto, I.inventario_cantidad AS Cantidad
FROM inventario I
JOIN departamento D ON I.departamento_id = D.departamento_id
JOIN producto P ON I.producto_id = P.producto_id
;

/*
-- DATA INSERT
INSERT INTO cliente (cliente_nombre, cliente_email, cliente_direccion, cliente_telefono)
VALUES
  ('María López', 'marialopez@example.com', 'Avenida Siempreviva 456', '555-5678'),
  ('Pedro Gómez', 'pedrogomez@example.com', 'Calle de las Flores 789', '555-9876');

-- DELETE FROM cliente WHERE cliente_nombre = 'María López';
-- DELETE FROM cliente WHERE cliente_nombre = 'Pedro Gómez';
-- UPDATE cliente SET cliente_nombre = 'new_value1', cliente_email = 'new_value2'
-- WHERE cliente_id = 1;

SELECT * FROM cliente;
SELECT * FROM producto;
SELECT * FROM empleado;

INSERT INTO departamento (depart_nombre, depart_telefono, depart_direccion)
VALUES ('Ventas', '555-1234', 'Calle Principal 123');

INSERT INTO producto (producto_nombre, producto_categoria, producto_marca, producto_modelo, producto_precio_de_compra, producto_precio_de_venta, producto_barcode)
VALUES
('Smartphone X', 	'Electrónica', 	'Samsung', 		'S23', 			500.00, 	700.00, 	'A4587456'),
('Laptop Gamer', 	'Electrónica', 	'Alienware', 	'm17 R5', 		2000.00, 	3000.00,	'45687KL09'),
('Tablet', 			'Electrónica', 	'Apple', 		'iPad Pro', 	800.00, 	1000.00,	'D6778R346D'),
('Smartwatch', 		'Electrónica', 	'Fitbit', 		'Sense 2', 		250.00, 	350.00,		'8A9835U45')
;

INSERT INTO empleado (empleado_nombre, empleado_email, empleado_telefono, empleado_pass, empleado_cargo, departamento_id, empleado_num_seguro)
VALUES ('Juan Pérez', 'juan@example.com', '555-5678', 'password123', 'Vendedor', 1, '123456789');

-- INSERT INTO venta (empleado_id, departamento_id, cliente_id, venta_importe_total)
-- VALUES (1, 1, 1, 200.00);

-- INSERT INTO venta_items (producto_id, venta_id, venta_items_cantidad, venta_items_precio)
-- VALUES (1, 1, 2, 700.00);

-- VISTAS

-- SELECT * FROM inventario;
--INSERT INTO inventario (producto_id, departamento_id, inventario_id, inventario_cantidad) VALUES
--();

-- STORED PROCEDURES


CREATE OR REPLACE PROCEDURE insertar_venta(
    p_cliente_id UUID,
    p_empleado_id UUID,
    p_producto_id UUID,
    p_departamento_id INTEGER,
    p_cantidad INTEGER,
    p_precio_venta NUMERIC(10,2)
)
LANGUAGE 'plpgsql'
AS $$
BEGIN
    DECLARE
        inventario_cantidad INTEGER;
    BEGIN
        -- Verificar si hay suficiente inventario
        UPDATE inventario
        SET inventario_cantidad = inventario_cantidad - p_cantidad
        WHERE producto_id = p_producto_id AND departamento_id = p_departamento_id
        RETURNING inventario_cantidad INTO inventario_cantidad;

        IF inventario_cantidad < 0 THEN
            RAISE EXCEPTION 'No hay suficiente inventario para este producto.';
        END IF;

        -- Insertar la venta
        INSERT INTO venta (cliente_id, empleado_id, producto_id, departamento_id, venta_cantidad, venta_total)
        VALUES (p_cliente_id, p_empleado_id, p_producto_id, p_departamento_id, p_cantidad, p_cantidad * p_precio_venta);
    END;
END;
$$;


CALL insertar_venta()



-- NUEVA VENTA
-- CALL nueva_venta('p_cliente_uuid', 'p_empleado_uuid', 'p_departamento_id');
CREATE OR REPLACE PROCEDURE nueva_venta (
	p_cliente_id UUID,
    p_empleado_id UUID,
    p_departamento_id INTEGER
)
LANGUAGE 'plpgsql'
AS $$
DECLARE
	v_venta_id INTEGER;
	
BEGIN
	-- Insertar la venta principal (importe_total será calculado después)
    INSERT INTO venta (cliente_id, empleado_id, departamento_id, venta_importe_total)
    VALUES (p_cliente_id, p_empleado_id, p_departamento_id, 100)
    RETURNING venta_id INTO v_venta_id;
END;
$$;

SELECT nueva_venta('5a48a575-fadf-4886-a556-f2f611c38801', 'b2355cea-fcd7-4e2f-a073-726d84ace63f', 1);



SELECT * FROM empleado;

-- DROP PROCEDURE nueva_venta;
CREATE OR REPLACE FUNCTION nueva_venta (
    p_cliente_id INTEGER,
    p_empleado_id INTEGER,
    p_departamento_id INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_venta_id INTEGER;
BEGIN
	RAISE NOTICE 'Cliente ID: %, Empleado ID: %, Departamento ID: %', p_cliente_id, p_empleado_id, p_departamento_id;
    -- Insertar la venta principal (importe_total será calculado después)
    INSERT INTO venta (cliente_id, empleado_id, departamento_id, venta_importe_total)
    VALUES (p_cliente_id, p_empleado_id, p_departamento_id, 100)
    RETURNING venta_id INTO v_venta_id;

    -- Retornar el ID de la venta insertada
    RETURN v_venta_id;
END;
$$;




-- INSERTAR NUEVO ITEM DE LA VENTA
CREATE OR REPLACE PROCEDURE insertar_item_venta (
	p_venta_id,
	p_producto_id,
	p_cantidad
)
LANGUAGE 'plpgsql'
AS $$
DECLARE
	v_precio_venta;
	
BEGIN
	--Cantidad de items * precio de venta dsel producto
	SELECT producto_precio_de_venta FROM producto
	WHERE producto_id = p_producto_id
	RETURNING v_precio_venta := p_cantidad * producto_precio_de_venta;

	-- 
	INSERT INTO venta_items (venta_id, producto_id, venta_items_cantidad, venta_items_precio) VALUES
	(p_venta_id, p_producto_id, p_cantidad, v_precio_venta);

    -- Actualizar el importe_total en la tabla venta
    UPDATE venta
    SET venta_importe_total = v_importe_total
    WHERE venta_id = v_venta_id;

END;
$$;


-- PROCEDURE EJECUTAR VENTA (terminar o cancelar)
-- CALL ejecutar_venta('uuid', 'vendido') OR CALL ejecutar_venta('uuid', 'cancelado')
CREATE OR REPLACE PROCEDURE ejecutar_venta (p_venta_id, p_veredicto)
LANGUAGE 'plpgsql'
AS $$

BEGIN
	INSERT INTO venta (venta_estatus) WHERE venta_id = p_venta_id
	VALUES (p_veredicto);

END;
$$;

*/