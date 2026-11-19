'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, ExternalLink, Phone, Mail } from 'lucide-react';

interface HeaderProps {
  onOpenQuote?: () => void;
}

export default function Header({ onOpenQuote }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const [cmsData, setCmsData] = useState<any>({
    announcement: "🍁 Canadian Owned & Operated | 100% All-Natural Grass-Fed Beef Dog Treats | Buy on Amazon Canada 🇨🇦",
    amazonUrl: "https://www.amazon.ca/dp/B0H637LFT4/?th=1",
    email: "infor@pet-buddy.net",
    phone: "+1 (306) 260-4467"
  });

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data && data.announcement) setCmsData(data);
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: '6" Bully Sticks', href: '/shop?length=6-Inch' },
    { label: '12" Jumbo Sticks', href: '/shop?length=12-Inch' },
    { label: 'Bones & Chews', href: '/shop?cat=chews-bones' },
    { label: 'Dog Treats', href: '/shop?cat=treats' },
    { label: 'Our Story', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      
      {/* 1. TOP ANNOUNCEMENT BAR (Clean, Slim, High-End Forest Green) */}
      <div className="bg-[#0C3823] text-white text-[11px] font-medium py-1.5 px-4 shadow-sm border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="hidden lg:flex items-center gap-2 text-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Toronto, ON &bull; 100% Grass-Fed Single Ingredient</span>
          </div>

          <div className="flex-1 text-center font-bold tracking-wide text-white flex items-center justify-center gap-2 truncate">
            <span>🍁 Canadian Owned &amp; Operated | 100% All-Natural Beef Dog Treats | Amazon Canada 🇨🇦</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-emerald-100 text-[11px]">
            <a href="tel:+13062604467" className="hover:text-white transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>+1 (306) 260-4467</span>
            </a>
            <a
              href={cmsData.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#FF9900] hover:text-white transition-colors font-bold">
              <span>Amazon Prime</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER (Clean White, Single-Line Navigation, Zero Clutter) */}
      <div className={`bg-white/98 backdrop-blur-md transition-all duration-200 border-b border-slate-200/90 ${
        scrolled ? 'py-2 shadow-md' : 'py-3 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 xl:gap-8">
            
            {/* Brand Logo (Crisp, Strictly Constrained Height, Zero Blow-Up) */}
            <Link href="/" className="flex items-center flex-shrink-0 group py-1">
              <img
                src="/assets/images/pet-buddy-logo.png"
                alt="Pet Buddy"
                className="h-10 sm:h-12 w-auto max-h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ height: '48px', maxHeight: '48px', width: 'auto' }}
              />
            </Link>

            {/* Desktop Navigation Links (Strictly whitespace-nowrap, Clean Spacing) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-4 flex-1 justify-center">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={idx}
                    href={link.href}
                    className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${
                      isActive 
                        ? 'text-[#C8102E] bg-red-50/80 font-black' 
                        : 'text-slate-700 hover:text-[#C8102E] hover:bg-slate-50'
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons (Strictly Single-Line, Clean Responsive Pills) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
              
              {/* Expandable Search Input */}
              <div className="relative">
                {searchOpen ? (
                  <form
                    action="/shop"
                    method="GET"
                    className="flex items-center bg-slate-100 rounded-full pl-3 pr-1 py-1 border border-slate-300 animate-in fade-in duration-200">
                    <input
                      type="text"
                      name="q"
                      autoFocus
                      placeholder="Search sticks &amp; chews..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-32 sm:w-40"
                    />
                    <button type="submit" className="p-1 text-slate-600 hover:text-black">
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Search Catalog">
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Buy on Amazon Canada Button (Strictly Single Line) */}
              <a
                href={cmsData.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF9900] hover:bg-[#E88B00] text-slate-950 px-4 py-2.5 rounded-full text-xs font-black shadow-sm hover:shadow transition-all whitespace-nowrap">
                <span>Buy on Amazon 🇨🇦</span>
                <ExternalLink className="w-3 h-3 text-slate-900" />
              </a>

              {/* Bulk Quote Primary CTA (Strictly Single Line) */}
              {onOpenQuote && (
                <button
                  onClick={onOpenQuote}
                  className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-4 sm:px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap group">
                  <ShoppingBag className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Bulk Quote</span>
                </button>
              )}

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* 3. MOBILE MENU (Full Clean Drawer, Single Line Links) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          
          <form action="/shop" method="GET" className="relative w-full">
            <input
              type="text"
              name="q"
              placeholder="Search 6-inch and 12-inch bully sticks..."
              className="w-full bg-slate-100 rounded-full py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          <div className="flex flex-col space-y-1.5 pt-2 text-sm font-bold text-slate-800">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-slate-50 flex items-center justify-between">
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <a
              href={cmsData.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#FF9900] text-slate-950 font-black py-3 rounded-full text-center block text-xs shadow whitespace-nowrap">
              Shop on Amazon Canada Store 🇨🇦
            </a>

            {onOpenQuote && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full bg-[#C8102E] text-white font-black py-3 rounded-full text-center block text-xs uppercase tracking-wider shadow whitespace-nowrap">
                Get a Wholesale Quote
              </button>
            )}
          </div>

        </div>
      )}

    </header>
  );
}
