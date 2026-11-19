'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import QuoteModal from '@/components/QuoteModal';
import { 
  Star, 
  ShieldCheck, 
  CheckCircle, 
  ExternalLink, 
  ShoppingBag, 
  ArrowLeft, 
  Truck, 
  Award,
  Bone,
  Package,
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'feeding' | 'wholesale'>('desc');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRelatedProducts(data.filter(p => String(p.id) !== params.id).slice(0, 4));
        }
      })
      .catch(() => {});
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="text-xs font-bold text-slate-500">Loading Product Details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="text-5xl">📦</div>
          <h2 className="text-2xl font-black font-heading text-slate-900">Product Not Found</h2>
          <p className="text-xs text-slate-500">This product could not be located in our catalog.</p>
          <Link
            href="/shop"
            className="inline-block bg-[#C8102E] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const amazonStore = product.amazonUrl || 'https://www.amazon.ca/dp/B0H637LFT4/?th=1';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header onOpenQuote={() => setQuoteModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-slate-900">Shop Catalog</Link>
          <span>/</span>
          <span className="font-bold text-slate-900 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
          
          {/* Left Column: Product Image (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative bg-gradient-to-b from-slate-50 to-white rounded-3xl p-8 border border-slate-100 flex items-center justify-center overflow-hidden aspect-square">
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#C8102E] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                  {product.badge}
                </span>
              )}
              {product.length && (
                <span className="absolute top-4 right-4 bg-[#0C3823] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10">
                  📏 {product.length}
                </span>
              )}

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain max-h-[420px] drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/products/pet-buddy-6in-6pk-cross.jpg';
                }}
              />
            </div>

            {/* Trust highlights below image */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[11px]">
              <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-slate-200 font-bold text-slate-700">
                🌿 100% Grass-Fed
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-slate-200 font-bold text-slate-700">
                🍁 Canadian Owned
              </div>
              <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-slate-200 font-bold text-slate-700">
                🚫 Rawhide Free
              </div>
            </div>
          </div>

          {/* Right Column: Wholesale Pricing & Purchasing Paths (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-[#C8102E] px-2.5 py-1 rounded-full">
                  {product.category === 'bully-sticks' ? 'Bully Sticks (6" & 12")' : product.category === 'chews-bones' ? 'Bones & Chews' : 'Natural Dog Treats'}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-black text-slate-800">{product.rating || 5.0}</span>
                  <span className="text-slate-400">({product.reviews || 45} Reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Wholesale Pricing Banner (Price Hidden as Requested) */}
              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase font-black tracking-wider block">Pricing Policy</span>
                  <div className="text-lg font-heading font-black text-[#C8102E] mt-0.5">
                    Wholesale Volume Tiers
                  </div>
                  <span className="text-xs text-slate-500">Available by Master Case &amp; Pallet</span>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    ● In Stock for Bulk Dispatch
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Direct from Toronto, ON</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Length Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <span className="font-bold text-slate-900">Length Specification:</span>
                <span className="bg-[#0C3823] text-white px-2.5 py-0.5 rounded font-black text-[11px]">
                  {product.length || 'Standard Cut'}
                </span>
                <span className="text-slate-400 text-[11px]">(Strictly 6-Inch &amp; 12-Inch Standards)</span>
              </div>

            </div>

            {/* Purchasing Options */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              
              {/* Option 1: B2B Wholesale Quote */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-white border border-red-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-heading font-black text-xs text-[#C8102E] uppercase tracking-wider">
                    🏢 For Pet Retailers &amp; Veterinary Clinics
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Direct Case Pricing
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Request custom case quotes, distributor pricing tiers, and mixed master shipments.
                </p>
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full bg-[#C8102E] hover:bg-[#A60D24] text-white py-3 px-4 rounded-full font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Get a Bulk Quote for this Product</span>
                </button>
              </div>

              {/* Option 2: Individual Retail on Amazon Canada */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-heading font-black text-xs text-slate-900 uppercase tracking-wider">
                    🛍️ Individual Pet Parents (Single Packs)
                  </div>
                  <span className="text-[10px] text-slate-700 font-bold bg-amber-100 px-2 py-0.5 rounded">
                    Prime Fast Shipping 🇨🇦
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Order individual packs directly through our official Amazon Canada Prime store.
                </p>
                <a
                  href={amazonStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FF9900] hover:bg-[#E88B00] text-slate-950 py-3 px-4 rounded-full font-black text-xs transition-all shadow-md flex items-center justify-center gap-2">
                  <span>Buy on Amazon Canada 🇨🇦</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* Detailed Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'desc'
                  ? 'bg-[#0C3823] text-white shadow'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}>
              Chewing Benefits &amp; Quality
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'ingredients'
                  ? 'bg-[#0C3823] text-white shadow'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}>
              100% Single Ingredients
            </button>
            <button
              onClick={() => setActiveTab('feeding')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'feeding'
                  ? 'bg-[#0C3823] text-white shadow'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}>
              Feeding &amp; Safety Guidelines
            </button>
            <button
              onClick={() => setActiveTab('wholesale')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'wholesale'
                  ? 'bg-[#0C3823] text-white shadow'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}>
              Wholesale &amp; Freight Details
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <h3 className="font-heading font-black text-base text-slate-900">Why Dogs Love Pet Buddy Bully Sticks</h3>
                <p>
                  Unlike artificial pressed chew toys or heavily bleached commercial rawhide, Pet Buddy bully sticks are made from pure, grass-fed beef pizzle. Slow oven-roasting locks in the rich beef essence while curing the chew to optimal density.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">🦷 Canine Dental Hygiene</div>
                    <p className="text-xs text-slate-500">The fibrous chewing action scrubs against canine teeth, helping to scrape off tartar and plaque deposits safely.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200">
                    <div className="font-bold text-slate-900 mb-1">🧠 Mental Stimulation</div>
                    <p className="text-xs text-slate-500">Long-lasting chewing releases natural endorphins in dogs, reducing boredom and destructive separation anxiety.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h3 className="font-heading font-black text-base text-slate-900">Single-Ingredient Guarantee</h3>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-900 font-bold text-xs">
                  {product.ingredients || '100% Pure Natural Grass-Fed Beef Pizzle'}
                </div>
                <p>
                  We believe in complete transparency. Our treats contain zero preservatives, zero artificial flavor enhancers, zero grain, and zero chemicals. 100% natural and safe for sensitive dog stomachs.
                </p>
              </div>
            )}

            {activeTab === 'feeding' && (
              <div className="space-y-3">
                <h3 className="font-heading font-black text-base text-slate-900">Safety &amp; Chew Supervision</h3>
                <p>
                  Always supervise your pet when they are enjoying any chew. Provide plenty of fresh drinking water at all times.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li><strong>Small to Medium Dogs (Under 45 lbs):</strong> Recommended 6-Inch Bully Sticks.</li>
                  <li><strong>Large &amp; Giant Dogs (Over 45 lbs):</strong> Recommended 12-Inch Jumbo Bully Sticks.</li>
                  <li>Discard any small end pieces that could pose a swallowing or choking hazard.</li>
                </ul>
              </div>
            )}

            {activeTab === 'wholesale' && (
              <div className="space-y-3">
                <h3 className="font-heading font-black text-base text-slate-900">Wholesale Terms &amp; Distribution</h3>
                <p>
                  Pet Buddy Imports Inc. is headquartered in Toronto, Ontario. We dispatch direct master cases to independent pet shops, grooming salons, and veterinary clinics.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
                  <div><strong>Email:</strong> infor@pet-buddy.net</div>
                  <div><strong>Phone:</strong> +1 (306) 260-4467</div>
                  <div><strong>Distribution Center:</strong> 4 Alrita Cres, Toronto, ON, M1R 4M3, Canada</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Carousel/Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-black text-slate-900">
                You May Also Like
              </h2>
              <Link href="/shop" className="text-xs font-bold text-[#C8102E] hover:underline">
                View All Products &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpenQuote={() => {
                    setProduct(p);
                    setQuoteModalOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        productName={product.name}
      />
    </div>
  );
}
