'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle, ChevronDown, ChevronUp, ExternalLink, Mail } from 'lucide-react';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([
    {
      q: "What makes Pet Buddy bully sticks different from regular rawhide?",
      a: "Unlike rawhide which is made from chemical-leached cattle hide scraps bleached with hydrogen peroxide, Pet Buddy bully sticks are made from 100% grass-fed beef pizzle. They are 100% digestible, grain-free, completely chemical-free, and safe for your dog's sensitive stomach."
    },
    {
      q: "What lengths do you offer and how should I choose?",
      a: "We strictly offer two standardized lengths: 6-Inch and 12-Inch. The 6-Inch sticks are ideal for small to medium breeds (under 45 lbs) and puppies over 12 weeks. The 12-Inch Jumbo sticks are engineered for power chewers and large breeds (over 45 lbs) such as German Shepherds, Labs, and Huskies."
    },
    {
      q: "Where can retail consumers purchase Pet Buddy products?",
      a: "Individual pet parents can order directly from our official Amazon Canada store with Prime fast shipping at https://www.amazon.ca/dp/B0H637LFT4/?th=1."
    },
    {
      q: "How can pet specialty stores and veterinary clinics order wholesale?",
      a: "Retailers, groomers, and veterinary clinics can click 'Get a Bulk Quote' anywhere on our website or email our wholesale operations team directly at infor@pet-buddy.net. We offer tiered distributor case pricing and low order minimums."
    },
    {
      q: "Do Pet Buddy bully sticks have an odor?",
      a: "Our bully sticks are slow oven-roasted to minimize natural scent. Because they are 100% all-natural beef with zero artificial perfumes, they carry a natural savory beef aroma that dogs love, without the noxious chemical stench of cheap imported sticks."
    },
    {
      q: "What is your return policy and satisfaction guarantee?",
      a: "We stand behind every single chew we make. If you or your dog are not completely satisfied with the quality of your Pet Buddy treats, contact us at infor@pet-buddy.net for a replacement or resolution."
    }
  ]);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />

      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#C8102E] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-[#F59E0B] text-xs font-black uppercase tracking-wider">
            Help &amp; Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-black">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Everything you need to know about our grass-fed beef chews, length safety, wholesale case orders, and shipping.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-8">
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-heading font-black text-slate-900 text-sm hover:text-[#C8102E] transition-colors">
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 flex-shrink-0 text-[#C8102E]" /> : <ChevronDown className="w-5 h-5 flex-shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-black text-xl">Still Have Questions?</h3>
            <p className="text-xs text-slate-300 mt-1">Our Toronto team is happy to assist with veterinary or retail inquiries.</p>
          </div>
          <a
            href="mailto:infor@pet-buddy.net"
            className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Email infor@pet-buddy.net</span>
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}
