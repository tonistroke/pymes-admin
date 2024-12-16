function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8083/productos");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const productos = JSON.parse(this.responseText);
            let trHTML = '';
            for (let producto of productos) {
                trHTML += '<tr>';
                trHTML += `<td>${producto.producto_id}</td>`;
                trHTML += `<td>${producto.producto_nombre}</td>`;
                trHTML += `<td>${producto.producto_categoria}</td>`;
                trHTML += `<td>${producto.producto_marca}</td>`;
                trHTML += `<td>${producto.producto_modelo}</td>`;
                trHTML += `<td>${producto.producto_precio_de_compra}</td>`;
                trHTML += `<td>${producto.producto_precio_de_venta}</td>`;
                trHTML += `<td>${producto.producto_barcode}</td>`;
                trHTML += `
                  <td>
                    <button class="btn btn-outline-secondary" onclick="showProductoEditBox(${producto.producto_id})">Editar</button>
                    <button class="btn btn-outline-danger" onclick="deleteProducto(${producto.producto_id})">Eliminar</button>
                  </td>`;
                trHTML += '</tr>';
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

function showProductoCreateBox() {
    Swal.fire({
        title: 'Crear Producto',
        html: `
          <input id="producto_nombre" class="swal2-input" placeholder="Nombre">
          <input id="producto_categoria" class="swal2-input" placeholder="Categoría">
          <input id="producto_marca" class="swal2-input" placeholder="Marca">
          <input id="producto_modelo" class="swal2-input" placeholder="Modelo">
          <input id="producto_precio_de_compra" class="swal2-input" placeholder="Precio de Compra">
          <input id="producto_precio_de_venta" class="swal2-input" placeholder="Precio de Venta">
          <input id="producto_barcode" class="swal2-input" placeholder="Código de Barras">
        `,
        focusConfirm: false,
        preConfirm: () => createProducto(),
    });
}

function createProducto() {
    const nombre = document.getElementById("producto_nombre").value;
    const categoria = document.getElementById("producto_categoria").value;
    const marca = document.getElementById("producto_marca").value;
    const modelo = document.getElementById("producto_modelo").value;
    const precioCompra = document.getElementById("producto_precio_de_compra").value;
    const precioVenta = document.getElementById("producto_precio_de_venta").value;
    const barcode = document.getElementById("producto_barcode").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8083/producto");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
        producto_nombre: nombre, 
        producto_categoria: categoria, 
        producto_marca: marca, 
        producto_modelo: modelo, 
        producto_precio_de_compra: precioCompra, 
        producto_precio_de_venta: precioVenta, 
        producto_barcode: barcode 
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
            Swal.fire('Producto creado!');
            loadTable();
        }
    };
}

function showProductoEditBox(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:8083/producto/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const producto = JSON.parse(this.responseText);
            Swal.fire({
                title: 'Editar Producto',
                html: `
                  <input id="producto_nombre" class="swal2-input" placeholder="Nombre" value="${producto.producto_nombre}">
                  <input id="producto_categoria" class="swal2-input" placeholder="Categoría" value="${producto.producto_categoria}">
                  <input id="producto_marca" class="swal2-input" placeholder="Marca" value="${producto.producto_marca}">
                  <input id="producto_modelo" class="swal2-input" placeholder="Modelo" value="${producto.producto_modelo}">
                  <input id="producto_precio_de_compra" class="swal2-input" placeholder="Precio de Compra" value="${producto.producto_precio_de_compra}">
                  <input id="producto_precio_de_venta" class="swal2-input" placeholder="Precio de Venta" value="${producto.producto_precio_de_venta}">
                  <input id="producto_barcode" class="swal2-input" placeholder="Código de Barras" value="${producto.producto_barcode}">
                `,
                focusConfirm: false,
                preConfirm: () => editProducto(id),
            });
        }
    };
}

function editProducto(id) {
    const nombre = document.getElementById("producto_nombre").value;
    const categoria = document.getElementById("producto_categoria").value;
    const marca = document.getElementById("producto_marca").value;
    const modelo = document.getElementById("producto_modelo").value;
    const precioCompra = document.getElementById("producto_precio_de_compra").value;
    const precioVenta = document.getElementById("producto_precio_de_venta").value;
    const barcode = document.getElementById("producto_barcode").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://localhost:8083/producto/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
        producto_nombre: nombre, 
        producto_categoria: categoria, 
        producto_marca: marca, 
        producto_modelo: modelo, 
        producto_precio_de_compra: precioCompra, 
        producto_precio_de_venta: precioVenta, 
        producto_barcode: barcode 
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Swal.fire('Producto actualizado!');
            loadTable();
        }
    };
}

function deleteProducto(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://localhost:8083/producto/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Swal.fire('Producto eliminado!');
            loadTable();
        }
    };
}

// Load initial data
loadTable();
