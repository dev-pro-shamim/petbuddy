'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, ShieldCheck, Heart, Sparkles, MapPin, ExternalLink } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#C8102E] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[#F59E0B] text-xs font-black uppercase tracking-wider">
            Canadian Heritage &bull; Pure Pet Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-black">
            The Pet Buddy Story
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Founded with a singular mission: to eliminate dangerous, bleached commercial rawhide and provide Canadian dogs with 100% pure, grass-fed natural chews.
          </p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <span className="text-[#C8102E] font-black uppercase tracking-wider text-xs">
              Where It Began
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 leading-tight">
              A Dog's Happiness Begins With Honest Ingredients
            </h2>
            <p>
              When pet owners walk down the supermarket treat aisle, they are too often met with imported rawhide soaked in bleach, held together with synthetic adhesives, and stuffed with artificial colors.
            </p>
            <p>
              At <strong>Pet Buddy Imports Inc.</strong>, we set out to change this standard. Located in Toronto, Ontario, we partner with ethically managed free-range cattle ranches to source 100% natural, grass-fed beef pizzle.
            </p>
            <p>
              Every chew is hand-inspected, cut to strict <strong>6-inch and 12-inch lengths</strong>, and slow oven-roasted to seal in real beef aroma without any chemical preservatives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl text-center space-y-4">
            <img
              src="/assets/images/products/pet-buddy-6in-6pk-standing.jpg"
              alt="Pet Buddy Bully Sticks"
              className="w-full h-72 object-contain mx-auto"
            />
            <div className="text-xs font-bold text-slate-800">
              Handcrafted in Toronto &bull; Distributed Nationwide
            </div>
          </div>
        </div>

        {/* 3 Core Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#C8102E] flex items-center justify-center text-2xl font-black">
              🥩
            </div>
            <h3 className="font-heading font-black text-base text-slate-900">Zero Rawhide Ever</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never use animal leather scraps or chemical baths. Our chews are 100% digestible and break down naturally in your dog's stomach.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-black">
              📏
            </div>
            <h3 className="font-heading font-black text-base text-slate-900">6" &amp; 12" Precision</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              By offering strictly two calibrated lengths, we eliminate odd-shaped shards and ensure uniform chew satisfaction for all sizes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black">
              🍁
            </div>
            <h3 className="font-heading font-black text-base text-slate-900">Canadian Ownership</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Proudly Canadian owned and operated from 4 Alrita Cres, Toronto, ON. Serving pet parents and retailers with uncompromising integrity.
            </p>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
