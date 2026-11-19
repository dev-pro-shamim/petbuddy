'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import QuoteModal from '@/components/QuoteModal';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Star, 
  Award, 
  Heart,
  ChevronRight,
  Store,
  Check,
  Flame,
  Clock,
  Bone,
  Truck,
  Building2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Instagram
} from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cms, setCms] = useState<any>({
    hero: {
      badge: "🇨🇦 Canadian Owned & Operated • 100% Pure Natural",
      titleLine1: "Pure Pet Treats &",
      titleHighlight: "Natural Bully Sticks",
      subtitle: "Single-ingredient, grass-fed beef pizzle oven-roasted to perfection. Calibrated in 6-inch & 12-inch cuts for safe chewing, cleaner canine teeth, and happier dogs.",
      ctaQuote: "Get a Wholesale Quote",
      ctaAmazon: "Shop on Amazon Canada 🇨🇦"
    },
    amazonUrl: "https://www.amazon.ca/dp/B0H637LFT4/?th=1",
    email: "infor@pet-buddy.net"
  });

  const [activeTab, setActiveTab] = useState<'all' | 'bully-sticks' | 'chews-bones' | 'treats'>('all');
  const [selectedBreedSize, setSelectedBreedSize] = useState<'small' | 'medium' | 'large' | 'power'>('small');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState('Pet Buddy Extra Thick Bully Sticks (6-Inch)');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});

    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data && data.hero) setCms(data);
      })
      .catch(() => {});
  }, []);

  const handleOpenQuote = (prodName?: string) => {
    if (prodName) setSelectedProductForQuote(prodName);
    setQuoteModalOpen(true);
  };

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeTab);

  const homeFaqs = [
    {
      q: "Why do you only craft 6-Inch and 12-Inch bully sticks?",
      a: "Standardizing strictly to 6-inch and 12-inch lengths ensures that each stick maintains adequate density to prevent small splintering or choking hazards. 6-inch sticks are ideal for small to medium dogs, while 12-inch jumbo sticks provide the safe endurance large breeds need."
    },
    {
      q: "Where can retail customers buy individual packs?",
      a: "Individual pet parents can purchase directly from our official Amazon Canada store with Prime fast free shipping at https://www.amazon.ca/dp/B0H637LFT4/?th=1."
    },
    {
      q: "How does wholesale pricing and ordering work for pet retailers?",
      a: "We work directly with independent pet boutiques, grooming salons, and veterinary clinics. Click 'Get a Bulk Quote' or email infor@pet-buddy.net to receive our case tiered wholesale catalog. Minimum orders start at just 1 master case with free Canadian freight available."
    },
    {
      q: "How are Pet Buddy bully sticks different from commercial rawhide?",
      a: "Commercial rawhide is made from chemical-leached cattle hides bleached with peroxide and held together with glue. Pet Buddy bully sticks are 100% single-ingredient grass-fed beef pizzle that is 100% digestible, grain-free, and breaks down completely in your dog's stomach."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 selection:bg-[#C8102E] selection:text-white">
      <Header onOpenQuote={() => handleOpenQuote()} />

      <main className="flex-1">
        
        {/* ================================================================ */}
        {/* HERO SECTION: CLEAN, WARM CANADIAN NATURE PALETTE */}
        {/* ================================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#062419] via-[#0E3524] to-[#1E1410] text-white py-16 sm:py-24 lg:py-28">
          
          {/* Subtle Ambient Background Glows */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headlines & Actions (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Floating pill badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{cms.hero.badge}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading leading-tight tracking-tight">
                  <span>{cms.hero.titleLine1} </span>
                  <span className="bg-gradient-to-r from-[#FF5C7A] via-[#FBBF24] to-[#FF9900] bg-clip-text text-transparent">
                    {cms.hero.titleHighlight}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                  {cms.hero.subtitle}
                </p>

                {/* Length highlight alert */}
                <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs">
                  <span className="bg-black/30 backdrop-blur-md border border-white/15 text-white font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                    <span>📏</span> Calibrated <strong>6-Inch</strong> &amp; <strong>12-Inch</strong> Only
                  </span>
                  <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                    <span>🌿</span> 100% Grass-Fed Beef
                  </span>
                  <span className="bg-red-500/20 border border-red-400/30 text-red-300 font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                    <span>🚫</span> Rawhide &amp; Bleach Free
                  </span>
                </div>

                {/* Action Buttons: Amazon Canada & Bulk Quote */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
                  <a
                    href={cms.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#FF9900] hover:bg-[#E88B00] text-slate-950 px-8 py-4 rounded-full font-black text-sm transition-all shadow-xl hover:shadow-amber-500/25 flex items-center justify-center gap-2">
                    <span>{cms.hero.ctaAmazon}</span>
                    <ExternalLink className="w-4 h-4 text-slate-900" />
                  </a>

                  <button
                    onClick={() => handleOpenQuote()}
                    className="w-full sm:w-auto bg-[#C8102E] hover:bg-[#A60D24] text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider shadow-xl hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 group">
                    <span>{cms.hero.ctaQuote}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Trust stats row */}
                <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white font-heading">100%</div>
                    <div className="text-[11px] text-slate-300 font-medium">Single Ingredient</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-heading">6" &amp; 12"</div>
                    <div className="text-[11px] text-slate-300 font-medium">Exact Length Cuts</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">Toronto</div>
                    <div className="text-[11px] text-slate-300 font-medium">Canadian Owned</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Hero Visual Product Display (5 Cols) */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md">
                  
                  {/* Glowing Backplate */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-amber-500/20 rounded-3xl filter blur-2xl transform rotate-3" />

                  {/* Main Product Showcase Card */}
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl text-center">
                    <img
                      src="/assets/images/products/pet-buddy-6in-6pk-cross.jpg"
                      alt="Pet Buddy Bully Sticks Packaging"
                      className="w-full h-80 object-contain drop-shadow-2xl mx-auto transform hover:scale-105 transition-transform duration-500"
                    />

                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-left">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Official Packaging</span>
                        <h4 className="text-sm font-black text-white font-heading">Pet Buddy Extra Thick Bully Sticks</h4>
                        <span className="text-xs text-slate-300">Canadian Owned &amp; Operated</span>
                      </div>
                      <button
                        onClick={() => handleOpenQuote("Pet Buddy Extra Thick Bully Sticks (6-Inch)")}
                        className="bg-[#C8102E] hover:bg-[#A60D24] text-white text-[11px] font-black px-4 py-2 rounded-full transition-all shadow">
                        Quote Case
                      </button>
                    </div>
                  </div>

                  {/* Floating Trust Pills */}
                  <div className="absolute -top-3 -right-3 bg-white text-slate-900 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-black animate-bounce duration-1000">
                    <Award className="w-4 h-4 text-[#C8102E]" />
                    <span>Amazon Prime Canada 🇨🇦</span>
                  </div>

                  <div className="absolute -bottom-3 -left-3 bg-[#0C3823] text-white border border-emerald-700/60 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% Digestible &bull; No Bleach</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* NEW SECTION 1: INTERACTIVE "SHOP BY DOG SIZE & CHEW STYLE" */}
        {/* ================================================================ */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider bg-red-100/60 px-3.5 py-1 rounded-full">
                Precision Chew Sizing
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mt-2">
                Find the Perfect Chew for Your Dog's Size
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Every dog chews differently. Match your dog's weight and jaw strength to the certified Pet Buddy cut.
              </p>
            </div>

            {/* 4 Interactive Breed Sizing Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Small Breeds */}
              <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200 hover:border-[#0C3823] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-black">
                    🐶
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Under 20 lbs</span>
                    <h3 className="text-lg font-heading font-black text-slate-900 mt-0.5">Small Breeds &amp; Pups</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Frenchies, Pugs, Dachshunds, Toy Poodles</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[#C8102E]">Recommended Cut:</div>
                    <div className="font-black text-slate-900">6-Inch Slender Bully Sticks</div>
                    <div className="text-[10px] text-slate-500">Gentle jaw workout, easy on young puppy teeth.</div>
                  </div>
                </div>
                <Link
                  href="/shop?length=6-Inch"
                  className="mt-5 w-full bg-[#0C3823] hover:bg-[#072417] text-white py-2.5 rounded-full text-xs font-bold text-center block transition-all">
                  View 6" Options &rarr;
                </Link>
              </div>

              {/* Card 2: Medium Breeds */}
              <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200 hover:border-[#0C3823] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-black">
                    🐕
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">20 – 50 lbs</span>
                    <h3 className="text-lg font-heading font-black text-slate-900 mt-0.5">Medium Dogs</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Beagles, Corgis, Spaniels, Aussies</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[#C8102E]">Recommended Cut:</div>
                    <div className="font-black text-slate-900">6-Inch Extra Thick Bully Sticks</div>
                    <div className="text-[10px] text-slate-500">20-35 min rewarding chew session, scrapes plaque.</div>
                  </div>
                </div>
                <Link
                  href="/shop?length=6-Inch"
                  className="mt-5 w-full bg-[#0C3823] hover:bg-[#072417] text-white py-2.5 rounded-full text-xs font-bold text-center block transition-all">
                  View 6" Options &rarr;
                </Link>
              </div>

              {/* Card 3: Large Dogs */}
              <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200 hover:border-[#C8102E] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#C8102E] flex items-center justify-center text-2xl font-black">
                    🦮
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">50 – 85 lbs</span>
                    <h3 className="text-lg font-heading font-black text-slate-900 mt-0.5">Large Breeds</h3>
                    <p className="text-[11px] text-slate-500 mt-1">Golden Retrievers, Labs, Boxers, Dobermans</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[#C8102E]">Recommended Cut:</div>
                    <div className="font-black text-slate-900">12-Inch Jumbo Bully Sticks</div>
                    <div className="text-[10px] text-slate-500">Double duration, substantial thickness for big jaws.</div>
                  </div>
                </div>
                <Link
                  href="/shop?length=12-Inch"
                  className="mt-5 w-full bg-[#C8102E] hover:bg-[#A60D24] text-white py-2.5 rounded-full text-xs font-bold text-center block transition-all">
                  View 12" Jumbo &rarr;
                </Link>
              </div>

              {/* Card 4: Power Chewers */}
              <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200 hover:border-[#0C3823] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center text-2xl font-black">
                    🐺
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">85+ lbs / Extreme</span>
                    <h3 className="text-lg font-heading font-black text-slate-900 mt-0.5">Power Chewers</h3>
                    <p className="text-[11px] text-slate-500 mt-1">German Shepherds, Rottweilers, Mastiffs</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                    <div className="font-bold text-[#C8102E]">Recommended Cut:</div>
                    <div className="font-black text-slate-900">Smoked Femur Bone XL &amp; 12" Sticks</div>
                    <div className="text-[10px] text-slate-500">Massive real bone marrow with enduring density.</div>
                  </div>
                </div>
                <Link
                  href="/shop?cat=chews-bones"
                  className="mt-5 w-full bg-[#0C3823] hover:bg-[#072417] text-white py-2.5 rounded-full text-xs font-bold text-center block transition-all">
                  View Bones &amp; Chews &rarr;
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* NEW SECTION 2: THE 4-STAGE PET BUDDY PURITY PROCESS */}
        {/* ================================================================ */}
        <section className="py-16 bg-gradient-to-b from-white to-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider bg-red-100/60 px-3.5 py-1 rounded-full">
                Zero Compromise Standard
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mt-2">
                The Pet Buddy Purity Journey
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                How our single-ingredient beef pizzle moves from ethically raised cattle to your dog's mouth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#0C3823] text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-heading font-black text-base text-slate-900">100% Free-Range Cattle</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ethically raised on open pastures with natural grass diets. Zero hormone injections, zero antibiotics, and zero commercial grain feed.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#0C3823] text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-heading font-black text-base text-slate-900">Zero Chemical Baths</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  While regular commercial rawhides are bleached in chlorine and hydrogen peroxide, Pet Buddy chews are cleaned with pure filtered water.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#0C3823] text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="font-heading font-black text-base text-slate-900">Low-Temp Oven Roasted</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Slow cured over 72 hours at gentle heat to lock in savory beef aroma while curing density to maximize chewing longevity and dental scraping.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#C8102E] text-white font-black text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-heading font-black text-base text-slate-900">Strict Sizing &amp; Sealing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every stick is laser-inspected and cut to exact 6-inch and 12-inch sizes. Vacuum packed immediately in resealable pouches to preserve freshness.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* LENGTH SHOWCASE: 6-INCH VS 12-INCH BANNER */}
        {/* ================================================================ */}
        <section className="py-16 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider bg-red-100/60 px-3 py-1 rounded-full">
                Strict Quality Standards
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mt-2">
                Bully Sticks in 6-Inch &amp; 12-Inch
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                We craft only two certified lengths to guarantee consistent chew density, choking prevention, and uniform chew satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Card 1: 6-Inch Bully Sticks */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      Daily Chew Choice
                    </span>
                    <span className="text-xs font-bold text-slate-500">📏 6-Inch Exact Cut</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                    6-Inch Bully Sticks
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Designed for small to medium dogs, puppies over 12 weeks, and moderate chewers. Perfectly calibrated for 20–40 minute rewarding daily chew sessions.
                  </p>

                  <div className="space-y-2 pt-2 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Available in 6-Pack, 12-Pack, and Bulk Wholesale cases</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Gentle on puppy digestion and sensitive dog stomachs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Available on Amazon Canada Prime with next-day shipping</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Pricing Policy</span>
                    <span className="text-sm font-heading font-black text-[#C8102E]">Wholesale Case Tiers</span>
                  </div>
                  <Link
                    href="/shop?length=6-Inch"
                    className="bg-[#0C3823] hover:bg-[#072417] text-white font-black px-6 py-3 rounded-full text-xs transition-all flex items-center gap-2 shadow">
                    <span>Shop 6-Inch Sticks</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Card 2: 12-Inch Jumbo Bully Sticks */}
              <div className="bg-gradient-to-br from-[#0C3823] to-[#051C12] text-white rounded-3xl p-8 border border-emerald-900 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#FF9900] text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      Aggressive &amp; Large Dogs
                    </span>
                    <span className="text-xs font-bold text-emerald-300">📏 12-Inch Jumbo Cut</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-heading font-black">
                    12-Inch Jumbo Bully Sticks
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Heavyweight endurance chews for Labs, German Shepherds, Golden Retrievers, and powerhouse chewers who finish smaller treats in minutes.
                  </p>

                  <div className="space-y-2 pt-2 text-xs font-medium text-emerald-100">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Double the chewing duration for persistent chewers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Heavyweight calibrated thickness resists splintering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>High-demand item for veterinary clinics and pet boutiques</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-emerald-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Pricing Policy</span>
                    <span className="text-sm font-heading font-black text-[#FF9900]">Wholesale Case Tiers</span>
                  </div>
                  <Link
                    href="/shop?length=12-Inch"
                    className="bg-[#C8102E] hover:bg-[#A60D24] text-white font-black px-6 py-3 rounded-full text-xs transition-all flex items-center gap-2 shadow-lg">
                    <span>Shop 12-Inch Jumbo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* BEST SELLERS & DYNAMIC CATALOG SECTION */}
        {/* ================================================================ */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header and Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
              <div>
                <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider">
                  The Official Pet Buddy Collection
                </span>
                <h2 className="text-3xl font-heading font-black text-slate-900 mt-1">
                  Featured Products &amp; Best Sellers
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  100% natural, odor-controlled, and single-ingredient canine chews.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#0C3823] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                  All ({products.length})
                </button>
                <button
                  onClick={() => setActiveTab('bully-sticks')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'bully-sticks'
                      ? 'bg-[#C8102E] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                  Bully Sticks (6" &amp; 12")
                </button>
                <button
                  onClick={() => setActiveTab('chews-bones')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'chews-bones'
                      ? 'bg-[#C8102E] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                  Bones &amp; Chews
                </button>
                <button
                  onClick={() => setActiveTab('treats')}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'treats'
                      ? 'bg-[#C8102E] text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}>
                  Natural Treats
                </button>
              </div>
            </div>

            {/* Product Cards Grid (Prices Hidden) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuote={handleOpenQuote}
                />
              ))}
            </div>

            {/* View Full Catalog Link */}
            <div className="mt-12 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#FAF8F5] hover:bg-slate-100 border border-slate-300 text-slate-900 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all">
                <span>View Full 14 Product Catalog</span>
                <ArrowRight className="w-4 h-4 text-[#C8102E]" />
              </Link>
            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* NEW SECTION 3: RETAILER & CLINIC WHOLESALE ADVANTAGE */}
        {/* ================================================================ */}
        <section className="py-16 bg-[#FAF8F5] border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="bg-gradient-to-r from-[#0C3823] via-[#0F172A] to-[#6B0D1B] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
              <div className="max-w-3xl space-y-4">
                <span className="bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full inline-block">
                  B2B Distribution Program
                </span>
                <h2 className="text-3xl sm:text-4xl font-heading font-black">
                  Why Canadian Pet Retailers &amp; Clinics Stock Pet Buddy
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Consumable, healthy treats build repeat foot traffic. We partner with independent pet shops, grooming spas, and veterinary hospitals with exclusive wholesale advantages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-2xl">📈</div>
                  <h4 className="font-heading font-black text-sm text-white">Up to 55% Retail Margin</h4>
                  <p className="text-xs text-slate-300">High-yield consumables that generate strong repeat customer lifetime value.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-2xl">📦</div>
                  <h4 className="font-heading font-black text-sm text-white">Low 1-Case Minimums</h4>
                  <p className="text-xs text-slate-300">Test new lengths without tying up tens of thousands in warehouse inventory.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-2xl">🚚</div>
                  <h4 className="font-heading font-black text-sm text-white">Reliable Canadian Freight</h4>
                  <p className="text-xs text-slate-300">Direct courier and pallet dispatch from our Toronto, Ontario distribution facility.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
                  <div className="text-2xl">🏷️</div>
                  <h4 className="font-heading font-black text-sm text-white">POP Merchandising Kits</h4>
                  <p className="text-xs text-slate-300">Free shelf talkers, counter displays, and sample packets included with master orders.</p>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300">
                  Ready to add Pet Buddy to your shelves? Inquire with our wholesale team today.
                </div>
                <button
                  onClick={() => handleOpenQuote()}
                  className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>Request Wholesale Tiers</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* THE HONEST TRUTH: PET BUDDY VS COMMERCIAL RAWHIDE */}
        {/* ================================================================ */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider bg-red-100/60 px-3 py-1 rounded-full">
                Canine Health Comparison
              </span>
              <h2 className="text-3xl font-heading font-black text-slate-900 mt-2">
                The Honest Truth About What Dogs Chew
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Why veterinarians and pet care specialists across Canada recommend Pet Buddy bully sticks over cheap commercial rawhide.
              </p>
            </div>

            <div className="bg-[#FAF8F5] rounded-3xl border border-slate-200 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#0C3823] text-white font-heading font-black uppercase text-[11px] tracking-wider">
                      <th className="py-4 px-6">Quality Factor</th>
                      <th className="py-4 px-6 bg-[#C8102E] text-white">Pet Buddy Natural Chews 🍁</th>
                      <th className="py-4 px-6 text-slate-300">Standard Commercial Rawhide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 font-medium">
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">Ingredients</td>
                      <td className="py-4 px-6 font-bold text-emerald-800 bg-emerald-50/50">✓ 100% Single Ingredient Grass-Fed Beef</td>
                      <td className="py-4 px-6 text-red-600">✕ Chemical leached animal hides &amp; glue</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">Digestibility</td>
                      <td className="py-4 px-6 font-bold text-emerald-800 bg-emerald-50/50">✓ 100% Digestible (Gentle on Canine Gut)</td>
                      <td className="py-4 px-6 text-red-600">✕ Severe intestinal obstruction risk</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">Processing &amp; Bleach</td>
                      <td className="py-4 px-6 font-bold text-emerald-800 bg-emerald-50/50">✓ Slow Oven-Roasted, Never Bleached</td>
                      <td className="py-4 px-6 text-red-600">✕ Treated with hydrogen peroxide &amp; chlorine</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">Dental Health</td>
                      <td className="py-4 px-6 font-bold text-emerald-800 bg-emerald-50/50">✓ Scrapes Tartar &amp; Stimulates Healthy Gums</td>
                      <td className="py-4 px-6 text-slate-500">Gummy residues can stick between teeth</td>
                    </tr>
                    <tr className="hover:bg-white transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">Length Standards</td>
                      <td className="py-4 px-6 font-bold text-emerald-800 bg-emerald-50/50">✓ Strict 6-Inch &amp; 12-Inch Calibrated Cuts</td>
                      <td className="py-4 px-6 text-slate-500">Inconsistent shreds &amp; choking fragments</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* NEW SECTION 4: COMMUNITY SOCIAL PROOF GALLERY */}
        {/* ================================================================ */}
        <section className="py-16 bg-[#FAF8F5] border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Instagram className="w-4 h-4" />
                  <span>#PetBuddyPack</span>
                </span>
                <h2 className="text-3xl font-heading font-black text-slate-900 mt-1">
                  Happy Dogs Chewing Across Canada
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real Canadian dogs enjoying their certified 6-inch and 12-inch natural bully sticks.
                </p>
              </div>

              <a
                href={cms.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1">
                <span>View Amazon Verified Reviews &rarr;</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="h-48 rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-50 flex items-center justify-center text-5xl overflow-hidden p-2">
                  🦮
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">Cooper (Golden Retriever)</span>
                    <span className="text-[10px] bg-red-100 text-[#C8102E] px-2 py-0.5 rounded font-bold">12" Jumbo</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Toronto, Ontario</div>
                  <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                    "Cooper loves his evening chew routine. Lasts almost an hour and keeps his breath remarkably fresh!"
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="h-48 rounded-2xl bg-gradient-to-tr from-red-100 to-rose-50 flex items-center justify-center text-5xl overflow-hidden p-2">
                  🐶
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">Bella (French Bulldog)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">6" Standard</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Montreal, Quebec</div>
                  <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                    "Zero digestive issues! Other treats upset her stomach, but Pet Buddy 6-inch sticks are 100% gentle."
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="h-48 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center text-5xl overflow-hidden p-2">
                  🐕
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">Luna (Siberian Husky)</span>
                    <span className="text-[10px] bg-red-100 text-[#C8102E] px-2 py-0.5 rounded font-bold">12" Jumbo</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Calgary, Alberta</div>
                  <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                    "Endurance chews that satisfy her high energy. We buy the 12-pack pouches regularly from Amazon."
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="h-48 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center text-5xl overflow-hidden p-2">
                  🐺
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-900">Diesel (Rottweiler)</span>
                    <span className="text-[10px] bg-slate-900 text-amber-400 px-2 py-0.5 rounded font-bold">Smoked Bone</span>
                  </div>
                  <div className="text-[11px] text-slate-400">Vancouver, BC</div>
                  <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                    "The XL smoked femur bone is the only chew that survives his powerful jaw. High quality marrow!"
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* NEW SECTION 5: HOMEPAGE FREQUENTLY ASKED QUESTIONS */}
        {/* ================================================================ */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="text-center space-y-2">
              <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider bg-red-100/60 px-3.5 py-1 rounded-full">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl font-heading font-black text-slate-900">
                Got Questions? We Have Answers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Everything you need to know about our grass-fed chews, length safety, and wholesale case orders.
              </p>
            </div>

            <div className="space-y-3">
              {homeFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="bg-[#FAF8F5] rounded-2xl border border-slate-200 overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-black text-slate-900 text-sm hover:text-[#C8102E] transition-colors">
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#C8102E] flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <Link
                href="/faq"
                className="text-xs font-bold text-[#C8102E] hover:underline">
                View All Knowledge Base FAQs &rarr;
              </Link>
            </div>

          </div>
        </section>

        {/* ================================================================ */}
        {/* NEWSLETTER SUBSCRIPTION */}
        {/* ================================================================ */}
        <section className="py-14 bg-[#FAF8F5] border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-[#C8102E] text-xs font-black uppercase tracking-wider">
              Exclusive Canadian Pet Perks
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
              Join the Pet Buddy Pack
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Subscribe for new batch release announcements, veterinary chew tips, and exclusive wholesale discount codes.
            </p>

            {newsletterSubmitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-xs font-bold max-w-md mx-auto">
                🎉 Welcome to the pack! Check your inbox for our welcome voucher.
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setNewsletterSubmitted(true);
                }} 
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-full px-5 py-3 text-xs focus:outline-none focus:border-[#C8102E]"
                />
                <button
                  type="submit"
                  className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-7 py-3 rounded-full font-black text-xs uppercase tracking-wider shadow-md transition-all">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>

      </main>

      <Footer />

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        productName={selectedProductForQuote}
      />
    </div>
  );
}
