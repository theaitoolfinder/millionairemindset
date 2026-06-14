// ===== CART ENGINE =====
// Version: 2.0 — with stock validation, product images, order management

var cart = [];
try { cart = JSON.parse(localStorage.getItem('mm_cart') || '[]'); } catch(e){ cart = []; }

/* ── Persist + sync UI ──────────────────────────────────────────────── */
function saveCart() {
  localStorage.setItem('mm_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  var count = cart.reduce(function(sum, item){ return sum + item.qty; }, 0);
  document.querySelectorAll('.cart-count').forEach(function(el){
    el.textContent = count;
    el.style.display = count > 0 ? 'inline' : 'none';
  });
}

/* ── Add to cart (with stock check) ─────────────────────────────────── */
function addToCart(productId) {
  var product = (typeof PRODUCTS !== 'undefined') && PRODUCTS.find(function(p){ return p.id === productId; });
  if (!product) return;
  if (!product.active) { showToast('This product is not available.'); return; }

  // Stock check
  var available = (typeof getStock === 'function') ? getStock(productId) : Infinity;
  var inCart = cart.find(function(i){ return i.id === productId; });
  var inCartQty = inCart ? inCart.qty : 0;
  if (available !== Infinity && inCartQty >= available) {
    showToast('Sorry, only ' + available + ' in stock.'); return;
  }

  if (inCart) {
    inCart.qty++;
  } else {
    cart.push({
      id: product.id,
      sku: product.sku || '',
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image || '',
      delivery: product.delivery || 'email_24h',
      qty: 1
    });
  }
  saveCart();
  showToast(product.name + ' added to cart!');
  // Refresh shop card if on shop page
  if (typeof renderProductCards === 'function') {
    renderProductCards('allProducts');
    renderProductCards('homeFeaturedProducts', 3);
  }
}

/* ── Remove / change qty ─────────────────────────────────────────────── */
function removeFromCart(productId) {
  cart = cart.filter(function(i){ return i.id !== productId; });
  saveCart();
  if (typeof renderCartPage === 'function') renderCartPage();
}

function changeQty(productId, delta) {
  var item = cart.find(function(i){ return i.id === productId; });
  if (!item) return;

  var newQty = item.qty + delta;
  if (newQty <= 0) { removeFromCart(productId); return; }

  // Stock check on increase
  if (delta > 0) {
    var available = (typeof getStock === 'function') ? getStock(productId) : Infinity;
    if (available !== Infinity && newQty > available) {
      showToast('Only ' + available + ' units available.'); return;
    }
  }
  item.qty = newQty;
  saveCart();
  if (typeof renderCartPage === 'function') renderCartPage();
}

function cartTotal() {
  return cart.reduce(function(sum, item){ return sum + item.price * item.qty; }, 0);
}

/* ── Toast notification ──────────────────────────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function(){ toast.classList.remove('show'); }, 3000);
}

/* ── Order reference generator ───────────────────────────────────────── */
function generateOrderRef() {
  var ts = Date.now().toString(36).toUpperCase().slice(-5);
  var rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return 'MM-' + ts + rand;
}

/* ── RENDER: Product cards (shop / homepage) ─────────────────────────── */
function renderProductCards(containerId, limit) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var list = typeof PRODUCTS !== 'undefined'
    ? PRODUCTS.filter(function(p){ return p.active; })
    : [];
  if (limit) list = list.slice(0, limit);

  container.innerHTML = list.map(function(p) {
    var stock = (typeof getStock === 'function') ? getStock(p.id) : Infinity;
    var outOfStock = stock !== Infinity && stock <= 0;
    var lowStock   = stock !== Infinity && stock > 0 && stock <= 5;
    var imgHtml = p.image
      ? '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;">'
      : '<span class="product-icon-placeholder">' + (p.category === 'Course' ? '🎓' : p.category === 'Health' ? '💊' : '📄') + '</span>';

    var stockBadge = outOfStock
      ? '<span class="stock-badge out">Out of Stock</span>'
      : lowStock ? '<span class="stock-badge low">Only ' + stock + ' left</span>' : '';

    var delivNote = (typeof deliveryLabel === 'function') ? deliveryLabel(p.delivery) : '';

    var btn = p.isExternal
      ? '<a href="' + p.buyLink + '" target="_blank" rel="noopener" class="btn-primary btn-sm">Buy Now</a>'
      : outOfStock
        ? '<button class="btn-primary btn-sm" disabled style="opacity:.45;cursor:not-allowed;">Out of Stock</button>'
        : '<button class="btn-primary btn-sm" onclick="addToCart(' + p.id + ')">Add to Cart</button>';

    return '<div class="card product-card" id="prod-card-' + p.id + '">'
      + '<div class="card-img product-img-wrap">'
        + imgHtml
        + (p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '')
        + stockBadge
      + '</div>'
      + '<div class="card-body">'
        + '<div class="blog-meta"><span class="tag">' + p.category + '</span></div>'
        + '<h3>' + p.name + '</h3>'
        + '<p>' + p.description + '</p>'
        + (delivNote ? '<div class="delivery-note">' + delivNote + '</div>' : '')
        + '<div class="product-footer">'
          + '<span class="product-price">&#8369;' + p.price.toLocaleString() + '</span>'
          + btn
        + '</div>'
      + '</div>'
    + '</div>';
  }).join('');
}

/* ── RENDER: Cart page ───────────────────────────────────────────────── */
function renderCartPage() {
  var container = document.getElementById('cartItems');
  var summary   = document.getElementById('cartSummary');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">'
      + '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>'
      + '<p>Your cart is empty.</p>'
      + '<a href="shop.html" class="btn-primary">Browse Shop</a>'
      + '</div>';
    if (summary) summary.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(function(item) {
    var imgHtml = item.image
      ? '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">'
      : '<div class="cart-item-img cart-item-img-placeholder">📄</div>';
    return '<div class="cart-item" id="ci-' + item.id + '">'
      + imgHtml
      + '<div class="cart-item-info">'
        + '<strong>' + item.name + '</strong>'
        + '<span class="cart-item-sku">' + (item.sku || '') + '</span>'
        + '<span class="cart-item-unit">&#8369;' + item.price.toLocaleString() + ' each</span>'
      + '</div>'
      + '<div class="cart-item-qty">'
        + '<button onclick="changeQty(' + item.id + ', -1)">&#8722;</button>'
        + '<span>' + item.qty + '</span>'
        + '<button onclick="changeQty(' + item.id + ', 1)">&#43;</button>'
      + '</div>'
      + '<span class="cart-item-total">&#8369;' + (item.price * item.qty).toLocaleString() + '</span>'
      + '<button class="cart-remove" onclick="removeFromCart(' + item.id + ')" title="Remove">&#x2715;</button>'
    + '</div>';
  }).join('');

  if (summary) {
    summary.style.display = 'block';
    document.querySelectorAll('.cart-grand-total').forEach(function(el){
      el.textContent = '&#8369;' + cartTotal().toLocaleString();
      el.innerHTML   = '&#8369;' + cartTotal().toLocaleString();
    });
  }
}

/* ── CHECKOUT ────────────────────────────────────────────────────────── */
// NOTE: The actual handleCheckout is in cart.html so it can reference
// the payment modal. This stub prevents "not defined" errors if loaded elsewhere.
if (typeof handleCheckout === 'undefined') {
  window.handleCheckout = function(e) { if (e) e.preventDefault(); };
}

/* ── INIT ────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  updateCartUI();
  renderProductCards('homeFeaturedProducts', 3);
  renderProductCards('allProducts');
  renderCartPage();
});
