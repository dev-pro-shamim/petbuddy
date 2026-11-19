/**
 * Pet Buddy - Checkout Engine
 * Manages customer form validation, payment switching, order generation,
 * and saving orders to LocalStorage.
 */

const ORDERS_STORAGE_KEY = 'pet_buddy_orders';

function getAllOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveOrder(order) {
  const orders = getAllOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

let selectedShippingSpeed = 'standard';
let selectedPaymentMethod = 'card';

function setShippingMethod(method, cost) {
  selectedShippingSpeed = method;
  renderCheckoutSummary();
}

function setPaymentMethod(method) {
  selectedPaymentMethod = method;
  const cardSection = document.getElementById('card-payment-form');
  const paypalSection = document.getElementById('paypal-payment-form');

  const cardTab = document.getElementById('tab-card');
  const paypalTab = document.getElementById('tab-paypal');

  if (method === 'card') {
    cardSection.classList.remove('hidden');
    paypalSection.classList.add('hidden');
    cardTab.className = 'flex-1 py-3 px-4 text-xs font-bold rounded-xl border-2 border-forest-800 bg-forest-50/50 text-forest-900 transition-all';
    paypalTab.className = 'flex-1 py-3 px-4 text-xs font-bold rounded-xl border border-cream-300 bg-white text-gray-700 hover:border-gray-400 transition-all';
  } else {
    cardSection.classList.add('hidden');
    paypalSection.classList.remove('hidden');
    paypalTab.className = 'flex-1 py-3 px-4 text-xs font-bold rounded-xl border-2 border-forest-800 bg-forest-50/50 text-forest-900 transition-all';
    cardTab.className = 'flex-1 py-3 px-4 text-xs font-bold rounded-xl border border-cream-300 bg-white text-gray-700 hover:border-gray-400 transition-all';
  }
}

function renderCheckoutSummary() {
  const cart = getCart();
  const summaryContainer = document.getElementById('checkout-items-list');
  const emptyCartWarning = document.getElementById('checkout-empty-warning');
  const mainCheckoutForm = document.getElementById('main-checkout-form');

  if (!cart || cart.length === 0) {
    if (emptyCartWarning) emptyCartWarning.classList.remove('hidden');
    if (mainCheckoutForm) mainCheckoutForm.classList.add('hidden');
    return;
  }

  if (emptyCartWarning) emptyCartWarning.classList.add('hidden');
  if (mainCheckoutForm) mainCheckoutForm.classList.remove('hidden');

  const totals = getCartTotals();
  let shippingCost = totals.shippingCost;

  if (selectedShippingSpeed === 'express') {
    shippingCost = 14.99;
  }

  const finalTotal = Math.max(0, totals.subtotal - totals.discountAmount + shippingCost);

  // Render items in order summary
  if (summaryContainer) {
    summaryContainer.innerHTML = cart.map(item => `
      <div class="flex items-center gap-3 py-3 border-b border-cream-200 last:border-0">
        <div class="relative w-14 h-14 rounded-xl bg-cream-100 flex-shrink-0 border border-cream-200 overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
          <span class="absolute top-0 right-0 bg-forest-900 text-white text-[10px] font-bold w-5 h-5 rounded-bl-lg flex items-center justify-center">${item.quantity}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs text-gray-900 truncate">${item.name}</h4>
          <div class="text-[11px] text-gray-500">${item.variantName}</div>
          ${item.subscription ? `<div class="text-[10px] text-emerald-800 font-semibold">Autoship: ${item.subscription.frequency}</div>` : ''}
        </div>
        <div class="text-xs font-bold text-gray-900">
          $${(item.unitPrice * item.quantity).toFixed(2)}
        </div>
      </div>
    `).join('');
  }

  // Update summary numbers
  document.getElementById('checkout-subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
  document.getElementById('checkout-shipping').textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
  document.getElementById('checkout-total').textContent = `$${finalTotal.toFixed(2)}`;

  const discRow = document.getElementById('checkout-discount-row');
  const discAmt = document.getElementById('checkout-discount');
  if (totals.appliedCoupon) {
    discRow.classList.remove('hidden');
    discAmt.textContent = `-$${totals.discountAmount.toFixed(2)}`;
  } else {
    discRow.classList.add('hidden');
  }
}

function handleCheckoutCoupon() {
  const input = document.getElementById('checkout-coupon-code');
  if (!input || !input.value) return;
  const res = applyCoupon(input.value);
  if (res.success) {
    window.showToast(res.message, 'success');
    input.value = '';
    renderCheckoutSummary();
  } else {
    window.showToast(res.message, 'error');
  }
}

function handlePlaceOrder(e) {
  e.preventDefault();
  const cart = getCart();
  if (cart.length === 0) {
    window.showToast('Your cart is empty!', 'error');
    return;
  }

  // Form Fields
  const email = document.getElementById('checkout-email').value;
  const firstName = document.getElementById('checkout-fname').value;
  const lastName = document.getElementById('checkout-lname').value;
  const phone = document.getElementById('checkout-phone').value;
  const address = document.getElementById('checkout-address').value;
  const apt = document.getElementById('checkout-apt').value;
  const city = document.getElementById('checkout-city').value;
  const state = document.getElementById('checkout-state').value;
  const zip = document.getElementById('checkout-zip').value;

  const totals = getCartTotals();
  const shippingCost = selectedShippingSpeed === 'express' ? 14.99 : totals.shippingCost;
  const finalTotal = +(totals.subtotal - totals.discountAmount + shippingCost).toFixed(2);

  // Generate unique order ID
  const orderId = 'PB-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();

  const newOrder = {
    orderId: orderId,
    date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    timestamp: now.toISOString(),
    status: 'Confirmed & Processing',
    customer: {
      firstName,
      lastName,
      email,
      phone
    },
    shippingAddress: {
      address,
      apt,
      city,
      state,
      zip,
      country: 'Canada'
    },
    shippingMethod: selectedShippingSpeed === 'express' ? 'Express Priority (1-2 Days)' : 'Standard Delivery (3-5 Days)',
    paymentMethod: selectedPaymentMethod === 'card' ? 'Credit Card (ending 4242)' : 'PayPal Express',
    items: cart,
    pricing: {
      subtotal: totals.subtotal,
      discount: totals.discountAmount,
      shipping: shippingCost,
      total: finalTotal
    }
  };

  // Save Order
  saveOrder(newOrder);

  // Clear Cart
  clearCart();

  // Show Confirmation Overlay Modal
  showOrderSuccessModal(newOrder);
}

function showOrderSuccessModal(order) {
  const modal = document.getElementById('order-success-modal');
  if (!modal) return;

  const idEl = document.getElementById('modal-order-id');
  if (idEl) idEl.textContent = order.orderId;

  const emailEl = document.getElementById('modal-customer-email');
  if (emailEl) emailEl.textContent = order.customer.email;

  const totalEl = document.getElementById('modal-order-total');
  if (totalEl) totalEl.textContent = `$${order.pricing.total.toFixed(2)}`;

  const trackLink = document.getElementById('modal-track-link');
  if (trackLink) trackLink.href = `order-tracking.html?order=${order.orderId}`;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
