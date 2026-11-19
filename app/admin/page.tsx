'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShoppingCart, 
  Settings, 
  Sliders, 
  Upload, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  ExternalLink, 
  Search, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product } from '@/components/ProductCard';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'cms' | 'quotes' | 'orders' | 'settings'>('overview');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cms, setCms] = useState<any>({
    announcement: "🍁 Canadian Owned & Operated | 100% All-Natural Grass-Fed Beef Dog Treats | Buy on Amazon Canada 🇨🇦",
    amazonUrl: "https://www.amazon.ca/dp/B0H637LFT4/?th=1",
    email: "infor@pet-buddy.net",
    phone: "+1 (306) 260-4467",
    address: "4 Alrita Cres, Toronto, ON, M1R 4M3, Canada",
    hero: {
      badge: "🇨🇦 Canadian Owned & Operated • 100% Pure Natural",
      titleLine1: "Pure Pet Treats &",
      titleHighlight: "Natural Bully Sticks",
      subtitle: "Single-ingredient, grass-fed beef pizzle oven-roasted to perfection. Calibrated in 6-inch & 12-inch cuts for safe chewing, cleaner canine teeth, and happier dogs.",
      ctaQuote: "Get a Wholesale Quote",
      ctaAmazon: "Shop on Amazon Canada 🇨🇦"
    },
    promoBanner: {
      badge: "Limited Time Wholesale Offer",
      title: "Stock Pet Buddy In Your Retail Store or Clinic",
      subtitle: "Enjoy tiered B2B pricing, free Canadian freight on bulk orders, and high-margin natural pet chews.",
      buttonText: "Request Case Pricing"
    },
    faqs: []
  });

  // UI & Filter states
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productFormData, setProductFormData] = useState<any>({
    name: '',
    category: 'bully-sticks',
    length: '6-Inch',
    badge: 'Popular Chew',
    price: 29.99,
    salePrice: 24.99,
    image: '/assets/images/products/pet-buddy-6in-6pk-cross.jpg',
    description: '',
    ingredients: '100% Pure Natural Grass-Fed Beef Pizzle',
    amazonUrl: 'https://www.amazon.ca/dp/B0H637LFT4/?th=1',
    inStock: true,
    featured: false
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Search & Filter states
  const [prodSearch, setProdSearch] = useState('');
  const [prodCatFilter, setProdCatFilter] = useState('all');
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState('all');

  // Load all data
  const loadAllData = async () => {
    try {
      const [resProd, resQuotes, resOrders, resCms] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/quotes').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/cms').then(r => r.json())
      ]);

      if (Array.isArray(resProd)) setProducts(resProd);
      if (Array.isArray(resQuotes)) setQuotes(resQuotes);
      if (Array.isArray(resOrders)) setOrders(resOrders);
      if (resCms && resCms.email) setCms(resCms);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProductFormData((prev: any) => ({ ...prev, image: data.url }));
        showToast('Image uploaded successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductFormData({
      name: '',
      category: 'bully-sticks',
      length: '6-Inch',
      badge: 'New Arrival',
      price: 29.99,
      salePrice: 24.99,
      image: '/assets/images/products/pet-buddy-6in-6pk-cross.jpg',
      description: '',
      ingredients: '100% Pure Natural Grass-Fed Beef Pizzle',
      amazonUrl: 'https://www.amazon.ca/dp/B0H637LFT4/?th=1',
      inStock: true,
      featured: false
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductFormData({
      name: p.name,
      category: p.category,
      length: p.length || '6-Inch',
      badge: p.badge || '',
      price: p.price,
      salePrice: p.salePrice || '',
      image: p.image,
      description: p.description,
      ingredients: p.ingredients || '100% Pure Natural Grass-Fed Beef Pizzle',
      amazonUrl: p.amazonUrl || 'https://www.amazon.ca/dp/B0H637LFT4/?th=1',
      inStock: p.inStock !== false,
      featured: Boolean(p.featured)
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        // Update
        const res = await fetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productFormData)
        });
        if (!res.ok) throw new Error('Failed to update product');
        showToast('Product updated successfully!');
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productFormData)
        });
        if (!res.ok) throw new Error('Failed to create product');
        showToast('New product added to catalog!');
      }

      setProductModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleToggleStock = async (p: Product) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: p.inStock === false ? true : false })
      });
      if (!res.ok) throw new Error('Stock update failed');
      showToast(`Stock updated for ${p.name}`);
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`Are you sure you want to delete "${p.name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Product deleted from catalog');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Quotes Management
  const handleUpdateQuoteStatus = async (quoteId: string, status: string) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Status update failed');
      showToast(`Quote marked as ${status}`);
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to remove this quote inquiry?')) return;
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Quote removed');
      loadAllData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleReplyQuote = (buyerEmail: string, buyerName: string, product: string) => {
    const subject = encodeURIComponent(`Pet Buddy Wholesale Quote - ${product}`);
    const body = encodeURIComponent(
      `Hi ${buyerName},\n\nThank you for reaching out to Pet Buddy Imports Inc. regarding wholesale pricing for ${product}.\n\nWe supply premium, single-ingredient grass-fed dog chews directly to retail boutiques, veterinary clinics, and pet stores across Canada and the US.\n\nPlease find our tiered distributor case pricing and freight options attached. Let us know your preferred shipment schedule and target volume.\n\nBest regards,\nPet Buddy Wholesale Operations\nWebmail: infor@pet-buddy.net\nPhone: +1 (306) 260-4467\nToronto, ON, Canada\nAmazon Store: https://www.amazon.ca/dp/B0H637LFT4/?th=1`
    );
    window.location.href = `mailto:${buyerEmail}?subject=${subject}&body=${body}`;
  };

  const handleExportCSV = () => {
    if (quotes.length === 0) {
      showToast('No quotes available to export', 'error');
      return;
    }
    const headers = ["Quote ID", "Date", "Name", "Business", "Type", "Email", "Phone", "Product", "Volume", "Location", "Status", "Notes"];
    const rows = quotes.map(q => [
      `"${q.id || ''}"`,
      `"${q.date || ''}"`,
      `"${(q.name || '').replace(/"/g, '""')}"`,
      `"${(q.business || '').replace(/"/g, '""')}"`,
      `"${(q.businessType || '').replace(/"/g, '""')}"`,
      `"${q.email || ''}"`,
      `"${q.phone || ''}"`,
      `"${(q.product || '').replace(/"/g, '""')}"`,
      `"${q.volume || ''}"`,
      `"${(q.location || '').replace(/"/g, '""')}"`,
      `"${q.status || ''}"`,
      `"${(q.message || '').replace(/"/g, '""')}"`
    ].join(","));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(",")].concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pet_buddy_wholesale_quotes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Wholesale quotes exported to CSV!');
  };

  // CMS Save
  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cms)
      });
      if (!res.ok) throw new Error('Failed to update CMS');
      showToast('CMS Content & Site Settings saved live!');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    if (prodCatFilter !== 'all' && p.category !== prodCatFilter) return false;
    if (prodSearch) {
      const q = prodSearch.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !(p.length || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Filtered quotes list
  const filteredQuotes = quotes.filter(q => {
    if (quoteStatusFilter !== 'all' && q.status !== quoteStatusFilter) return false;
    if (quoteSearch) {
      const s = quoteSearch.toLowerCase();
      const match = (q.name || '').toLowerCase().includes(s) ||
                    (q.business || '').toLowerCase().includes(s) ||
                    (q.email || '').toLowerCase().includes(s) ||
                    (q.product || '').toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });

  const pendingQuotesCount = quotes.filter(q => q.status === 'New').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold text-white transition-all transform animate-bounce ${
          toast.type === 'error' ? 'bg-red-700' : 'bg-slate-900 border border-slate-700'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-red-300" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ADMIN HEADER */}
      <header className="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo and Tag */}
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-3">
                <img src="/assets/images/pet-buddy-logo.png" alt="Pet Buddy" className="h-12 w-auto object-contain bg-white rounded-xl p-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C8102E] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      FULL-STACK ADMIN &amp; CMS
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">● Live API Dynamic</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Pet Buddy Imports Inc. &bull; Toronto, ON</div>
                </div>
              </Link>
            </div>

            {/* Quick Actions & Store Link */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="bg-[#1E293B] hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">View Live Store</span>
              </Link>

              <a
                href={cms.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 bg-[#FF9900] hover:bg-[#E88B00] text-slate-950 px-3.5 py-2 rounded-xl text-xs font-black transition-all">
                <span>Amazon Canada 🇨🇦</span>
              </a>

              <div className="w-9 h-9 rounded-xl bg-[#C8102E] text-white flex items-center justify-center font-black text-xs shadow-md">
                PB
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 bg-[#0F172A] text-slate-300 border-r border-slate-800 flex-shrink-0 p-3 lg:p-4 space-y-1 flex lg:flex-col overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-[#C8102E] text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left whitespace-nowrap ${
              activeTab === 'products' ? 'bg-[#C8102E] text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}>
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Products &amp; Upload</span>
            </div>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left whitespace-nowrap ${
              activeTab === 'cms' ? 'bg-[#C8102E] text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}>
            <Sliders className="w-4 h-4" />
            <span>CMS Content Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left whitespace-nowrap ${
              activeTab === 'quotes' ? 'bg-[#C8102E] text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}>
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4" />
              <span>Wholesale Quotes</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              pendingQuotesCount > 0 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {quotes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-[#C8102E] text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders &amp; Log</span>
            </div>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-[#C8102E] text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'
            }`}>
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>

          <div className="hidden lg:block pt-8 text-[11px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-400">Pet Buddy Console v2.0</div>
            <div>Webmail: {cms.email}</div>
            <div>Database: Dynamic JSON API</div>
          </div>
        </aside>

        {/* MAIN WORK AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* ============================================================ */}
          {/* TAB 1: OVERVIEW */}
          {/* ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#C8102E] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="bg-[#C8102E] text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Store Operations Hub
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-heading font-black mt-2">
                    Pet Buddy Live Administration &amp; CMS
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                    Manage 100% natural dog chews catalog, upload product packaging photos, update homepage CMS banners, and process wholesale quotation requests in real-time.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all">
                    View RFQs
                  </button>
                </div>
              </div>

              {/* KPI Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Products</span>
                    <div className="text-3xl font-heading font-black text-slate-900 mt-1">{products.length}</div>
                    <div className="text-[11px] text-emerald-600 font-bold mt-1">● 100% Live in Shop</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl font-black">
                    📦
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wholesale RFQs</span>
                    <div className="text-3xl font-heading font-black text-[#C8102E] mt-1">{quotes.length}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">Direct from Web Form</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C8102E] flex items-center justify-center text-2xl font-black">
                    💼
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Quotes</span>
                    <div className="text-3xl font-heading font-black text-amber-600 mt-1">{pendingQuotesCount}</div>
                    <div className="text-[11px] text-amber-700 font-bold mt-1">Requires Response</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-black">
                    ⏳
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Webmail</span>
                    <div className="text-sm font-heading font-black text-slate-900 mt-1.5 truncate max-w-[150px]">{cms.email}</div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">Toronto Sales Desk</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl font-black">
                    ✉️
                  </div>
                </div>

              </div>

              {/* Recent Quotes & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Quotes (8 Cols) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="font-heading font-black text-lg text-slate-900">Recent Wholesale Quotes (RFQ)</h2>
                      <p className="text-xs text-slate-500">Inquiries submitted by pet stores, boutiques &amp; clinics</p>
                    </div>
                    <button onClick={() => setActiveTab('quotes')} className="text-xs font-bold text-[#C8102E] hover:underline">
                      View All Quotes &rarr;
                    </button>
                  </div>

                  {quotes.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No quotes submitted yet. When a buyer submits "Get a Bulk Quote", it will appear here instantly!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                            <th className="py-2.5">Buyer &amp; Store</th>
                            <th className="py-2.5">Product &amp; Volume</th>
                            <th className="py-2.5">Location</th>
                            <th className="py-2.5">Status</th>
                            <th className="py-2.5 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {quotes.slice(0, 5).map(q => (
                            <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 pr-2">
                                <div className="font-bold text-slate-900">{q.name}</div>
                                <div className="text-[11px] text-slate-500">{q.business}</div>
                              </td>
                              <td className="py-3 pr-2">
                                <div className="font-medium text-slate-800 line-clamp-1 max-w-[200px]">{q.product}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{q.volume}</div>
                              </td>
                              <td className="py-3 text-slate-600 font-medium">{q.location || 'Canada'}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  q.status === 'New' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  ● {q.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleReplyQuote(q.email, q.name, q.product)}
                                  className="bg-slate-900 hover:bg-[#C8102E] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all">
                                  Reply Email
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quick Actions & Category Status (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                    <h3 className="font-heading font-black text-base text-slate-900">Quick Actions</h3>
                    
                    <div className="space-y-2 text-xs font-bold">
                      <button
                        onClick={handleOpenAddProduct}
                        className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl text-slate-800 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-2.5">
                          <span>📦</span>
                          <span>Create Product with Image Upload</span>
                        </div>
                        <span>&rarr;</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('cms')}
                        className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl text-slate-800 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-2.5">
                          <span>✏️</span>
                          <span>Edit Hero Headline &amp; Banners</span>
                        </div>
                        <span>&rarr;</span>
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-2xl text-slate-800 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-2.5">
                          <span>📊</span>
                          <span>Export Quotes to CSV</span>
                        </div>
                        <span>&darr;</span>
                      </button>
                    </div>
                  </div>

                  {/* Length and Category breakdown */}
                  <div className="bg-[#0F172A] text-white p-6 rounded-3xl shadow-lg space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-black text-sm">Product Sizes &amp; Types</h4>
                      <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-0.5 rounded font-bold">{products.length} Items</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-1 border-b border-white/10">
                        <span className="text-slate-300">Bully Sticks (6" &amp; 12")</span>
                        <span className="font-mono font-bold text-[#F59E0B]">
                          {products.filter(p => p.category === 'bully-sticks').length} Items
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/10">
                        <span className="text-slate-300">Smoked Bones &amp; Chews</span>
                        <span className="font-mono font-bold text-[#F59E0B]">
                          {products.filter(p => p.category === 'chews-bones').length} Items
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-white/10">
                        <span className="text-slate-300">Natural Dog Treats</span>
                        <span className="font-mono font-bold text-[#F59E0B]">
                          {products.filter(p => p.category === 'treats').length} Items
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PRODUCTS MANAGEMENT WITH IMAGE UPLOAD SYSTEM */}
          {/* ============================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900">Products Catalog Management</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Add, edit, upload packaging photos, toggle stock status, and adjust prices.</p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 w-full relative">
                  <input
                    type="text"
                    placeholder="Search by title, size, or length..."
                    value={prodSearch}
                    onChange={e => setProdSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#C8102E]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={prodCatFilter}
                  onChange={e => setProdCatFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none">
                  <option value="all">All Categories</option>
                  <option value="bully-sticks">Bully Sticks (6" &amp; 12")</option>
                  <option value="chews-bones">Bones &amp; Chews</option>
                  <option value="treats">Natural Treats</option>
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Item &amp; Image</th>
                        <th className="py-3.5 px-4">Category &amp; Size</th>
                        <th className="py-3.5 px-4">Price / Sale</th>
                        <th className="py-3.5 px-4">Rating</th>
                        <th className="py-3.5 px-4 text-center">Stock Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 object-contain bg-white rounded-xl border border-slate-200 p-1 flex-shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/assets/images/products/pet-buddy-6in-6pk-cross.jpg';
                                }}
                              />
                              <div>
                                <div className="font-bold text-slate-900 leading-snug">{p.name}</div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-slate-400 font-mono">ID: #{p.id}</span>
                                  {p.badge && (
                                    <span className="bg-[#C8102E]/10 text-[#C8102E] text-[10px] font-bold px-1.5 py-0.5 rounded">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-800">
                              {p.category === 'bully-sticks' ? 'Bully Sticks' : p.category === 'chews-bones' ? 'Bones & Chews' : 'Natural Treats'}
                            </div>
                            <div className="text-[11px] text-slate-500">{p.length || 'Standard'}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-[#C8102E]">${Number(p.price).toFixed(2)} CAD</div>
                            {p.salePrice && (
                              <div className="text-[11px] text-slate-400 line-through">${Number(p.salePrice).toFixed(2)}</div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <span>★</span>
                              <span className="text-slate-800 text-xs">{p.rating || 5.0}</span>
                              <span className="text-[10px] text-slate-400">({p.reviews || 40})</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 transition-all ${
                                p.inStock !== false
                                  ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                  : 'bg-red-100 hover:bg-red-200 text-red-800'
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${p.inStock !== false ? 'bg-emerald-600' : 'bg-red-600'}`} />
                              <span>{p.inStock !== false ? 'In Stock' : 'Out of Stock'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1">
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg transition-all"
                                title="Delete Product">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: CMS CONTENT MANAGER (HERO, BANNERS, FAQS) */}
          {/* ============================================================ */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900">CMS Content &amp; Banner Editor</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control homepage headline texts, announcement notices, promo banners, and FAQs live.</p>
                </div>
                <button
                  onClick={handleSaveCms}
                  className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all">
                  Save All CMS Changes
                </button>
              </div>

              <form onSubmit={handleSaveCms} className="space-y-6">
                
                {/* 1. Hero Banner Settings */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-heading font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span>🌟 Homepage Hero Banner</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hero Pill Badge</label>
                      <input
                        type="text"
                        value={cms.hero?.badge || ''}
                        onChange={e => setCms({ ...cms, hero: { ...cms.hero, badge: e.target.value } })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Headline Line 1</label>
                      <input
                        type="text"
                        value={cms.hero?.titleLine1 || ''}
                        onChange={e => setCms({ ...cms, hero: { ...cms.hero, titleLine1: e.target.value } })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Headline Highlight (Gradient Text)</label>
                      <input
                        type="text"
                        value={cms.hero?.titleHighlight || ''}
                        onChange={e => setCms({ ...cms, hero: { ...cms.hero, titleHighlight: e.target.value } })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">CTA Quote Button Text</label>
                      <input
                        type="text"
                        value={cms.hero?.ctaQuote || ''}
                        onChange={e => setCms({ ...cms, hero: { ...cms.hero, ctaQuote: e.target.value } })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">Hero Subtitle Description</label>
                    <textarea
                      rows={3}
                      value={cms.hero?.subtitle || ''}
                      onChange={e => setCms({ ...cms, hero: { ...cms.hero, subtitle: e.target.value } })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                    />
                  </div>
                </div>

                {/* 2. Top Announcement Bar */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-heading font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span>📢 Top Announcement Notice</span>
                  </h3>
                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">Notice Message (Visible at very top of website)</label>
                    <input
                      type="text"
                      value={cms.announcement || ''}
                      onChange={e => setCms({ ...cms, announcement: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800"
                    />
                  </div>
                </div>

                {/* 3. Promotional Wholesale Banner */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="font-heading font-black text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <span>🏷️ Promotional Wholesale Banner</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Promo Title</label>
                      <input
                        type="text"
                        value={cms.promoBanner?.title || ''}
                        onChange={e => setCms({ ...cms, promoBanner: { ...cms.promoBanner, title: e.target.value } })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={cms.promoBanner?.buttonText || ''}
                        onChange={e => setCms({ ...cms, promoBanner: { ...cms.promoBanner, buttonText: e.target.value } })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all">
                    Save All CMS Settings
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: WHOLESALE QUOTES (RFQ) */}
          {/* ============================================================ */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900">Wholesale Quotation Requests (RFQ)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage incoming B2B buyer inquiries from Canadian &amp; US pet stores.</p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>Export to CSV</span>
                </button>
              </div>

              {/* Quotes Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 w-full relative">
                  <input
                    type="text"
                    placeholder="Search by buyer, business, email, or product..."
                    value={quoteSearch}
                    onChange={e => setQuoteSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-[#C8102E]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={quoteStatusFilter}
                  onChange={e => setQuoteStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none">
                  <option value="all">All Inquiry Statuses</option>
                  <option value="New">New / Unanswered</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quoted">Quoted / Pricing Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Quotes Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Date &amp; ID</th>
                        <th className="py-3.5 px-4">Buyer &amp; Business</th>
                        <th className="py-3.5 px-4">Contact (Email &amp; Phone)</th>
                        <th className="py-3.5 px-4">Product &amp; Volume</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredQuotes.map(q => (
                        <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-slate-900">{q.id}</div>
                            <div className="text-[10px] text-slate-400">{q.date}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{q.name}</div>
                            <div className="text-[11px] text-slate-500">{q.business}</div>
                            {q.businessType && (
                              <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-medium">
                                {q.businessType}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <a href={`mailto:${q.email}`} className="text-blue-600 hover:underline font-medium block">
                              {q.email}
                            </a>
                            <div className="text-[11px] text-slate-500">{q.phone || 'N/A'}</div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800 line-clamp-1 max-w-[200px]" title={q.product}>
                              {q.product}
                            </div>
                            <span className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                              {q.volume}
                            </span>
                            {q.message && (
                              <div className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1" title={q.message}>
                                "{q.message}"
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4 font-medium text-slate-700">
                            {q.location || 'Canada'}
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={q.status}
                              onChange={e => handleUpdateQuoteStatus(q.id, e.target.value)}
                              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none focus:border-[#C8102E]">
                              <option value="New">🔴 New</option>
                              <option value="Contacted">🟡 Contacted</option>
                              <option value="Quoted">🟢 Quoted</option>
                              <option value="Closed">⚪ Closed</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleReplyQuote(q.email, q.name, q.product)}
                                className="bg-slate-900 hover:bg-[#C8102E] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span>Reply</span>
                              </button>
                              <button
                                onClick={() => handleDeleteQuote(q.id)}
                                className="text-slate-400 hover:text-red-600 p-1.5"
                                title="Delete Quote">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: ORDERS & LOG */}
          {/* ============================================================ */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900">Customer Orders &amp; Submissions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Orders submitted through the website checkout flow.</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Order ID &amp; Date</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Items Summary</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-slate-900">{ord.id}</div>
                            <div className="text-[10px] text-slate-400">{ord.date}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{ord.customer}</div>
                            <div className="text-[11px] text-blue-600">{ord.email}</div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{ord.items}</td>
                          <td className="py-3 px-4 font-bold text-[#C8102E]">{ord.total}</td>
                          <td className="py-3 px-4">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                              ● {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 6: STORE SETTINGS */}
          {/* ============================================================ */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
                <h2 className="font-heading font-black text-2xl text-slate-900">Website &amp; Business Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Control official Canadian contact channels, Amazon store link, and warehouse address.</p>
              </div>

              <form onSubmit={handleSaveCms} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Official Amazon Canada Store URL</label>
                  <input
                    type="url"
                    required
                    value={cms.amazonUrl || ''}
                    onChange={e => setCms({ ...cms, amazonUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used on all "Buy on Amazon Canada" buttons.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Wholesale &amp; Support Webmail</label>
                    <input
                      type="email"
                      required
                      value={cms.email || ''}
                      onChange={e => setCms({ ...cms, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-800"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Official address: infor@pet-buddy.net</span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Support Phone Number</label>
                    <input
                      type="text"
                      required
                      value={cms.phone || ''}
                      onChange={e => setCms({ ...cms, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Company Physical Address</label>
                  <input
                    type="text"
                    required
                    value={cms.address || ''}
                    onChange={e => setCms({ ...cms, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-medium text-slate-800"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#C8102E] hover:bg-[#A60D24] text-white font-black py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all">
                    Save Business Settings
                  </button>
                </div>
              </form>

            </div>
          )}

        </main>
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT PRODUCT MODAL WITH REAL IMAGE UPLOAD SYSTEM */}
      {/* ============================================================ */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[10px] font-black text-[#C8102E] uppercase tracking-wider">
                  {editingProductId ? `Edit Product #${editingProductId}` : 'Catalog Creator'}
                </span>
                <h3 className="font-heading font-black text-xl text-slate-900">
                  {editingProductId ? `Modify: ${productFormData.name}` : 'Add New Pet Buddy Product'}
                </h3>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-black flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pet Buddy Extra Thick Bully Sticks (6-Inch)"
                  value={productFormData.name}
                  onChange={e => setProductFormData({ ...productFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={productFormData.category}
                    onChange={e => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E] font-medium">
                    <option value="bully-sticks">Bully Sticks</option>
                    <option value="chews-bones">Bones &amp; Chews</option>
                    <option value="treats">Natural Treats</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Length Cut</label>
                  <select
                    value={productFormData.length}
                    onChange={e => setProductFormData({ ...productFormData, length: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E] font-medium">
                    <option value="6-Inch">6-Inch</option>
                    <option value="12-Inch">12-Inch</option>
                    <option value="Natural Cut">Natural Cut / None</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Best Seller"
                    value={productFormData.badge}
                    onChange={e => setProductFormData({ ...productFormData, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Price ($CAD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productFormData.price}
                    onChange={e => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale Price ($CAD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.salePrice}
                    onChange={e => setProductFormData({ ...productFormData, salePrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              {/* REAL IMAGE UPLOAD SYSTEM SECTION */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-800">
                  📷 Product Image Upload System
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-24 h-24 rounded-2xl bg-white border border-slate-300 p-2 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={productFormData.image || '/assets/images/products/pet-buddy-6in-6pk-cross.jpg'}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      <label className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5 transition-all">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>{isUploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP</span>
                    </div>

                    {/* Preloaded Asset Select */}
                    <select
                      onChange={e => {
                        if (e.target.value) setProductFormData({ ...productFormData, image: e.target.value });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2 text-[11px] font-bold text-slate-700">
                      <option value="">Or Select From Built-in Pet Buddy Photos</option>
                      <option value="/assets/images/products/pet-buddy-6in-6pk-cross.jpg">6" Cross Pack</option>
                      <option value="/assets/images/products/pet-buddy-6in-6pk-fan.jpg">6" Fan Pack</option>
                      <option value="/assets/images/products/pet-buddy-6in-6pk-standing.jpg">6" Standing Pack</option>
                      <option value="/assets/images/products/pet-buddy-6in-6pk-thick.jpg">6" Thick Pack</option>
                      <option value="/assets/images/products/pet-buddy-6in-12pk.jpg">6" 12-Pack Pouch</option>
                      <option value="/assets/images/products/pet-buddy-6in-6pk-bunch.jpg">12" Jumbo Bunch</option>
                      <option value="/assets/images/products/SMOKED-BEEF-FEMUR-BON-XL-.jpg">Femur Bone XL</option>
                      <option value="/assets/images/products/Beef-Backstrap-Gullet-3.jpg">Beef Backstrap</option>
                      <option value="/assets/images/products/Beef-Trachea.jpg">Beef Trachea</option>
                      <option value="/assets/images/products/treats1.png">Duck Wings / Treats</option>
                    </select>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="Image Path or Public URL"
                  value={productFormData.image}
                  onChange={e => setProductFormData({ ...productFormData, image: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productFormData.description}
                  onChange={e => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ingredients</label>
                <input
                  type="text"
                  value={productFormData.ingredients}
                  onChange={e => setProductFormData({ ...productFormData, ingredients: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amazon Product URL</label>
                <input
                  type="url"
                  value={productFormData.amazonUrl}
                  onChange={e => setProductFormData({ ...productFormData, amazonUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:border-[#C8102E] font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="stock-toggle"
                  checked={productFormData.inStock}
                  onChange={e => setProductFormData({ ...productFormData, inStock: e.target.checked })}
                  className="w-4 h-4 accent-[#C8102E] rounded cursor-pointer"
                />
                <label htmlFor="stock-toggle" className="font-bold text-slate-800 cursor-pointer">
                  Product is in Stock &amp; Visible to Customers
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C8102E] hover:bg-[#A60D24] text-white px-6 py-2.5 rounded-xl font-black shadow-md">
                  {editingProductId ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
