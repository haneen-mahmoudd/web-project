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

function addToCart(btn) {
const card = btn.closest('.shop-card');
  const name = card.querySelector('.card-title').textContent;
  const price = parseFloat(card.querySelector('.price').textContent.replace(/[^\d.]/g, ''));
  const image = card.querySelector('img').src;
  
  const productData = { name, price, image, quantity: 1 };

  // --- الربط مع PHP (Apache) ---
  fetch('handle_cart.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });

  // كود الـ localStorage بتاعك يفضل زي ما هو عشان الشكل يظبط
  const productId = name + price;
  const existing = cart.find(item => item.productId === productId);
  if (existing) { existing.quantity += 1; } 
  else { cart.push({ productId, name, price, image, quantity: 1 }); }
  
  saveCart();
  showToast(`${name} added to cart!`);
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;z-index:9999;transition:opacity 0.3s;`;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

const products = [
  { id: 1,  name: 'Facial Cleanser',               price: 29.00, image: './assets/images/product-01.jpg' },
  { id: 2,  name: 'Bio-shroom Rejuvenating Serum',  price: 29.00, image: './assets/images/product-02.jpg' },
  { id: 3,  name: 'Coffee Bean Caffeine Eye Cream', price: 29.00, image: './assets/images/product-03.jpg' },
  { id: 4,  name: 'Facial Cleanser',               price: 29.00, image: './assets/images/product-04.jpg' },
  { id: 5,  name: 'Coffee Bean Caffeine Eye Cream', price: 29.00, image: './assets/images/product-05.jpg' },
  { id: 6,  name: 'Facial Cleanser',               price: 29.00, image: './assets/images/product-06.jpg' },
  { id: 7,  name: 'Facial Cleanser',               price: 29.00, image: './assets/images/product-07.jpg' },
  { id: 8,  name: 'Bio-shroom Rejuvenating Serum',  price: 29.00, image: './assets/images/product-08.jpg' },
  { id: 9,  name: 'Coffee Bean Caffeine Eye Cream', price: 29.00, image: './assets/images/product-09.jpg' },
  { id: 10, name: 'Facial Cleanser',               price: 29.00, image: './assets/images/product-10.jpg' },
  { id: 11, name: 'Coffee Bean Caffeine Eye Cream', price: 29.00, image: './assets/images/product-11.jpg' },
  { id: 12, name: 'Facial Cleanser',               price: 29.00, image: './assets/images/product-01.jpg' },
];

window.addEventListener('load', function() {
  updateCartBadge();
  const buttons = document.querySelectorAll('[aria-label="add to cart"]');
  buttons.forEach(function(btn, index) {
    const product = products[index];
    if (product) {
      btn.addEventListener('click', function() {
        addToCart(product.id, product.name, product.price, product.image);
      });
    }
  });
});