// ===== CART ENGINE =====
let cart = JSON.parse(localStorage.getItem('mm_cart') || '[]');

function saveCart() {
  localStorage.setItem('mm_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline' : 'none';
  });
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, currency: product.currency, icon: product.icon, qty: 1 });
  }
  saveCart();
  showToast(`${product.icon} ${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCartPage();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); renderCartPage(); }
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== RENDER PRODUCT CARDS =====
function renderProductCards(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const list = limit ? PRODUCTS.slice(0, limit) : PRODUCTS;
  container.innerHTML = list.map(p => `
    <div class="card product-card">
      <div class="card-img product-icon-wrap">
        <span class="product-icon">${p.icon}</span>
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="blog-meta">
          <span class="tag">${p.category}</span>
        </div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-footer">
          <span class="product-price">₱${p.price.toLocaleString()}</span>
          <button class="btn-primary btn-sm" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== RENDER CART PAGE =====
function renderCartPage() {
  const container = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><p>🛒 Your cart is empty.</p><a href="shop.html" class="btn-primary">Browse Shop</a></div>`;
    if (summary) summary.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-icon">${item.icon}</span>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>₱${item.price.toLocaleString()} each</span>
      </div>
      <div class="cart-item-qty">
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <span class="cart-item-total">₱${(item.price * item.qty).toLocaleString()}</span>
      <button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  if (summary) {
    summary.style.display = 'block';
    summary.querySelector('.cart-grand-total').textContent = `₱${cartTotal().toLocaleString()}`;
  }
}

function handleCheckout(e) {
  e.preventDefault();
  const name = document.getElementById('checkoutName').value;
  const email = document.getElementById('checkoutEmail').value;
  const items = cart.map(i => `${i.name} x${i.qty} = ₱${(i.price * i.qty).toLocaleString()}`).join('\n');
  const total = cartTotal();
  const subject = `New Order from ${name}`;
  const body = `New order from ${name} (${email}):\n\n${items}\n\nTotal: ₱${total.toLocaleString()}\n\nPlease confirm payment instructions.`;
  window.location.href = `mailto:hello@millionairemindset.ae?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  cart = [];
  saveCart();
  alert('Thank you for your order! Your email app will open to send the order details. We will confirm your order within 24 hours.');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  renderProductCards('homeFeaturedProducts', 3);
  renderProductCards('allProducts');
  renderCartPage();
});
