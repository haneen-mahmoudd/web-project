'use strict';

const API_URL = 'http://localhost:3000/api';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.querySelector('[aria-label="cart item"] .btn-badge');
  const total = document.querySelector('[aria-label="cart item"] .btn-text');
  if (badge) badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (total) {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    total.textContent = `$${totalPrice.toFixed(2)}`;
  }
}

function addToCart(productId, name, price, image) {
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, name, price, image, quantity: 1 });
  }
  saveCart();
  showToast(`${name} added to cart!`);
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #333;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 9999;
      transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

async function loadProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();

    container.innerHTML = products.map(product => `
      <li class="flex-item">
        <div class="product-card">
          <figure class="card-banner img-holder has-before hover:shine" style="--width: 312; --height: 350;">
            <img src="${product.image_url}" width="312" height="350" loading="lazy" alt="${product.name}" class="img-cover">
          </figure>
          <div class="card-content">
            <h3 class="h3 card-title">
              <a href="#">${product.name}</a>
            </h3>
            <data class="price" value="${product.price}">$${product.price}.00</data>
            <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image_url}')">
              Add to Cart
            </button>
          </div>
        </div>
      </li>
    `).join('');

  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

updateCartBadge();
loadProducts();