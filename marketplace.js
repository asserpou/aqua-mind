// Import Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzILt4x3T9zwlLdXAMUn1jzjEPSIWybg0",
    authDomain: "nilevo-production.firebaseapp.com",
    projectId: "nilevo-production",
    storageBucket: "nilevo-production.firebasestorage.app",
    messagingSenderId: "185264790897",
    appId: "1:185264790897:web:851bf66f2cf11d9609ead0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase initialized for Marketplace");

// Fetch products from Firestore
async function getProducts() {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products;
}

// Load products on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
});

async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const products = await getProducts();

    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #666;">No products available at the moment.</p>';
        return;
    }

    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="product-image-area">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h2 class="product-name">${product.name}</h2>
            <p class="product-description">${product.description}</p>
            <p class="product-price">${parseFloat(product.price).toFixed(2)} EGP</p>
            <button class="view-details-btn" onclick="viewProductDetails('${product.id}')">
                View Details
            </button>
        </div>
    `;

    return card;
}

window.viewProductDetails = function (productId) {
    // Store product ID in sessionStorage and navigate to details page
    sessionStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-details.html';
};