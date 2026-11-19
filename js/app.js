/**
 * Pet Buddy - Main Application Script
 * Sourced from Pet Buddy Imports Inc. (pet-buddy.net)
 * Official Amazon Store: https://www.amazon.ca/dp/B0H637LFT4/?th=1
 * Web Mail: infor@pet-buddy.net
 */

// Sourced from window
var AMAZON_STORE_URL = window.AMAZON_STORE_URL || "https://www.amazon.ca/dp/B0H637LFT4/?th=1";
var WHOLESALE_EMAIL = window.WHOLESALE_EMAIL || "infor@pet-buddy.net";

window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-[#0F172A] text-white border border-slate-700',
    info: 'bg-[#1E293B] text-white border border-slate-700',
    warning: 'bg-[#C8102E] text-white border border-[#A60D24]',
    error: 'bg-red-700 text-white border border-red-800'
  };

  const icons = {
    success: '<svg class="w-5 h-5 text-[#C8102E] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    info: '<svg class="w-5 h-5 text-blue-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    warning: '<svg class="w-5 h-5 text-amber-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
    error: '<svg class="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
  };

  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl max-w-sm text-xs font-semibold ${bgColors[type] || bgColors.success}`;
  toast.innerHTML = `
    ${icons[type] || icons.success}
    <div class="flex-1">${message}</div>
    <button class="text-white/70 hover:text-white ml-2" onclick="this.parentElement.remove()">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Product Card Generator - Pure E-Commerce Design with "Get a Quote" (Bulk Order) & Amazon Prime
