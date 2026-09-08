import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, Award } from 'lucide-react';
import { img1, img2, img3, img4, handleImageError, getShoeImage } from '../utils/imageHelper';

export const Hero: React.FC = () => {
  const { products, openProductDetail, formatPrice } = useShop();

  const heroShoeOptions = [
    { name: 'Glacier Blue', image: img1, bg: 'from-sky-50 to-cyan-100/60', accent: '#0284c7' },
    { name: 'Electric Lime', image: img2, bg: 'from-emerald-50 to-teal-100/60', accent: '#10b981' },
    { name: 'Sunset Coral', image: img3, bg: 'from-orange-50 to-amber-100/60', accent: '#f97316' },
    { name: 'Hyper Violet', image: img4, bg: 'from-indigo-50 to-violet-100/60', accent: '#6366f1' },
  ];

  const [activeShoeIndex, setActiveShoeIndex] = useState(0);
  const featuredProduct = products[0];

  const scrollToShop = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-banner" className="relative overflow-hidden bg-slate-950 text-white">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & Call to Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-400 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE REVOLUTIONARY AIR ZOOM SERIES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
              ENGINEERED FOR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-200">
                MAXIMUM PROPULSION
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Every stride supercharged with dual Zoom Air pods and React foam responsiveness. Experience the ultimate sweet spot between featherlight speed and high-mileage road comfort.
            </p>

            {/* Price & Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                id="hero-shop-collection-btn"
                onClick={scrollToShop}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {featuredProduct && (
                <button
                  id="hero-view-featured-btn"
                  onClick={() => openProductDetail(featuredProduct)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-base border border-white/20 transition-all cursor-pointer"
                >
                  <span>Explore Specs ({formatPrice(featuredProduct.price)})</span>
                </button>
              )}
            </div>

            {/* Micro specs pill */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-left border-t border-white/10">
              <div>
                <div className="text-xs text-slate-400 font-medium">Energy Return</div>
                <div className="text-lg font-bold text-white">85% ZoomX</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Heel-Toe Drop</div>
                <div className="text-lg font-bold text-white">10 mm</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Ultralight</div>
                <div className="text-lg font-bold text-white">288 grams</div>
              </div>
            </div>
          </div>

          {/* Right Showcase: Interactive 3D Shoe Display */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Background disc */}
            <div className="relative w-72 sm:w-88 h-72 sm:h-88 rounded-full bg-gradient-to-tr from-white/5 to-white/15 border border-white/10 flex items-center justify-center p-6 shadow-2xl">
              {/* Rotating vertical banner text (honoring the original aesthetic) */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-sky-500 text-slate-950 text-[11px] font-black px-3 py-1.5 tracking-widest uppercase rounded shadow writing-mode-vertical rotate-180">
                AIR ZOOM PEGASUS
              </div>

              {/* Shoe Image with floating hover perspective */}
              <img
                key={activeShoeIndex}
                src={getShoeImage(heroShoeOptions[activeShoeIndex].image)}
                alt={heroShoeOptions[activeShoeIndex].name}
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full max-w-[320px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] transform -rotate-12 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer"
                onClick={() => featuredProduct && openProductDetail(featuredProduct)}
              />
            </div>

            {/* Colorway Switcher underneath */}
            <div className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
              <span className="text-xs text-slate-300 font-medium">Colorway:</span>
              <div className="flex items-center gap-2">
                {heroShoeOptions.map((opt, idx) => (
                  <button
                    key={opt.name}
                    onClick={() => setActiveShoeIndex(idx)}
                    className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                      activeShoeIndex === idx
                        ? 'border-white scale-125 shadow-md ring-2 ring-sky-400'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: opt.accent }}
                    title={opt.name}
                    aria-label={`Select ${opt.name}`}
                  />
                ))}
              </div>
              <span className="text-xs text-sky-300 font-semibold pl-1">
                {heroShoeOptions[activeShoeIndex].name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Perks Bar */}
      <div className="border-t border-white/10 bg-slate-900/60 py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <Truck className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Free Fast Shipping</div>
              <div className="text-[11px] text-slate-400">On all orders over $100</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <RefreshCw className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">30-Day Wear Test</div>
              <div className="text-[11px] text-slate-400">Hassle-free return policy</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">100% Authentic</div>
              <div className="text-[11px] text-slate-400">Direct from factory lab</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">2-Year Warranty</div>
              <div className="text-[11px] text-slate-400">Full midsole integrity guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
