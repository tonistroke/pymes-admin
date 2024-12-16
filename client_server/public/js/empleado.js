function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:8082/empleados");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const empleados = JSON.parse(this.responseText);
            let trHTML = '';
            for (let emp of empleados) {
                trHTML += '<tr>';
                trHTML += `<td>${emp.empleado_id}</td>`;
                trHTML += `<td>${emp.empleado_nombre}</td>`;
                trHTML += `<td>${emp.empleado_email}</td>`;
                trHTML += `<td>${emp.empleado_telefono}</td>`;
                trHTML += `<td>${emp.empleado_cargo}</td>`;
                trHTML += `<td>${emp.departamento_id}</td>`;
                trHTML += `<td>${emp.empleado_num_seguro}</td>`;
                trHTML += `
                  <td>
                    <button class="btn btn-outline-secondary" onclick="showEmpleadoEditBox(${emp.empleado_id})">Editar</button>
                    <button class="btn btn-outline-danger" onclick="deleteEmpleado(${emp.empleado_id})">Eliminar</button>
                  </td>`;
                trHTML += '</tr>';
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

function showEmpleadoCreateBox() {
    Swal.fire({
        title: 'Crear Empleado',
        html: `
          <input id="empleado_nombre" class="swal2-input" placeholder="Nombre">
          <input id="empleado_email" class="swal2-input" placeholder="Email">
          <input id="empleado_telefono" class="swal2-input" placeholder="Teléfono">
          <input id="empleado_pass" class="swal2-input" placeholder="Contraseña">
          <!-- <input id="empleado_cargo" class="swal2-input" placeholder="Cargo"> -->
            <!-- <label for="empleado_cargo">Role:</label> -->
                <select id="empleado_cargo" name="empleado_cargo" class="swal2-input" required>
                <option value="manager">Manager</option>
                <option value="seller">Seller</option>
                </select><br>  
          
          <input id="departamento_id" class="swal2-input" placeholder="Departamento ID">
            <!--<label for="departamento_id">Department:</label>-->
            <!--<select id="departamento_id" name="departamento_id" class="swal2-input" required>-->
            <!--<option value="">Lugar trabajo</option>-->
            <!--</select><br>-->

          <input id="empleado_num_seguro" class="swal2-input" placeholder="# Seguro">
        `,
        focusConfirm: false,
        preConfirm: () => createEmpleado(),
    });
}

function createEmpleado() {
    const nombre = document.getElementById("empleado_nombre").value;
    const email = document.getElementById("empleado_email").value;
    const telefono = document.getElementById("empleado_telefono").value;
    const pass = document.getElementById("empleado_pass").value;
    const cargo = document.getElementById("empleado_cargo").value;
    const departamentoId = document.getElementById("departamento_id").value;
    const numSeguro = document.getElementById("empleado_num_seguro").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8082/empleado");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        empleado_nombre: nombre,
        empleado_email: email,
        empleado_telefono: telefono,
        empleado_pass: pass,
        empleado_cargo: cargo,
        departamento_id: departamentoId,
        empleado_num_seguro: numSeguro,
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 201) {
            Swal.fire('Empleado creado!');
            loadTable();
        }
    };
}

function showEmpleadoEditBox(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:8082/empleado/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const emp = JSON.parse(this.responseText);
            Swal.fire({
                title: 'Editar Empleado',
                html: `
                  <input id="empleado_nombre" class="swal2-input" placeholder="Nombre" value="${emp.empleado_nombre}">
                  <input id="empleado_email" class="swal2-input" placeholder="Email" value="${emp.empleado_email}">
                  <input id="empleado_telefono" class="swal2-input" placeholder="Teléfono" value="${emp.empleado_telefono}">
                  <input id="empleado_cargo" class="swal2-input" placeholder="Cargo" value="${emp.empleado_cargo}">
                  <input id="departamento_id" class="swal2-input" placeholder="Departamento ID" value="${emp.departamento_id}">
                  <input id="empleado_num_seguro" class="swal2-input" placeholder="# Seguro" value="${emp.empleado_num_seguro}">
                `,
                focusConfirm: false,
                preConfirm: () => editEmpleado(id),
            });
        }
    };
}

function editEmpleado(id) {
    const nombre = document.getElementById("empleado_nombre").value;
    const email = document.getElementById("empleado_email").value;
    const telefono = document.getElementById("empleado_telefono").value;
    const cargo = document.getElementById("empleado_cargo").value;
    const departamentoId = document.getElementById("departamento_id").value;
    const numSeguro = document.getElementById("empleado_num_seguro").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://localhost:8082/empleado/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        empleado_nombre: nombre,
        empleado_email: email,
        empleado_telefono: telefono,
        empleado_cargo: cargo,
        departamento_id: departamentoId,
        empleado_num_seguro: numSeguro,
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Swal.fire('Empleado actualizado!');
            loadTable();
        }
    };
}

function deleteEmpleado(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://localhost:8082/empleado/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            Swal.fire('Empleado eliminado!');
            loadTable();
        }
    };
}

// Load initial data
loadTable();



// Populate department dropdown
async function loadDepartments() {
    try {
      const response = await fetch('http://localhost:8081/departamentos'); // Update to match your endpoint
      if (response.ok) {
        const departamentos = await response.json();

        console.log(departamentos);

        const departamentoSelect = 1;

        console.log(departamentoSelect);

        departamentos.forEach(departamento => {
          const option = document.createElement('option');
          option.value = departamento.departamento_id;
          option.textContent = departamento.departamento_name;
          departamentoSelect.appendChild(option);
        });
      } else {
        console.error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }
  
  // Call this function when the page loads
  document.addEventListener('DOMContentLoaded', () => {
  loadDepartments();
});