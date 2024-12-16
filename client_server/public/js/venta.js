(async () => {
    const API_PRODUCTOS = 'http://localhost:8083/productos';
    const API_VENTAS = 'http://localhost:8086/venta';
  
    const productsSection = document.querySelector('.products');
    const billProductsSection = document.querySelector('.bill-products');
    const billForm = document.querySelector('#bill-form');
  
    const selectedProducts = [];
  
    // Fetch products from API and render them
    async function fetchAndRenderProducts() {
      try {
        const response = await fetch(API_PRODUCTOS);
        const products = await response.json();
  
        products.forEach((product, index) => {
          const productDiv = document.createElement('div');
          productDiv.classList.add('product');
          productDiv.dataset.index = index;
          productDiv.dataset.id = product.producto_id;
          productDiv.dataset.name = product.producto_nombre;
          productDiv.dataset.value = product.producto_precio_de_venta;
  
          productDiv.innerHTML = `
            <img src="/images/hamburguer.svg" alt="${product.producto_nombre}" />
            <p class="product-name">${product.producto_nombre}</p>
            <p class="product-value">$${product.producto_precio_de_venta}</p>
          `;
  
          productDiv.addEventListener('click', () => addProductToBill(product, index));
          productsSection.appendChild(productDiv);
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    // Add product to the bill
    function addProductToBill(product, index) {
      selectedProducts.push({ ...product, index });
  
      const productP = document.createElement('p');
      productP.textContent = `${product.producto_nombre} - $${product.producto_precio_de_venta}`;
      billProductsSection.appendChild(productP);
    }
  
    // Submit the bill
    billForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const clientName = document.querySelector('#name').value;
      const clientID = document.querySelector('#id').value;
  
      try {
        const response = await fetch(API_VENTAS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            empleado_id: 1, // Example employee ID
            cliente_id: clientID,
            productos: selectedProducts.map((product) => ({
              producto_id: product.producto_id,
              cantidad: 1, // Assuming 1 unit per product
            })),
          }),
        });
  
        if (response.ok) {
          alert('Factura generada con éxito');
          location.reload();
        } else {
          alert('Error al generar factura');
        }
      } catch (error) {
        console.error('Error submitting bill:', error);
      }
    });
  
    // Initialize the app
    fetchAndRenderProducts();
  })();


  const userCardTemplate = document.querySelector("[data-user-template]")
  const userCardContainer = document.querySelector("[data-user-cards-container]")
  const searchInput = document.querySelector("[data-search]")
  
  let users = []
  
  // Handle search input
  searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()
    users.forEach(user => {
      // Adjust filter to check for product name or other fields as necessary
      const isVisible =
        user.producto_nombre.toLowerCase().includes(value) ||
        user.producto_categoria.toLowerCase().includes(value) // Add more fields if necessary
      user.element.classList.toggle("hide", !isVisible)
    })
  })
  
  // Fetch data from API
  fetch("http://localhost:8083/productos")
    .then(res => res.json())
    .then(data => {
      users = data.map(user => {
        // Clone the template for each product
        const card = userCardTemplate.content.cloneNode(true).children[0]
        const header = card.querySelector("[data-header]")
        const body = card.querySelector("[data-body]")
  
        // Fill the template with product information
        header.textContent = user.producto_nombre  // Assuming 'producto_nombre' is the product name
        body.textContent = `Categoria: ${user.producto_categoria} | Precio: ${user.producto_precio_de_venta}`
  
        // Append the card to the container
        userCardContainer.append(card)
  
        // Return an object to handle filtering
        return { 
          producto_nombre: user.producto_nombre,
          producto_categoria: user.producto_categoria,
          element: card
        }
      })
    })
  