// URL del archivo JSON en GitHub (configurada para tu repositorio)
const JSON_URL = 'https://raw.githubusercontent.com/marcelmontano/prueba/main/data.json';

// Elementos del DOM
const productsContainer = document.getElementById('products-container');
const updateBtn = document.getElementById('update-btn');
const loadingElement = document.getElementById('loading');
const lastUpdateTime = document.getElementById('last-update-time');
const notification = document.getElementById('notification');

// Función para formatear precios
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Función para determinar el estado del stock
function getStockStatus(stock) {
    if (stock > 10) return { status: 'in-stock', text: 'En stock' };
    if (stock > 0) return { status: 'low-stock', text: 'Últimas unidades' };
    return { status: 'out-of-stock', text: 'Agotado' };
}

// Función para renderizar productos
function renderProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <h3>No hay productos disponibles en este momento</h3>
                <p>Intenta actualizar nuevamente más tarde</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const stockInfo = getStockStatus(product.stock);
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.nombre}</h3>
                <p class="product-description">${product.descripcion}</p>
                <div class="product-price">${formatPrice(product.precio)}</div>
                <span class="product-stock ${stockInfo.status}">${stockInfo.text} (${product.stock})</span>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// Función para obtener datos actualizados desde GitHub
async function fetchData() {
    try {
        // Agregar timestamp para evitar caché
        const response = await fetch(`${JSON_URL}?t=${new Date().getTime()}`);
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        showErrorNotification();
        return null;
    }
}

// Función para actualizar todo el catálogo
async function updateCatalog() {
    loadingElement.classList.add('show');
    updateBtn.disabled = true;
    
    const data = await fetchData();
    
    if (data) {
        renderProducts(data.productos);
        lastUpdateTime.textContent = data.ultima_actualizacion;
        showNotification();
    }
    
    loadingElement.classList.remove('show');
    updateBtn.disabled = false;
}

// Función para mostrar notificación
function showNotification() {
    notification.textContent = '¡Catálogo actualizado correctamente!';
    notification.style.backgroundColor = '#4caf50';
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Función para mostrar error
function showErrorNotification() {
    notification.textContent = 'Error al actualizar. Intenta nuevamente.';
    notification.style.backgroundColor = '#f44336';
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Evento para el botón de actualización
updateBtn.addEventListener('click', updateCatalog);

// Cargar datos iniciales al abrir la página
document.addEventListener('DOMContentLoaded', updateCatalog);