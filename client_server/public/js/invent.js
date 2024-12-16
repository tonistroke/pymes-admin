// Fetch and display inventory data from the server
const inventoryTableBody = document.getElementById("mytable");

async function fetchInventoryData() {
  try {
    const response = await fetch("http://localhost:8085/inventarios");
    if (!response.ok) {
      throw new Error("Failed to fetch inventory data");
    }
    const inventoryData = await response.json();
    displayInventoryData(inventoryData);
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    inventoryTableBody.innerHTML = "<tr><td colspan='4'>Error loading data</td></tr>";
  }
}

function displayInventoryData(data) {
  // Clear the table
  inventoryTableBody.innerHTML = "";

  // Loop through the data and add rows to the table
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    
    row.innerHTML = `
      <th scope="row">${index + 1}</th>
      <td>${item.departamento}</td>
      <td>${item.producto}</td>
      <td>${item.cantidad}</td>
    `;
    
    inventoryTableBody.appendChild(row);
  });
}

// Load the inventory data when the page loads
document.addEventListener("DOMContentLoaded", fetchInventoryData);
