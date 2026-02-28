import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

let currentProduct = null;
let quantity = 1;

// Load product details on page load
document.addEventListener('DOMContentLoaded', async () => {
    const productId = sessionStorage.getItem('selectedProductId');
    if (productId) {
        await loadProductDetails(productId);
    } else {
        window.location.href = 'marketplace.html';
    }
});

async function loadProductDetails(productId) {
    console.log("Fetching product details for ID:", productId);

    try {
        const productDoc = await getDoc(doc(db, "products", productId));

        if (!productDoc.exists()) {
            console.error("Product not found in Firestore");
            window.location.href = 'marketplace.html';
            return;
        }

        currentProduct = { id: productDoc.id, ...productDoc.data() };

        // Update page title
        document.title = `${currentProduct.name} - AquaMind`;

        // Update product header
        document.getElementById('productTitle').textContent = currentProduct.name;
        document.getElementById('productPrice').textContent = `${parseFloat(currentProduct.price).toFixed(2)} EGP`;

        // Update rating
        const ratingHTML = `
            <span class="stars">${getStarRating(currentProduct.rating)}</span>
            <span>(${currentProduct.reviews} reviews)</span>
        `;
        document.getElementById('productRating').innerHTML = ratingHTML;

        // Update main image
        document.getElementById('mainImage').src = currentProduct.image || (currentProduct.images ? currentProduct.images[0] : '');
        document.getElementById('mainImage').alt = currentProduct.name;

        // Update thumbnails
        const thumbnailContainer = document.getElementById('thumbnailImages');
        thumbnailContainer.innerHTML = '';
        const images = currentProduct.images || [currentProduct.image];

        images.forEach((img, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${img}" alt="Thumbnail ${index + 1}">`;
            thumbnail.onclick = () => changeMainImage(img, thumbnail);
            thumbnailContainer.appendChild(thumbnail);
        });

        // Update product info
        document.getElementById('productDescription').textContent = currentProduct.fullDescription || currentProduct.description;

        // Update uses (one per line)
        const usesList = document.getElementById('productUses');
        usesList.innerHTML = '';
        if (currentProduct.uses) {
            const usesArray = currentProduct.uses.split('\n').filter(use => use.trim());
            usesArray.forEach(use => {
                const li = document.createElement('li');
                li.textContent = use.trim();
                usesList.appendChild(li);
            });
        }

        // Update price in purchase section
        document.getElementById('priceLarge').textContent = `${parseFloat(currentProduct.price).toFixed(2)} EGP`;
    } catch (error) {
        console.error("Error loading product details:", error);
        alert("Error loading product details. Returning to marketplace.");
        window.location.href = 'marketplace.html';
    }
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '★';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }

    return stars;
}

window.changeMainImage = function (imageSrc, thumbnailElement) {
    document.getElementById('mainImage').src = imageSrc;

    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnailElement.classList.add('active');
}

window.increaseQuantity = function () {
    quantity++;
    document.getElementById('quantity').value = quantity;
    updatePrice();
}

window.decreaseQuantity = function () {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').value = quantity;
        updatePrice();
    }
}

function updatePrice() {
    if (!currentProduct) return;

    const totalPrice = (parseFloat(currentProduct.price) * quantity).toFixed(2);
    document.getElementById('priceLarge').textContent = `${totalPrice} EGP`;
}

window.buyNow = function () {
    if (!currentProduct) return;

    const phoneNumber = '+201152292951';
    const productName = currentProduct.name;
    const price = parseFloat(currentProduct.price);
    const totalPrice = (price * quantity).toFixed(2);

    // Create WhatsApp message
    const message = `Hello! I'm interested in purchasing:\n\nProduct: ${productName}\nQuantity: ${quantity}\nPrice per unit: ${price} EGP\nTotal: ${totalPrice} EGP\n\nPlease let me know how to proceed with the order.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
}
