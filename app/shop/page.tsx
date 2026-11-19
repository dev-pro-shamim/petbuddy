'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import QuoteModal from '@/components/QuoteModal';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLength, setSelectedLength] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState('Pet Buddy Bully Sticks');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('cat');
      const lenParam = urlParams.get('length');
      const qParam = urlParams.get('q');
      if (catParam) setSelectedCategory(catParam);
      if (lenParam) setSelectedLength(lenParam);
      if (qParam) setSearchTerm(qParam);
    }

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
  }, []);

  const handleOpenQuote = (prodName?: string) => {
    if (prodName) setSelectedProductForQuote(prodName);
    setQuoteModalOpen(true);
  };

  // Filter products
  const filtered = products.filter(p => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = p.name.toLowerCase().includes(q) ||
                    (p.category || '').toLowerCase().includes(q) ||
                    (p.description || '').toLowerCase().includes(q) ||
                    (p.length || '').toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    if (selectedLength !== 'all' && p.length !== selectedLength) {
      return false;
    }

    if (inStockOnly && p.inStock === false) {
      return false;
    }

    return true;
  });

  // Sort products (Price removed, focus on rating and popularity)
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    if (sortBy === 'reviews') return (b.reviews || 0) - (a.reviews || 0);
    return 0; // featured
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header onOpenQuote={() => handleOpenQuote()} />

      {/* Shop Header Banner */}
      <div className="bg-gradient-to-r from-[#0C3823] via-[#0F172A] to-[#6B0D1B] text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-[#FF9900] text-xs font-black uppercase tracking-wider">
            All-Natural Canine Chews Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-black">
            Pet Buddy Complete Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            100% grass-fed beef pizzle, smoked bones, and natural dog treats. Available in certified 6-inch and 12-inch cuts. Wholesale B2B case orders &amp; Amazon Prime Canada.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Controls & Filter Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search catalog by keyword, size, cut..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[#C8102E] focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-bold">
              
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#C8102E]">
                <option value="all">All Categories</option>
                <option value="bully-sticks">Bully Sticks</option>
                <option value="chews-bones">Bones &amp; Chews</option>
                <option value="treats">Natural Treats</option>
              </select>

              {/* Length Filter (6" vs 12") */}
              <select
                value={selectedLength}
                onChange={e => setSelectedLength(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#C8102E]">
                <option value="all">All Lengths</option>
                <option value="6-Inch">6-Inch Sticks</option>
                <option value="12-Inch">12-Inch Sticks</option>
                <option value="Natural Cut">Natural Cut / Bones</option>
              </select>

              {/* Sorting */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-slate-800 focus:outline-none focus:border-[#C8102E]">
                <option value="featured">Sort: Featured Collection</option>
                <option value="rating">Top Rated by Customers</option>
                <option value="reviews">Most Reviewed Chews</option>
              </select>

            </div>

          </div>

          {/* Active Counts & Stock Switch */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div>
              Showing <strong>{sorted.length}</strong> of <strong>{products.length}</strong> authentic products
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#C8102E] rounded cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sorted.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-black font-heading text-slate-800">No Matching Products Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, clearing length filters, or exploring all product categories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLength('all');
                setInStockOnly(false);
              }}
              className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sorted.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuote={handleOpenQuote}
              />
            ))}
          </div>
        )}

      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        productName={selectedProductForQuote}
      />
    </div>
  );
}
