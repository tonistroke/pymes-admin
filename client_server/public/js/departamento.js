function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8081/departamentos");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const departamentos = JSON.parse(this.responseText);
            let trHTML = '';
            for (let depto of departamentos) {
                trHTML += '<tr>';
                trHTML += `<td>${depto.departamento_id}</td>`;
                trHTML += `<td>${depto.depart_nombre}</td>`;
                trHTML += `<td>${depto.depart_telefono}</td>`;
                trHTML += `<td>${depto.depart_direccion}</td>`;
                trHTML += `
                  <td>
                    <button class="btn btn-outline-secondary" onclick="showDepartamentoEditBox(${depto.departamento_id})">Editar</button>
                    <button class="btn btn-outline-danger" onclick="deleteDepartamento(${depto.departamento_id})">Eliminar</button>
                  </td>`;
                trHTML += '</tr>';
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

function showDepartamentoCreateBox() {
    Swal.fire({
        title: 'Crear Departamento',
        html: `
          <input id="depart_nombre" class="swal2-input" placeholder="Nombre">
          <input id="depart_telefono" class="swal2-input" placeholder="Teléfono">
          <input id="depart_direccion" class="swal2-input" placeholder="Dirección">
        `,
        focusConfirm: false,
        preConfirm: () => createDepartamento(),
    });
}

function createDepartamento() {
    const nombre = document.getElementById("depart_nombre").value;
    const telefono = document.getElementById("depart_telefono").value;
    const direccion = document.getElementById("depart_direccion").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8081/departamento");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ depart_nombre: nombre, depart_telefono: telefono, depart_direccion: direccion }));
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
            Swal.fire('Departamento creado!');
            loadTable();
        }
    };
}

function showDepartamentoEditBox(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:8081/departamento/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const depto = JSON.parse(this.responseText);
            Swal.fire({
                title: 'Editar Departamento',
                html: `
                  <input id="depart_nombre" class="swal2-input" placeholder="Nombre" value="${depto.depart_nombre}">
                  <input id="depart_telefono" class="swal2-input" placeholder="Teléfono" value="${depto.depart_telefono}">
                  <input id="depart_direccion" class="swal2-input" placeholder="Dirección" value="${depto.depart_direccion}">
                `,
                focusConfirm: false,
                preConfirm: () => editDepartamento(id),
            });
        }
    };
}

function editDepartamento(id) {
    const nombre = document.getElementById("depart_nombre").value;
    const telefono = document.getElementById("depart_telefono").value;
    const direccion = document.getElementById("depart_direccion").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://localhost:8081/departamento/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ depart_nombre: nombre, depart_telefono: telefono, depart_direccion: direccion }));
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Swal.fire('Departamento actualizado!');
            loadTable();
        }
    };
}

function deleteDepartamento(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://localhost:8081/departamento/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Swal.fire('Departamento eliminado!');
            loadTable();
        }
    };
}

// Load initial data
loadTable();
