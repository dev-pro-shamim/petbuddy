/**
 * Pet Buddy - Product Details Page Logic
 * Handles image zoom, variant selection, subscribe & save toggles,
 * nutrition accordion, reviews, and related items.
 */

let currentProduct = null;
let currentVariantIndex = 0;
let currentPurchaseMode = 'one-time'; // 'one-time' or 'subscribe'

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'pb-6in-6pk';
}

function initProductDetailsPage() {
  const prodId = getProductIdFromUrl();
  currentProduct = typeof getProductById === 'function' ? getProductById(prodId) : null;

  if (!currentProduct) {
    currentProduct = PRODUCTS_DATA[0]; // fallback
  }

  // Populate Breadcrumbs
  document.getElementById('pdp-breadcrumb-title').textContent = currentProduct.name;
  const catLink = document.getElementById('pdp-category-link');
  catLink.textContent = currentProduct.categoryName;
  catLink.href = `category.html?cat=${currentProduct.category}`;

  // Populate Basic Details
  document.getElementById('pdp-category-badge').textContent = currentProduct.categoryName;
  document.getElementById('pdp-chew-strength').textContent = `Chew Strength: ${currentProduct.chewStrength}`;
  document.getElementById('pdp-title').textContent = currentProduct.name;
  document.title = `${currentProduct.name} | Pet Buddy`;

  // Stars & Ratings
  const starsHtml = '★'.repeat(Math.floor(currentProduct.rating)) + '☆'.repeat(5 - Math.floor(currentProduct.rating));
  document.getElementById('pdp-stars').textContent = starsHtml;
  document.getElementById('pdp-rating-number').textContent = currentProduct.rating.toFixed(1);
  document.getElementById('pdp-review-count').textContent = `(${currentProduct.reviewCount} Verified Reviews)`;
  document.getElementById('reviews-summary-text').textContent = `${currentProduct.rating.toFixed(1)} out of 5 stars based on ${currentProduct.reviewCount} customer reviews`;

  // Description
  document.getElementById('pdp-description').textContent = currentProduct.description;

  // Images & Zoom Setup
  setupGalleryAndZoom(currentProduct.images);

  // Badges
  const badgesContainer = document.getElementById('pdp-badges-container');
  badgesContainer.innerHTML = '';
  if (currentProduct.badge) {
    badgesContainer.innerHTML += `<span class="px-3 py-1 text-xs font-bold uppercase rounded-full shadow-md ${currentProduct.badge === 'Best Seller' ? 'badge-best-seller' : 'badge-natural'}">${currentProduct.badge}</span>`;
  }

  // Variants
  setupVariants(currentProduct.variants);

  // Benefits List
  const benefitsContainer = document.getElementById('pdp-benefits-list');
  benefitsContainer.innerHTML = currentProduct.benefits.map(b => `
    <div class="flex items-start gap-2.5 bg-white p-3.5 rounded-2xl border border-cream-200">
      <span class="text-forest-700 text-sm mt-0.5">✓</span>
      <span class="text-xs text-gray-700 font-medium leading-relaxed">${b}</span>
    </div>
  `).join('');

  // Feeding & Ingredients & Analysis
  const feedingGuideElem = document.getElementById('pdp-feeding-guide');
  if (feedingGuideElem) {
    feedingGuideElem.textContent = currentProduct.feedingGuide || "Supervise your pet while chewing. Provide plenty of fresh water. Intended as a supplemental recreational chew.";
  }
  const ingredientsElem = document.getElementById('pdp-ingredients');
  if (ingredientsElem) {
    ingredientsElem.textContent = currentProduct.ingredients || "100% Pure Natural Single-Ingredient Beef Pizzle.";
  }

  const analysisContainer = document.getElementById('pdp-analysis-table');
  if (analysisContainer) {
    const rawAnalysis = currentProduct.analysis || currentProduct.guaranteedAnalysis || {
      crudeProtein: "82.0% min",
      crudeFat: "3.5% min",
      crudeFiber: "1.0% max",
      moisture: "12.0% max"
    };
    analysisContainer.innerHTML = Object.entries(rawAnalysis).map(([key, val]) => `
      <div class="py-2.5 flex justify-between border-b border-slate-700/50 last:border-0">
        <span class="text-slate-300 capitalize">${key.replace(/([A-Z])/g, ' $1')}:</span>
        <span class="font-bold text-white">${val}</span>
      </div>
    `).join('');
  }

  // Setup Customer Reviews
  renderCustomerReviews();

  // Related Products
  renderRelatedProducts();

  // Wishlist button sync
  updatePdpWishlistButton();
}

