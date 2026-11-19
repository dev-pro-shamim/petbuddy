/**
 * Pet Buddy - Wishlist Engine
 * Handles saving favorites, header badge syncing, and move-to-cart
 */

const WISHLIST_STORAGE_KEY = 'pet_buddy_wishlist';

function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse wishlist:', e);
    return [];
  }
}

function saveWishlist(wishlist) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    updateWishlistUI();
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  const product = typeof getProductById === 'function' ? getProductById(productId) : null;
  const name = product ? product.name : 'Product';

  if (index > -1) {
    wishlist.splice(index, 1);
    if (window.showToast) window.showToast(`Removed "${name}" from Wishlist`, 'info');
  } else {
    wishlist.push(productId);
    if (window.showToast) window.showToast(`Saved "${name}" to your Wishlist!`, 'success');
  }

  saveWishlist(wishlist);
  return index === -1; // returns true if now in wishlist
}

function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(id => id !== productId);
  saveWishlist(wishlist);
  if (window.showToast) window.showToast('Item removed from wishlist', 'info');
}

function moveWishlistToCart(productId) {
  if (typeof getProductById !== 'function' || typeof addToCart !== 'function') return;
  const product = getProductById(productId);
  if (product) {
    const defaultVariant = product.variants ? product.variants[0] : null;
    addToCart(product, defaultVariant, 1, null);
    removeFromWishlist(productId);
    if (window.showToast) window.showToast(`Moved "${product.name}" to your Cart!`, 'success');
  }
}

function updateWishlistUI() {
  const wishlist = getWishlist();
  const badges = document.querySelectorAll('.wishlist-count-badge');
  badges.forEach(badge => {
    badge.textContent = wishlist.length;
    badge.classList.toggle('hidden', wishlist.length === 0);
  });

  // Update heart buttons across page
  const heartButtons = document.querySelectorAll('[data-wishlist-id]');
  heartButtons.forEach(btn => {
    const id = btn.getAttribute('data-wishlist-id');
    const isSaved = wishlist.includes(id);
    const heartSvg = btn.querySelector('svg');
    if (heartSvg) {
      if (isSaved) {
        heartSvg.setAttribute('fill', '#ef4444');
        heartSvg.setAttribute('stroke', '#ef4444');
        btn.classList.add('text-red-500');
        btn.classList.remove('text-gray-400', 'text-gray-600');
      } else {
        heartSvg.setAttribute('fill', 'none');
        heartSvg.setAttribute('stroke', 'currentColor');
        btn.classList.remove('text-red-500');
        btn.classList.add('text-gray-400');
      }
    }
  });

  // If on wishlist.html, trigger renderer
  if (typeof renderWishlistPage === 'function') {
    renderWishlistPage();
  }
}
