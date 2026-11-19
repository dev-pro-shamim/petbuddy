'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Send, Building2, Mail, Phone, MapPin, Package } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function QuoteModal({ isOpen, onClose, productName = 'Pet Buddy Bully Sticks (6-Inch)' }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    businessType: 'Pet Specialty Store',
    email: '',
    phone: '',
    product: productName,
    volume: '50 - 100 Packs',
    location: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update product when prop changes
  React.useEffect(() => {
    if (productName) {
      setFormData(prev => ({ ...prev, product: productName }));
    }
  }, [productName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Submission failed');
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-300">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#C8102E] text-white p-6 sm:p-7 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <span className="inline-block bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">
            B2B Wholesale &amp; Distributor Pricing
          </span>
          <h3 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            Request Case Quote: {formData.product}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Pet Buddy supplies pet stores, boutique retailers, and veterinary clinics across Canada and the US with pure grass-fed chews.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 font-heading">Quote Request Received!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. Our Toronto wholesale desk has received your quotation inquiry for <strong>{formData.product}</strong>. We will review and reply to <strong>{formData.email}</strong> within 1 business day.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all">
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Business / Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paws & Tails Boutique"
                    value={formData.business}
                    onChange={e => setFormData({ ...formData, business: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Business Type</label>
                  <select
                    value={formData.businessType}
                    onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-semibold text-slate-700">
                    <option value="Pet Specialty Store">Pet Specialty Store / Boutique</option>
                    <option value="Veterinary Clinic">Veterinary Hospital / Clinic</option>
                    <option value="Grooming Salon">Dog Groomer &amp; Spa</option>
                    <option value="Distributor">Wholesale Distributor</option>
                    <option value="Other">Other Business</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Estimated Monthly Volume</label>
                  <select
                    value={formData.volume}
                    onChange={e => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-semibold text-slate-700">
                    <option value="Sample Order (10 - 25 Packs)">Sample Order (10 - 25 Packs)</option>
                    <option value="50 - 100 Packs">50 - 100 Packs / Month</option>
                    <option value="100 - 250 Packs">100 - 250 Packs / Month</option>
                    <option value="250+ Master Cases">250+ Master Cases</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@petstore.ca"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (416) 555-0199"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">City &amp; Province / State</label>
                  <input
                    type="text"
                    placeholder="e.g. Toronto, Ontario"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Product Inquired</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.product}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Additional Notes / Delivery Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your shelf space, target start date, or requested chew lengths..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-[#C8102E] font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Direct Inquiries: <a href="mailto:infor@pet-buddy.net" className="text-[#C8102E] font-bold">infor@pet-buddy.net</a>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-[#C8102E] to-[#A60D24] hover:brightness-110 text-white font-black px-6 py-2.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all disabled:opacity-50">
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit RFQ'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