function setupGalleryAndZoom(images) {
  const mainImg = document.getElementById('main-product-img');
  const thumbsContainer = document.getElementById('thumbnails-container');
  const zoomContainer = document.getElementById('zoom-container');

  mainImg.src = images[0];

  thumbsContainer.innerHTML = images.map((img, i) => `
    <button onclick="changeMainImage('${img}', ${i})" class="pdp-thumb border-2 rounded-2xl overflow-hidden aspect-square transition-all ${i === 0 ? 'border-forest-800 ring-2 ring-forest-800/20' : 'border-transparent hover:border-cream-300'}">
      <img src="${img}" class="w-full h-full object-cover" alt="Thumbnail ${i}">
    </button>
  `).join('');

  // Interactive Zoom Effect
  zoomContainer.addEventListener('mousemove', (e) => {
    const rect = zoomContainer.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mainImg.style.transformOrigin = `${x}% ${y}%`;
    mainImg.style.transform = 'scale(1.8)';
  });

  zoomContainer.addEventListener('mouseleave', () => {
    mainImg.style.transform = 'scale(1)';
  });
}

function changeMainImage(url, index) {
  const mainImg = document.getElementById('main-product-img');
  mainImg.src = url;
  const thumbs = document.querySelectorAll('.pdp-thumb');
  thumbs.forEach((t, i) => {
    if (i === index) {
      t.className = 'pdp-thumb border-2 rounded-2xl overflow-hidden aspect-square transition-all border-forest-800 ring-2 ring-forest-800/20';
    } else {
      t.className = 'pdp-thumb border-2 rounded-2xl overflow-hidden aspect-square transition-all border-transparent hover:border-cream-300';
    }
  });
}

function setupVariants(variants) {
  const container = document.getElementById('pdp-variants-container');
  if (!variants || variants.length === 0) {
    container.innerHTML = '<div class="text-xs text-gray-500">Standard pack available</div>';
    recalculatePrices();
    return;
  }

  container.innerHTML = variants.map((v, i) => `
    <button 
      type="button" 
      onclick="selectPdpVariant(${i})"
      class="pdp-var-btn p-3 rounded-2xl border text-left transition-all ${i === 0 ? 'border-forest-800 bg-forest-50/50 text-forest-950 font-bold' : 'border-cream-300 bg-white text-gray-700 hover:border-gray-400'}"
      data-index="${i}">
      <div class="text-xs">${v.name}</div>
      <div class="text-[11px] text-gray-500 font-normal">${v.packSize ? v.packSize + ' Sticks' : (v.weight || 'Standard Pack')}</div>
      <div class="text-xs font-bold text-forest-800 mt-1">$${(v.salePrice || v.price).toFixed(2)}</div>
    </button>
  `).join('');

  selectPdpVariant(0);
}

function selectPdpVariant(index) {
  currentVariantIndex = index;
  const variant = currentProduct.variants ? currentProduct.variants[index] : null;

  if (variant) {
    document.getElementById('pdp-selected-weight').textContent = `Pack Size: ${variant.packSize ? variant.packSize + ' Sticks' : (variant.weight || variant.name)}`;
  }

  const buttons = document.querySelectorAll('.pdp-var-btn');
  buttons.forEach((btn, i) => {
    if (i === index) {
      btn.className = 'pdp-var-btn p-3 rounded-2xl border text-left transition-all border-forest-800 bg-forest-50/50 text-forest-950 font-bold shadow-sm';
    } else {
      btn.className = 'pdp-var-btn p-3 rounded-2xl border text-left transition-all border-cream-300 bg-white text-gray-700 hover:border-gray-400';
    }
  });

  recalculatePrices();
}

function togglePurchaseMode(mode) {
  currentPurchaseMode = mode;
  const freqBox = document.getElementById('subscription-frequency-box');
  const labelOne = document.getElementById('label-one-time');
  const labelSub = document.getElementById('label-subscribe');

  if (mode === 'subscribe') {
    freqBox.classList.remove('hidden');
    labelSub.classList.add('border-emerald-700', 'bg-emerald-50/70');
    labelOne.classList.remove('border-forest-800', 'bg-forest-50/50');
  } else {
    freqBox.classList.add('hidden');
    labelSub.classList.remove('border-emerald-700', 'bg-emerald-50/70');
    labelOne.classList.add('border-forest-800', 'bg-forest-50/50');
  }

  recalculatePrices();
}

function recalculatePrices() {
  const variant = currentProduct.variants ? currentProduct.variants[currentVariantIndex] : null;
  const basePrice = variant ? (variant.salePrice || variant.price) : (currentProduct.salePrice || currentProduct.price);
  const regPrice = variant ? variant.price : currentProduct.price;

  const subPrice = +(basePrice * 0.85).toFixed(2);

  const otpEl = document.getElementById('pdp-one-time-price'); if (otpEl) otpEl.textContent = `${basePrice.toFixed(2)}`;
  const sbpEl = document.getElementById('pdp-subscribe-price'); if (sbpEl) sbpEl.textContent = `${subPrice.toFixed(2)}`;

  if (currentPurchaseMode === 'subscribe') {
    document.getElementById('pdp-current-price').textContent = `$${subPrice.toFixed(2)}`;
    document.getElementById('pdp-save-badge').classList.remove('hidden');
    document.getElementById('pdp-save-badge').textContent = `Autoship 15% Off Active`;
  } else {
    document.getElementById('pdp-current-price').textContent = `$${basePrice.toFixed(2)}`;
    if (variant && variant.salePrice) {
      document.getElementById('pdp-original-price').textContent = `$${regPrice.toFixed(2)}`;
      document.getElementById('pdp-original-price').classList.remove('hidden');
    } else {
      document.getElementById('pdp-original-price').classList.add('hidden');
    }
    document.getElementById('pdp-save-badge').textContent = `Save 15% with Autoship`;
  }
}

