import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Mail, 
  Send, 
  ShieldCheck, 
  ArrowUpRight, 
  Truck, 
  RefreshCw, 
  Award,
  Phone,
  MapPin
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setFilters, openSizeGuide, openOrderTracking, showToast } = useShop();
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast(`Welcome! You're subscribed for exclusive early shoe drop alerts.`, 'success');
    setEmail('');
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Newsletter & VIP Club bar */}
      <div className="border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-2">
              <Mail className="w-4 h-4" />
              <span>Aero Pegasus VIP Club</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Unlock 15% Off Your Next Marathon Shoe
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-md">
              Be the first to know about secret colorway drops, limited Olympic editions, and athletic lab research.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 max-w-md">
            <input
              type="email"
              required
              placeholder="Enter your runner email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 w-full sm:w-72"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-lg shadow-sky-500/20"
            >
              <span>Join Club</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-black text-sm">
                A
              </div>
              <span className="font-extrabold tracking-tight text-lg text-white uppercase font-sans">
                AERO<span className="text-sky-400">PEGASUS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pioneering high-cadence road and trail footwear since 1983. Designed for personal bests, daily training miles, and podium finishes.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Beaverton, Oregon
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Footwear Categories</h4>
            <ul className="space-y-2.5 text-xs">
              {['Running', 'Trail', 'Training', 'Basketball', 'Lifestyle'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: cat, onSaleOnly: false }));
                      window.scrollTo({ top: 550, behavior: 'smooth' });
                    }}
                    className="hover:text-sky-400 transition-colors cursor-pointer text-left"
                  >
                    {cat} Footwear
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => openOrderTracking()}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Track Courier Shipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => openSizeGuide()}
                  className="hover:text-sky-400 transition-colors cursor-pointer"
                >
                  Pegasus Sizing Guide
                </button>
              </li>
              <li>
                <span className="text-slate-400">30-Day Risk-Free Trial</span>
              </li>
              <li>
                <span className="text-slate-400">2-Year Outsole Guarantee</span>
              </li>
              <li>
                <span className="text-slate-400">Factory Lab Recrafting</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Safe Checkout & Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-2">Guaranteed Protection</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Global Air Freight Logistics</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Genuine Nike Heritage</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 block mb-2 font-medium">Accepted Payments</span>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-white">VISA</span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-white">Mastercard</span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-white">Apple Pay</span>
                <span className="px-2 py-1 bg-white/10 rounded border border-white/10 text-white">PayPal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Aero Pegasus Athletics. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