function createProductCardHTML(product) {
  const isFav = typeof isInWishlist === 'function' ? isInWishlist(product.id) : false;
  const currentPrice = product.salePrice || product.price;
  const originalPrice = product.salePrice ? product.price : null;
  const amazonUrl = product.amazonUrl || AMAZON_STORE_URL;
  const lengthBadge = product.length ? `${product.length} Cut` : (product.thickness || 'Natural Chew');
  const ingredientBadge = product.category === 'treats' ? '100% Natural' : '100% Grass-Fed Beef';

  return `
    <div class="product-card group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between" data-product-id="${product.id}" data-category="${product.category}">
      
      <!-- Top Image Area -->
      <div class="relative bg-slate-50 aspect-square overflow-hidden img-zoom-hover">
        <a href="product.html?id=${product.id}" class="block w-full h-full">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </a>

        <!-- Floating Badges -->
        <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          <span class="bg-[#C8102E] text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md shadow-md">
            ${product.badge || lengthBadge}
          </span>
          <span class="bg-[#0F172A] text-white px-2 py-0.5 text-[9px] font-bold uppercase rounded-md shadow-sm">
            🍁 Canadian Owned
          </span>
        </div>

        <!-- Wishlist Button -->
        <button 
          data-wishlist-id="${product.id}" 
          onclick="toggleWishlist('${product.id}')" 
          aria-label="Save to Wishlist"
          class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 shadow-md flex items-center justify-center text-slate-400 hover:text-red-600 hover:scale-110 transition-all z-10 ${isFav ? 'text-red-600' : ''}">
          <svg class="w-4 h-4" fill="${isFav ? '#C8102E' : 'none'}" stroke="${isFav ? '#C8102E' : 'currentColor'}" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
        </button>

        <!-- Quick View Overlay -->
        <div class="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button 
            onclick="openQuickView('${product.id}')"
            class="w-full bg-[#0F172A]/95 hover:bg-[#0F172A] text-white font-bold text-xs py-2 px-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            Quick Specs &amp; Analysis
          </button>
        </div>
      </div>

      <!-- Card Details & Actions -->
      <div class="p-4 flex flex-col flex-1 justify-between">
        <div>
          <!-- Spec Badges Row -->
          <div class="flex items-center justify-between text-[11px] mb-1.5">
            <span class="text-slate-500 font-bold uppercase tracking-wider text-[10px]">${lengthBadge}</span>
            <span class="text-[#0F172A] bg-slate-100 font-bold px-2 py-0.5 rounded text-[10px]">${ingredientBadge}</span>
          </div>

          <!-- Product Title -->
          <h3 class="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-[#C8102E] transition-colors mb-1.5">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>

          <!-- Star Rating -->
          <div class="flex items-center gap-1.5 mb-2.5">
            <div class="flex text-[#F59E0B] text-xs">★★★★★</div>
            <span class="text-xs font-bold text-slate-800">${product.rating.toFixed(1)}</span>
            <span class="text-[11px] text-slate-400">(${product.reviewCount} Amazon Reviews)</span>
          </div>
        </div>

        <!-- Price & Action Buttons: GET A QUOTE (Primary) + BUY ON AMAZON (Retail) -->
        <div class="pt-2.5 border-t border-slate-100 mt-2">
          
          <div class="flex items-baseline justify-between mb-2.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-lg font-black text-[#0F172A] font-display">${currentPrice.toFixed(2)}</span>
              ${originalPrice ? `<span class="text-xs text-slate-400 line-through">${originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <span class="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 font-black px-1.5 py-0.5 rounded flex items-center gap-1">
              <span>Prime Delivery</span>
            </span>
          </div>

          <!-- ACTION BUTTONS: GET A QUOTE & BUY ON AMAZON -->
          <div class="space-y-1.5">
            
            <!-- GET A QUOTE (Bulk / Wholesale Order Form Trigger) -->
            <button 
              onclick="openBulkQuoteModal('${product.id}')"
              class="w-full bg-[#C8102E] hover:bg-[#A60D24] text-white font-black py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Get a Bulk Quote</span>
            </button>

            <!-- BUY ON AMAZON (Direct Retail Link) -->
            <a 
              href="${amazonUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="w-full bg-[#FF9900] hover:bg-[#E88B00] text-slate-950 font-black py-2 px-3 rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M15.42 18.06c-3.14 2.31-7.7 3.52-11.64 1.48-.56-.29-1.07-.65-1.53-1.07-.2-.18-.03-.43.21-.31 3.52 1.77 7.9 2.22 11.65-.12.44-.28.89.2.46.52l.85-.5zm1.5-1.1c-.24-.31-.86-.5-1.35-.38-.28.07-.37.28-.2.49.52.66 1.34 1.14 2.21 1.25.32.04.54-.15.42-.4-.28-.59-.72-.75-1.08-.96zM13.43 14.2c-.37-.48-.68-1.09-.68-1.84 0-1.81 1.38-2.67 3.03-2.67.62 0 1.05.07 1.49.19v-.36c0-.98-.65-1.54-1.74-1.54-.86 0-1.79.29-2.45.69-.17.1-.38-.02-.34-.23.15-.72.48-1.51.52-1.63.04-.12.18-.18.32-.24.77-.33 1.95-.57 3.1-.57 2.28 0 3.86 1.15 3.86 3.65v4.29c0 .54.04 1.09.24 1.57.06.14-.04.28-.18.28-.35 0-1.12-.13-1.42-.48-.09-.1-.13-.26-.15-.42-.51.68-1.4 1.17-2.6 1.17-1.49 0-2.66-.75-3.08-1.7z"/></svg>
              <span>Buy on Amazon Canada 🇨🇦</span>
            </a>

          </div>

        </div>

      </div>

    </div>
  `;
}

// Wholesale / Bulk Order Modal
window.openBulkQuoteModal = function(productId = '') {
  const product = productId && typeof getProductById === 'function' ? getProductById(productId) : null;
  let modal = document.getElementById('wholesale-quote-modal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'wholesale-quote-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300';
    modal.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm" onclick="closeBulkQuoteModal()"></div>
      <div class="modal-card relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 transform scale-95 transition-transform duration-300">
        <button onclick="closeBulkQuoteModal()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="text-center mb-6">
          <span class="bg-red-50 text-[#C8102E] font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-red-200">
            Wholesale &amp; Bulk Orders
          </span>
          <h3 class="text-2xl font-black text-slate-900 mt-2 font-display">Request a Wholesale Quote</h3>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Pet Buddy Imports Inc. supplies pet shops, boutiques, and clinics across North America. For retail purchases, please buy directly on Amazon.
          </p>
        </div>

        <form id="wholesale-quote-form" onsubmit="handleQuoteSubmit(event)" class="space-y-3.5 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Your Name *</label>
              <input type="text" id="quote-name" required placeholder="John Doe" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Business / Store *</label>
              <input type="text" id="quote-business" required placeholder="Paws Pet Boutique" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Email (Response to) *</label>
              <input type="email" id="quote-email" required placeholder="buyer@petstore.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="tel" id="quote-phone" placeholder="+1 (416) 000-0000" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]">
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Product Interested In *</label>
            <select id="quote-product" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E] font-medium">
              <option value="6-Inch Extra Thick Bully Sticks">6-Inch Extra Thick Bully Sticks (Cases)</option>
              <option value="12-Inch Monster Bully Sticks">12-Inch Monster Bully Sticks (Cases)</option>
              <option value="Braided Bully Sticks">6-Inch Braided Bully Sticks</option>
              <option value="Smoked Beef Femur Bones">Smoked Beef Femur Bones XL</option>
              <option value="Full Mixed Pallet">Full Mixed Pallet Order</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Estimated Quantity / Volume *</label>
            <select id="quote-volume" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E] font-medium">
              <option value="5 - 10 Cases (Trial)">5 - 10 Cases (Trial Wholesale Order)</option>
              <option value="10 - 25 Cases">10 - 25 Cases</option>
              <option value="25 - 50 Cases">25 - 50 Cases</option>
              <option value="Pallet Load (100+ Cases)">Pallet Load (100+ Cases)</option>
              <option value="Distributor Bulk (500+ lbs)">Distributor Bulk (500+ lbs)</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Delivery City &amp; Province / State</label>
            <input type="text" id="quote-location" placeholder="e.g. Toronto, ON or Vancouver, BC" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]">
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Additional Notes</label>
            <textarea id="quote-notes" rows="2" placeholder="Tell us about your distribution needs..." class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]"></textarea>
          </div>

          <button type="submit" class="w-full bg-[#C8102E] hover:bg-[#A60D24] text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all">
            Send Quote Request to infor@pet-buddy.net &rarr;
          </button>
        </form>

        <div class="mt-4 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500">
          <span>Need immediate answers? Email: </span>
          <a href="mailto:infor@pet-buddy.net" class="font-bold text-[#C8102E] underline">infor@pet-buddy.net</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  if (product) {
    const prodSelect = document.getElementById('quote-product');
    if (prodSelect) prodSelect.value = product.length ? `${product.length} Extra Thick Bully Sticks` : prodSelect.value;
  }

  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.querySelector('.modal-card').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
};

window.closeBulkQuoteModal = function() {
  const modal = document.getElementById('wholesale-quote-modal');
  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-card').classList.add('scale-95');
    document.body.style.overflow = '';
  }
};

window.handleQuoteSubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('quote-name').value;
  const business = document.getElementById('quote-business').value;
  const email = document.getElementById('quote-email').value;
  const phone = document.getElementById('quote-phone').value;
  const product = document.getElementById('quote-product').value;
  const volume = document.getElementById('quote-volume').value;
  const location = document.getElementById('quote-location').value;
  const notes = document.getElementById('quote-notes').value;

  const subject = encodeURIComponent(`Wholesale Quote Request: ${business} (${name})`);
  const body = encodeURIComponent(
    `Hello Pet Buddy Sales Team,\n\n` +
    `I would like to request wholesale pricing for Pet Buddy products.\n\n` +
    `Name: ${name}\n` +
    `Business: ${business}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone}\n` +
    `Product Interest: ${product}\n` +
    `Estimated Volume: ${volume}\n` +
    `Delivery Location: ${location}\n` +
    `Notes: ${notes}\n\n` +
    `Thank you!`
  );

  // Store in LocalStorage
  const quoteData = { name, business, email, phone, product, volume, location, notes, date: new Date().toISOString() };
  try {
    const existing = JSON.parse(localStorage.getItem('pet_buddy_quotes') || '[]');
    existing.push(quoteData);
    localStorage.setItem('pet_buddy_quotes', JSON.stringify(existing));
  } catch (err) {}

  closeBulkQuoteModal();
  window.showToast(`✅ Quote request sent! Our sales team will email you at ${email} shortly.`, 'success');

  // Launch email client to infor@pet-buddy.net
  setTimeout(() => {
    window.location.href = `mailto:infor@pet-buddy.net?subject=${subject}&body=${body}`;
  }, 400);
};

// Quick View Modal
function openQuickView(productId) {
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;
  if (!product) return;

  let modal = document.getElementById('quick-view-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'quick-view-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300';
    modal.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm" onclick="closeQuickView()"></div>
      <div class="modal-card relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row transform scale-95 transition-transform duration-300">
        <button onclick="closeQuickView()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white text-slate-500 hover:text-black flex items-center justify-center shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div id="quick-view-content" class="w-full flex flex-col md:flex-row overflow-y-auto"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const container = document.getElementById('quick-view-content');
  const price = product.salePrice || product.price;

  container.innerHTML = `
    <div class="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between">
      <div class="rounded-2xl overflow-hidden aspect-square border border-slate-200">
        <img id="qv-main-img" src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover">
      </div>
      <div class="flex gap-2 mt-4 overflow-x-auto pb-1">
        ${product.images.map((img, i) => `
          <button onclick="document.getElementById('qv-main-img').src='${img}'" class="w-14 h-14 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#C8102E] flex-shrink-0">
            <img src="${img}" class="w-full h-full object-cover" alt="Thumb ${i}">
          </button>
        `).join('')}
      </div>
    </div>

    <div class="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
      <div>
        <div class="text-[11px] font-black text-[#C8102E] uppercase tracking-wider mb-1">${product.length ? product.length + ' Cut • ' : ''}100% All-Natural Single Ingredient</div>
        <h2 class="text-xl font-bold text-slate-900 font-display mb-2">${product.name}</h2>
        
        <div class="flex items-center gap-2 mb-3">
          <div class="flex text-[#F59E0B] text-xs">★★★★★</div>
          <span class="text-xs font-bold">${product.rating.toFixed(1)}</span>
          <span class="text-xs text-slate-400">(${product.reviewCount} Amazon Reviews)</span>
        </div>

        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-2xl font-black text-[#0F172A] font-display">$${price.toFixed(2)}</span>
          <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Official Amazon Seller</span>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed mb-4">${product.description}</p>

        <div class="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
          <strong class="text-slate-800">Ingredients:</strong>
          <span class="text-slate-600 ml-1">${product.ingredients}</span>
        </div>
      </div>

      <div class="space-y-2 pt-3 border-t border-slate-200">
        <a 
          href="${product.amazonUrl || AMAZON_STORE_URL}" 
          target="_blank"
          rel="noopener noreferrer"
          class="w-full bg-[#FF9900] hover:bg-[#E88B00] text-slate-950 font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all">
          <span>Buy on Amazon Canada 🇨🇦</span>
        </a>

        <button 
          onclick="closeQuickView(); openBulkQuoteModal('${product.id}');"
          class="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
          <span>Request Wholesale Quote</span>
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.querySelector('.modal-card').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-card').classList.add('scale-95');
    document.body.style.overflow = '';
  }
}

// Chew Finder Quiz Modal
window.chewQuizData = { dogSize: null, chewStyle: null };

window.openChewQuiz = function() {
  let modal = document.getElementById('chew-quiz-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'chew-quiz-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-0 pointer-events-none transition-opacity duration-300';
    modal.innerHTML = `
      <div class="modal-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm" onclick="closeChewQuiz()"></div>
      <div class="modal-card relative bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 transform scale-95 transition-transform duration-300">
        <button onclick="closeChewQuiz()" class="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div id="quiz-step-1">
          <div class="text-center mb-6">
            <span class="bg-red-50 text-[#C8102E] font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">Pet Buddy Chew Finder</span>
            <h3 class="text-2xl font-black text-slate-900 mt-2 font-display">Step 1: How big is your dog?</h3>
            <p class="text-xs text-slate-500 mt-1">We'll tailor chew thickness and length for optimal safety.</p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <button onclick="setQuizSize('small')" class="p-4 border-2 border-slate-200 rounded-2xl hover:border-[#C8102E] hover:bg-red-50/40 text-left transition-all">
              <div class="text-2xl mb-1">🐾</div>
              <div class="font-bold text-slate-900 text-sm">Puppy / Small</div>
              <div class="text-[11px] text-slate-500">Under 20 lbs (6" Sticks)</div>
            </button>
            <button onclick="setQuizSize('medium')" class="p-4 border-2 border-slate-200 rounded-2xl hover:border-[#C8102E] hover:bg-red-50/40 text-left transition-all">
              <div class="text-2xl mb-1">🐕</div>
              <div class="font-bold text-slate-900 text-sm">Medium Dog</div>
              <div class="text-[11px] text-slate-500">20 - 50 lbs (6" Extra Thick)</div>
            </button>
            <button onclick="setQuizSize('large')" class="p-4 border-2 border-slate-200 rounded-2xl hover:border-[#C8102E] hover:bg-red-50/40 text-left transition-all">
              <div class="text-2xl mb-1">🦮</div>
              <div class="font-bold text-slate-900 text-sm">Large Dog</div>
              <div class="text-[11px] text-slate-500">50 - 90 lbs (12" Monster)</div>
            </button>
            <button onclick="setQuizSize('giant')" class="p-4 border-2 border-slate-200 rounded-2xl hover:border-[#C8102E] hover:bg-red-50/40 text-left transition-all">
              <div class="text-2xl mb-1">🦁</div>
              <div class="font-bold text-slate-900 text-sm">Giant / Power</div>
              <div class="text-[11px] text-slate-500">90+ lbs (12" Monster / Femur)</div>
            </button>
          </div>
        </div>

        <div id="quiz-step-2" class="hidden">
          <div class="text-center mb-6">
            <span class="bg-red-50 text-[#C8102E] font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full">Step 2 of 2</span>
            <h3 class="text-2xl font-black text-slate-900 mt-2 font-display">What's their chewing style?</h3>
            <p class="text-xs text-slate-500 mt-1">Select how aggressively your pup chews.</p>
          </div>
          <div class="space-y-3">
            <button onclick="setQuizStyle('gentle')" class="w-full p-4 border-2 border-slate-200 rounded-2xl hover:border-[#C8102E] hover:bg-red-50/40 text-left transition-all flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-900 text-sm">Gentle / Moderate Chew</div>
                <div class="text-[11px] text-slate-500">Enjoys daily relaxation chews</div>
              </div>
              <span class="text-xl">🦴</span>
            </button>
            <button onclick="setQuizStyle('power')" class="w-full p-4 border-2 border-slate-200 rounded-2xl hover:border-[#C8102E] hover:bg-red-50/40 text-left transition-all flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-900 text-sm">Relentless Power Chewer</div>
                <div class="text-[11px] text-slate-500">Needs maximum density to last</div>
              </div>
              <span class="text-xl">🔥</span>
            </button>
          </div>
        </div>

        <div id="quiz-result" class="hidden text-center">
          <div class="w-16 h-16 bg-red-100 text-[#C8102E] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">✓</div>
          <span class="text-xs font-black uppercase tracking-wider text-[#C8102E]">Recommended For Your Pup</span>
          <h3 id="quiz-match-title" class="text-xl font-bold text-slate-900 mt-1 font-display">Pet Buddy 6" Extra Thick Bully Sticks</h3>
          <p id="quiz-match-desc" class="text-xs text-slate-500 mt-2 max-w-md mx-auto"></p>
          <div id="quiz-match-img" class="my-4 max-w-[160px] mx-auto rounded-xl overflow-hidden shadow-md"></div>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a 
              id="quiz-amazon-btn"
              href="${AMAZON_STORE_URL}" 
              target="_blank"
              class="w-full sm:w-auto bg-[#FF9900] hover:bg-[#E88B00] text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2">
              <span>Buy on Amazon Canada 🇨🇦</span>
            </a>
            <button onclick="closeChewQuiz(); openBulkQuoteModal();" class="w-full sm:w-auto bg-[#0F172A] text-white font-bold px-4 py-3 rounded-xl text-xs">
              Request Wholesale Quote
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  resetChewQuiz();
  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.querySelector('.modal-card').classList.remove('scale-95');
  document.body.style.overflow = 'hidden';
};

window.closeChewQuiz = function() {
  const modal = document.getElementById('chew-quiz-modal');
  if (modal) {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.querySelector('.modal-card').classList.add('scale-95');
    document.body.style.overflow = '';
  }
};

window.resetChewQuiz = function() {
  window.chewQuizData = { dogSize: null, chewStyle: null };
  const s1 = document.getElementById('quiz-step-1');
  const s2 = document.getElementById('quiz-step-2');
  const res = document.getElementById('quiz-result');
  if (s1) s1.classList.remove('hidden');
  if (s2) s2.classList.add('hidden');
  if (res) res.classList.add('hidden');
};

window.setQuizSize = function(size) {
  window.chewQuizData.dogSize = size;
  document.getElementById('quiz-step-1').classList.add('hidden');
  document.getElementById('quiz-step-2').classList.remove('hidden');
};

window.setQuizStyle = function(style) {
  window.chewQuizData.chewStyle = style;
  document.getElementById('quiz-step-2').classList.add('hidden');
  
  let targetProduct = PRODUCTS_DATA[0]; // 6" Extra Thick
  if (window.chewQuizData.dogSize === 'large' || window.chewQuizData.dogSize === 'giant') {
    targetProduct = PRODUCTS_DATA.find(p => p.id === 'pb-12in-3pk') || PRODUCTS_DATA[0]; // 12" Monster
  }

  const res = document.getElementById('quiz-result');
  const title = document.getElementById('quiz-match-title');
  const desc = document.getElementById('quiz-match-desc');
  const imgBox = document.getElementById('quiz-match-img');

  title.textContent = targetProduct.name;
  desc.textContent = `Based on your ${window.chewQuizData.dogSize} dog with a ${style} chew habit, this 100% natural grass-fed beef stick provides the safest, longest-lasting satisfaction.`;
  imgBox.innerHTML = `<img src="${targetProduct.images[0]}" alt="${targetProduct.name}" class="w-full h-auto object-cover">`;

  res.classList.remove('hidden');
};

// Live Search Autocomplete
function initLiveSearch() {
  const searchInputs = document.querySelectorAll('.header-search-input');
  searchInputs.forEach(input => {
    const parentForm = input.closest('form');
    const dropdown = parentForm ? parentForm.querySelector('.search-results-dropdown') : null;

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!dropdown) return;

      if (query.length < 2) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        return;
      }

      const matches = PRODUCTS_DATA.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.categoryName.toLowerCase().includes(query) ||
        p.length.toLowerCase().includes(query)
      ).slice(0, 5);

      if (matches.length === 0) {
        dropdown.classList.remove('hidden');
        dropdown.innerHTML = `
          <div class="p-4 text-center text-xs text-slate-500">
            No chews found for "<span class="font-bold text-slate-700">${query}</span>".
            <div class="mt-2 text-[#C8102E] font-bold"><a href="shop.html">Browse All Bully Sticks &rarr;</a></div>
          </div>
        `;
        return;
      }

      dropdown.classList.remove('hidden');
      dropdown.innerHTML = `
        <div class="p-2 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">Products (${matches.length})</div>
        ${matches.map(m => `
          <a href="product.html?id=${m.id}" class="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
            <img src="${m.images[0]}" alt="${m.name}" class="w-12 h-12 object-cover rounded-lg bg-slate-100">
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-slate-900 truncate">${m.name}</div>
              <div class="text-[11px] text-slate-500">${m.length} • 100% Beef</div>
              <div class="text-xs font-bold text-[#C8102E]">$${(m.salePrice || m.price).toFixed(2)}</div>
            </div>
          </a>
        `).join('')}
        <div class="p-2.5 bg-slate-50 text-center">
          <a href="shop.html?search=${encodeURIComponent(query)}" class="text-xs font-bold text-[#C8102E] hover:underline">
            View All Results &rarr;
          </a>
        </div>
      `;
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
}

function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (openBtn && drawer && backdrop) {
    openBtn.addEventListener('click', () => {
      drawer.classList.remove('-translate-x-full');
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeMenu = () => {
    if (drawer && backdrop) {
      drawer.classList.add('-translate-x-full');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof updateWishlistUI === 'function') updateWishlistUI();
  initLiveSearch();
  initMobileMenu();

  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    });
  }
});


// Homepage Category Tab Filter Helper
window.filterHomepageCategory = function(catKey, buttonEl) {
  if (typeof PRODUCTS_DATA === 'undefined') return;

  // Update tab buttons
  document.querySelectorAll('.hp-cat-tab').forEach(btn => {
    btn.className = 'hp-cat-tab px-4 py-2 rounded-xl text-xs font-black transition-all bg-white text-slate-700 border border-slate-200 hover:border-[#C8102E]';
  });
  if (buttonEl) {
    buttonEl.className = 'hp-cat-tab px-4 py-2 rounded-xl text-xs font-black transition-all bg-[#C8102E] text-white shadow-md';
  }

  const container = document.getElementById('homepage-bestsellers-grid');
  if (!container) return;

  let filtered = [...PRODUCTS_DATA];
  if (catKey !== 'all') {
    filtered = PRODUCTS_DATA.filter(p => p.category === catKey);
  }

  container.innerHTML = filtered.map(createProductCardHTML).join('');
  if (typeof updateWishlistUI === 'function') updateWishlistUI();
};