function changeQuantity(delta) {
  const input = document.getElementById('pdp-quantity-input');
  let val = parseInt(input.value) || 1;
  val = Math.max(1, val + delta);
  input.value = val;
}

function executeAddToCart() {
  const qty = parseInt(document.getElementById('pdp-quantity-input').value) || 1;
  const variant = currentProduct.variants ? currentProduct.variants[currentVariantIndex] : null;
  const isSub = currentPurchaseMode === 'subscribe';
  const frequency = isSub ? document.getElementById('sub-frequency-select').value : null;

  const subscriptionObj = isSub ? { isSubscription: true, frequency: frequency, discount: 0.15 } : null;

  addToCart(currentProduct, variant, qty, subscriptionObj);
}

function executeBuyNow() {
  executeAddToCart();
  setTimeout(() => {
    window.location.href = 'checkout.html';
  }, 300);
}

function executeToggleWishlist() {
  toggleWishlist(currentProduct.id);
  updatePdpWishlistButton();
}

function updatePdpWishlistButton() {
  const btn = document.getElementById('pdp-wishlist-btn');
  if (!btn) return;
  const isFav = isInWishlist(currentProduct.id);
  const svg = btn.querySelector('svg');
  if (isFav) {
    svg.setAttribute('fill', '#ef4444');
    svg.setAttribute('stroke', '#ef4444');
    btn.classList.add('text-red-500');
  } else {
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    btn.classList.remove('text-red-500');
  }
}

// Demo Reviews Data
const DEMO_REVIEWS = [
  {
    name: "Cynthia R. & Barnaby (Golden Retriever)",
    rating: 5,
    date: "November 4, 2026",
    title: "Hands down the best chew on the market",
    comment: "Barnaby is an aggressive chewer who gets bored easily. One 6-inch stick kept him occupied for almost an hour! Zero gross odor and his teeth look sparkling clean."
  },
  {
    name: "David K. & Luna (Lab Mix)",
    rating: 5,
    date: "October 28, 2026",
    title: "Autoship makes life so simple",
    comment: "I subscribe to the 10-pack every month. It always arrives on time and saves us 15%. My vet was amazed at how little tartar Luna had."
  },
  {
    name: "Amanda P. & Winston (French Bulldog)",
    rating: 5,
    date: "October 15, 2026",
    title: "100% digestible & no stomach issues",
    comment: "Frenchies have notorious sensitive stomachs. These single ingredient treats have never caused any tummy upset. We will never buy rawhide again!"
  }
];

function renderCustomerReviews() {
  const list = document.getElementById('pdp-reviews-list');
  list.innerHTML = DEMO_REVIEWS.map(r => `
    <div class="bg-white p-6 rounded-3xl border border-cream-200 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <div class="text-amber-500 text-sm">${'★'.repeat(r.rating)}</div>
          <span class="font-bold text-xs text-gray-900">${r.title}</span>
        </div>
        <span class="text-[11px] text-gray-400">${r.date}</span>
      </div>
      <p class="text-xs text-gray-600 leading-relaxed font-normal">${r.comment}</p>
      <div class="mt-3 flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
        <span>✓ Verified Canine Parent:</span>
        <span class="text-gray-900">${r.name}</span>
      </div>
    </div>
  `).join('');
}

function toggleReviewForm() {
  const form = document.getElementById('write-review-form');
  form.classList.toggle('hidden');
}

function submitDemoReview(e) {
  e.preventDefault();
  const author = document.getElementById('review-author').value;
  const stars = parseInt(document.getElementById('review-stars').value);
  const text = document.getElementById('review-text').value;

  DEMO_REVIEWS.unshift({
    name: author,
    rating: stars,
    date: "Just now",
    title: "Verified Customer Review",
    comment: text
  });

  renderCustomerReviews();
  toggleReviewForm();
  window.showToast('Thank you for sharing your review with the pack!', 'success');
}

function renderRelatedProducts() {
  const grid = document.getElementById('related-products-grid');
  if (!grid) return;
  const related = PRODUCTS_DATA.filter(p => p.id !== currentProduct.id).slice(0, 4);
  grid.innerHTML = related.map(createProductCardHTML).join('');
}

document.addEventListener('DOMContentLoaded', initProductDetailsPage);
