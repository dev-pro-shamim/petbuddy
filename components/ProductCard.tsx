'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, ShoppingBag, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface Product {
  id: number;
  name: string;
  category: string;
  length?: string;
  badge?: string;
  price?: number;
  salePrice?: number | null;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  ingredients?: string;
  amazonUrl?: string;
  inStock?: boolean;
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  onOpenQuote: (productName: string) => void;
}

export default function ProductCard({ product, onOpenQuote }: ProductCardProps) {
  const amazonStore = product.amazonUrl || 'https://www.amazon.ca/dp/B0H637LFT4/?th=1';
  const isOutOfStock = product.inStock === false;

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      
      {/* Top Badges & Length Tag */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {product.length && (
          <span className="bg-[#0C3823]/90 backdrop-blur-sm text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md">
            📏 {product.length}
          </span>
        )}

        {product.badge ? (
          <span className="bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ml-auto">
            {product.badge}
          </span>
        ) : isOutOfStock ? (
          <span className="bg-red-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md ml-auto">
            Sold Out
          </span>
        ) : null}
      </div>

      {/* Product Image Box */}
      <Link href={`/product/${product.id}`} className="relative block p-6 bg-gradient-to-b from-slate-50/80 to-white overflow-hidden aspect-square flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/images/products/pet-buddy-6in-6pk-cross.jpg';
          }}
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
      </Link>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs mb-1.5">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="font-black text-slate-800 text-[11px]">{product.rating || 5.0}</span>
            <span className="text-slate-400 text-[10px]">({product.reviews || 40}+ Reviews)</span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-heading font-black text-sm text-slate-900 group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Wholesale Tiers Info (Price Hidden as Requested) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-[#C8102E] uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bulk Case Pricing</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Wholesale Tiers on Request
            </span>
          </div>

          <Link 
            href={`/product/${product.id}`} 
            className="text-xs font-bold text-slate-600 hover:text-[#C8102E] flex items-center gap-0.5 transition-colors">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dual Actions: Primary Bulk Quote & Amazon Canada */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => onOpenQuote(product.name)}
            disabled={isOutOfStock}
            className="w-full bg-[#C8102E] hover:bg-[#A60D24] text-white py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50">
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>Get a Bulk Quote</span>
          </button>

          <a
            href={amazonStore}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FF9900]/15 hover:bg-[#FF9900]/25 text-slate-900 py-2 px-3 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 border border-[#FF9900]/40">
            <span>Buy on Amazon Canada 🇨🇦</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </a>
        </div>

      </div>

    </div>
  );
}
