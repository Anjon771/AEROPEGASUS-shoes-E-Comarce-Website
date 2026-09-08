import React, { useState } from 'react';
import { useShop, CURRENCIES } from '../context/ShopContext';
import { CurrencyCode } from '../types';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Package, 
  Menu, 
  X, 
  Flame,
  Zap,
  Globe
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cartItemCount, 
    wishlist, 
    currency, 
    setCurrencyCode, 
    openCart, 
    openWishlist, 
    openOrderTracking,
    filters,
    setFilters
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);

  const categories = ['All', 'Running', 'Trail', 'Training', 'Basketball', 'Lifestyle'];

  const handleCategoryClick = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      onSaleOnly: false,
    }));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 550, behavior: 'smooth' });
  };

  const handleSaleClick = () => {
    setFilters((prev) => ({
      ...prev,
      onSaleOnly: true,
    }));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 550, behavior: 'smooth' });
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top promotional announcement bar */}
      <div id="promo-banner" className="bg-slate-900 text-slate-100 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded text-[11px]">
              <Zap className="w-3 h-3 fill-current" /> PROMO
            </span>
            <span className="font-medium truncate">
              Use code <strong className="text-amber-300 font-bold tracking-wider">PEGASUS20</strong> for 20% OFF | Free Express Shipping on orders over $100
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300 shrink-0">
            <button
              onClick={() => openOrderTracking()}
              id="header-track-order-btn"
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track My Order</span>
            </button>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <select
                id="currency-selector"
                value={currency.code}
                onChange={(e) => setCurrencyCode(e.target.value as CurrencyCode)}
                className="bg-transparent text-slate-200 text-xs cursor-pointer focus:outline-none"
              >
                {Object.keys(CURRENCIES).map((code) => (
                  <option key={code} value={code} className="bg-slate-900 text-white">
                    {code} ({CURRENCIES[code as CurrencyCode].symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-black rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M21.71 6.29a1 1 0 0 0-.33-.21A1 1 0 0 0 21 6H8a1 1 0 0 0-.92.62l-4 10A1 1 0 0 0 4 18h13a1 1 0 0 0 .92-.62l4-10a1 1 0 0 0-.21-1.09zM16.38 16H5.62l3.2-8h10.76z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-xl text-slate-950 uppercase leading-tight font-sans">
                  AERO<span className="text-sky-500">PEGASUS</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-600 font-semibold uppercase">
                  Athletic Performance Lab
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`nav-cat-${cat.toLowerCase()}`}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  filters.category === cat && !filters.onSaleOnly
                    ? 'text-slate-950 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              id="nav-sale-btn"
              onClick={handleSaleClick}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                filters.onSaleOnly
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50/60'
              }`}
            >
              <Flame className="w-4 h-4 fill-current" />
              Flash Sale
            </button>
          </nav>

          {/* Search bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 absolute left-3 text-slate-600 pointer-events-none" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Search Pegasus sneakers..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-slate-100/90 text-sm text-slate-900 pl-9 pr-8 py-2 rounded-full border border-transparent focus:border-sky-400 focus:bg-white focus:outline-none transition-all placeholder:text-slate-600"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 text-slate-600 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Actions: Search (Mobile), Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSearchMobile(!showSearchMobile)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 md:hidden"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="header-wishlist-btn"
              onClick={openWishlist}
              className="relative p-2 text-slate-700 hover:text-rose-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span
                  id="wishlist-badge"
                  className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow"
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              id="header-cart-btn"
              onClick={openCart}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-3.5 py-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span
                    id="cart-badge-count"
                    className="absolute -top-2.5 -right-2.5 bg-sky-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-950"
                  >
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {showSearchMobile && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-600" />
              <input
                type="text"
                placeholder="Search sneakers..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full bg-slate-100 text-sm text-slate-900 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-xl">
          <div className="font-semibold text-xs text-slate-600 uppercase tracking-wider px-3 pb-1">
            Collections
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-between"
            >
              <span>{cat} Shoes</span>
              {filters.category === cat && <span className="w-2 h-2 rounded-full bg-sky-500" />}
            </button>
          ))}
          <button
            onClick={handleSaleClick}
            className="w-full text-left px-3 py-2 text-base font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
          >
            <Flame className="w-4 h-4" />
            <span>Summer Sale</span>
          </button>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600 px-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openOrderTracking();
              }}
              className="flex items-center gap-2 text-slate-800 font-medium"
            >
              <Package className="w-4 h-4" />
              <span>Track My Order</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
