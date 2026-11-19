/**
 * Pet Buddy - Shopping Cart Engine
 * Manages cart storage, subscriptions, coupon codes, and slideover drawer
 */

const CART_STORAGE_KEY = 'pet_buddy_cart';
const COUPON_STORAGE_KEY = 'pet_buddy_coupon';

const ACTIVE_COUPONS = {
  'BUDDY15': { discountPercent: 15, description: '15% Off Your Entire Pet Buddy Order' },
  'PETBUDDY20': { discountPercent: 20, description: '20% Off Welcome Discount' },
  'BULLY15': { discountPercent: 15, description: '15% Off Bully Sticks & Chews' },
  'FREESHIP': { freeShipping: true, description: 'Free Express Canadian/USA Shipping' },
  'BULK10': { discountPercent: 10, description: '10% Off Bulk Order' }
};

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse cart:', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

function getAppliedCoupon() {
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function applyCoupon(code) {
  const normalized = code.trim().toUpperCase();
  if (ACTIVE_COUPONS[normalized]) {
    const couponData = { code: normalized, ...ACTIVE_COUPONS[normalized] };
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(couponData));
    updateCartUI();
    return { success: true, message: `Coupon "${normalized}" applied successfully!` };
  }
  return { success: false, message: 'Invalid coupon. Try "BUDDY15" or "FREESHIP"' };
}

function removeCoupon() {
  localStorage.removeItem(COUPON_STORAGE_KEY);
  updateCartUI();
}

function addToCart(product, variant, quantity = 1, subscription = null) {
  if (!product) return;
  const cart = getCart();

  const variantName = variant ? variant.name : (product.variants ? product.variants[0].name : "Standard");
  const basePrice = (variant && variant.salePrice) ? variant.salePrice : (product.salePrice || product.price);
  
  // Calculate final unit price considering subscription (15% extra off if subscribe & save)
  const isSub = subscription && subscription.isSubscription;
  const unitPrice = isSub ? +(basePrice * 0.85).toFixed(2) : basePrice;

  const subFrequency = isSub ? subscription.frequency : 'one-time';
  const existingIndex = cart.findIndex(item => 
    item.id === product.id && 
    item.variantName === variantName && 
    (item.subscription ? item.subscription.frequency : 'one-time') === subFrequency
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += Number(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      categoryName: product.categoryName,
      image: product.images[0],
      variantName: variantName,
      weight: variant ? variant.weight : 'Standard',
      regularPrice: product.price,
      unitPrice: unitPrice,
      isSale: !!product.salePrice,
      quantity: Number(quantity),
      subscription: isSub ? {
        frequency: subscription.frequency || 'Every 4 Weeks (Monthly)',
        discountPercent: 15
      } : null
    });
  }

  saveCart(cart);

  if (window.showToast) {
    window.showToast(`Added ${quantity}x "${product.name}" to cart!`, 'success');
  }

  if (typeof openCartDrawer === 'function') {
    openCartDrawer();
  }
}

function updateCartQty(productId, variantName, newQty, subFrequency = 'one-time') {
  let cart = getCart();
  const index = cart.findIndex(item => 
    item.id === productId && 
    item.variantName === variantName && 
    (item.subscription ? item.subscription.frequency : 'one-time') === subFrequency
  );

  if (index > -1) {
    if (newQty <= 0) {
      cart.splice(index, 1);
      if (window.showToast) window.showToast('Item removed from cart', 'info');
    } else {
      cart[index].quantity = newQty;
    }
    saveCart(cart);
  }
}

function removeFromCart(productId, variantName, subFrequency = 'one-time') {
  let cart = getCart();
  cart = cart.filter(item => 
    !(item.id === productId && 
      item.variantName === variantName && 
      (item.subscription ? item.subscription.frequency : 'one-time') === subFrequency)
  );
  saveCart(cart);
  if (window.showToast) window.showToast('Item removed from cart', 'info');
}

function clearCart() {
  saveCart([]);
}

function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Pet Buddy Free Shipping over $75.00 or if any item has subscription
  const coupon = getAppliedCoupon();
  let discountAmount = 0;

  if (coupon && coupon.discountPercent) {
    discountAmount = (subtotal * (coupon.discountPercent / 100));
  }

  const hasSubscription = cart.some(item => !!item.subscription);
  const freeThreshold = 60.00;
  const qualifiesFreeShipping = subtotal >= freeThreshold || hasSubscription || (coupon && coupon.freeShipping) || subtotal === 0;

  let shippingCost = qualifiesFreeShipping ? 0.00 : 5.99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  return {
    subtotal: +subtotal.toFixed(2),
    totalItems,
    discountAmount: +discountAmount.toFixed(2),
    shippingCost: +shippingCost.toFixed(2),
    finalTotal: +finalTotal.toFixed(2),
    freeShippingThreshold: freeThreshold,
    amountUntilFreeShipping: Math.max(0, +(freeThreshold - subtotal).toFixed(2)),
    hasSubscription,
    appliedCoupon: coupon
  };
}

