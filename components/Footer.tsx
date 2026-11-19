'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [cmsData, setCmsData] = useState<any>({
    amazonUrl: "https://www.amazon.ca/dp/B0H637LFT4/?th=1",
    email: "infor@pet-buddy.net",
    phone: "+1 (306) 260-4467",
    address: "4 Alrita Cres, Toronto, ON, M1R 4M3, Canada"
  });

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data && data.email) setCmsData(data);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img 
                src="/assets/images/pet-buddy-logo.png" 
                alt="Pet Buddy" 
                className="h-16 w-auto object-contain bg-white rounded-2xl p-2 shadow-lg" 
              />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Pet Buddy Imports Inc. is a Canadian-owned dog chew provider specializing in 100% single-ingredient grass-fed beef pizzle and bones. Handcrafted exclusively in 6-inch and 12-inch lengths.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 px-3 py-1 rounded-full text-[11px] font-bold">
                🍁 Canadian Owned &amp; Operated &bull; Toronto, ON
              </span>
            </div>
          </div>

          {/* Col 2: Shop & Lengths */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">
              Catalog Lengths
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/shop?length=6-Inch" className="hover:text-white transition-colors">6-Inch Bully Sticks (Small &amp; Med)</Link></li>
              <li><Link href="/shop?length=12-Inch" className="hover:text-white transition-colors">12-Inch Jumbo Sticks (Large Breeds)</Link></li>
              <li><Link href="/shop?cat=chews-bones" className="hover:text-white transition-colors">Smoked Femur Bones &amp; Chews</Link></li>
              <li><Link href="/shop?cat=treats" className="hover:text-white transition-colors">All-Natural Treats</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors font-bold text-red-400">View Full Catalog &rarr;</Link></li>
            </ul>
          </div>

          {/* Col 3: Company & Information */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">
              Company &amp; Help
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story &amp; Values</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Help &amp; FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li>
                <a 
                  href={cmsData.amazonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-400 hover:text-white font-bold flex items-center gap-1">
                  <span>Amazon Canada Store 🇨🇦</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Wholesale & Operations Contact */}
          <div className="space-y-3">
            <h4 className="font-heading font-black text-white text-sm uppercase tracking-wider">
              Wholesale Desk
            </h4>
            <div className="space-y-2.5 text-slate-400">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Official Webmail</div>
                  <a href={`mailto:${cmsData.email}`} className="text-white hover:underline font-medium">
                    {cmsData.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Phone Support</div>
                  <div className="text-white font-medium">{cmsData.phone}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Head Office</div>
                  <div className="text-xs text-slate-300 leading-snug">{cmsData.address}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Pet Buddy Imports Inc. All rights reserved. Registered in Canada.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>100% Rawhide-Free • Single Ingredient Grass-Fed Beef</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