function updateCartUI() {
  const totals = getCartTotals();
  const countBadges = document.querySelectorAll('.cart-count-badge');
  countBadges.forEach(badge => {
    badge.textContent = totals.totalItems;
    badge.classList.toggle('hidden', totals.totalItems === 0);
  });

  renderCartDrawer();

  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }

  if (typeof renderCheckoutSummary === 'function') {
    renderCheckoutSummary();
  }
}

function renderCartDrawer() {
  const drawerItems = document.getElementById('cart-drawer-items');
  const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
  const drawerShippingBar = document.getElementById('cart-drawer-shipping-bar');
  const drawerShippingText = document.getElementById('cart-drawer-shipping-text');
  const emptyDrawerMessage = document.getElementById('cart-drawer-empty');

  if (!drawerItems) return;

  const cart = getCart();
  const totals = getCartTotals();

  if (cart.length === 0) {
    drawerItems.innerHTML = '';
    if (emptyDrawerMessage) emptyDrawerMessage.classList.remove('hidden');
    if (drawerSubtotal) drawerSubtotal.textContent = '$0.00';
    if (drawerShippingBar) drawerShippingBar.style.width = '0%';
    if (drawerShippingText) drawerShippingText.textContent = 'Add $60.00 more for FREE Express Shipping!';
    return;
  }

  if (emptyDrawerMessage) emptyDrawerMessage.classList.add('hidden');

  // Update Free Shipping Progress Bar
  if (drawerShippingBar && drawerShippingText) {
    const percent = totals.hasSubscription ? 100 : Math.min(100, Math.round((totals.subtotal / 60.00) * 100));
    drawerShippingBar.style.width = `${percent}%`;
    if (totals.hasSubscription) {
      drawerShippingText.innerHTML = '<span class="text-emerald-700 font-bold">🎉 FREE Express Shipping Unlocked via Autoship!</span>';
    } else if (totals.amountUntilFreeShipping === 0) {
      drawerShippingText.innerHTML = '<span class="text-emerald-700 font-bold">🎉 You qualify for FREE Shipping (Orders $60+)!</span>';
    } else {
      drawerShippingText.innerHTML = `Add <span class="font-bold text-[#C8102E]">$${totals.amountUntilFreeShipping.toFixed(2)}</span> more to unlock <strong>FREE Shipping!</strong>`;
    }
  }

  if (drawerSubtotal) {
    drawerSubtotal.textContent = `$${totals.subtotal.toFixed(2)}`;
  }

  drawerItems.innerHTML = cart.map(item => {
    const subFreq = item.subscription ? item.subscription.frequency : 'one-time';
    return `
      <div class="flex items-center gap-3 py-3 border-b border-slate-100">
        <a href="product.html?id=${item.id}" class="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-200">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
        </a>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-1">
            <a href="product.html?id=${item.id}" class="font-bold text-xs text-slate-900 hover:text-[#002D62] line-clamp-1 transition-colors">
              ${item.name}
            </a>
            <button onclick="removeFromCart('${item.id}', '${item.variantName}', '${subFreq}')" class="text-slate-400 hover:text-red-500 p-1" title="Remove Item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5">${item.variantName}</div>
          ${item.subscription ? `<div class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1">🔄 Autoship: ${item.subscription.frequency} (-15%)</div>` : ''}
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden h-7">
              <button onclick="updateCartQty('${item.id}', '${item.variantName}', ${item.quantity - 1}, '${subFreq}')" class="px-2 text-slate-600 hover:bg-slate-100 h-full flex items-center justify-center font-bold text-xs">−</button>
              <span class="px-2 text-xs font-bold text-slate-800">${item.quantity}</span>
              <button onclick="updateCartQty('${item.id}', '${item.variantName}', ${item.quantity + 1}, '${subFreq}')" class="px-2 text-slate-600 hover:bg-slate-100 h-full flex items-center justify-center font-bold text-xs">+</button>
            </div>
            <div class="text-xs font-bold text-[#002D62]">
              $${(item.unitPrice * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');
  if (drawer && backdrop && panel) {
    drawer.classList.remove('pointer-events-none');
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-50');
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
    renderCartDrawer();
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const panel = document.getElementById('cart-drawer-panel');
  if (drawer && backdrop && panel) {
    backdrop.classList.remove('opacity-50');
    backdrop.classList.add('opacity-0');
    panel.classList.remove('translate-x-0');
    panel.classList.add('translate-x-full');
    drawer.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }
}
