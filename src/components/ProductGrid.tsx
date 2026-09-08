import React, { useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, filters, setFilters, resetFilters, formatPrice } = useShop();

  const allSizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];
  const categories = ['All', 'Running', 'Trail', 'Training', 'Basketball', 'Lifestyle'];
  const genders = ['All', 'Men', 'Women', 'Unisex'];

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Category
        if (filters.category !== 'All' && p.category !== filters.category) {
          return false;
        }

        // Gender
        if (filters.gender !== 'All' && p.gender !== filters.gender && p.gender !== 'Unisex') {
          return false;
        }

        // Size
        if (filters.selectedSize && !p.sizes.includes(filters.selectedSize)) {
          return false;
        }

        // Max price
        if (p.price > filters.maxPrice) {
          return false;
        }

        // Sale only
        if (filters.onSaleOnly && p.price >= p.originalPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'discount') {
          const discA = (a.originalPrice - a.price) / a.originalPrice;
          const discB = (b.originalPrice - b.price) / b.originalPrice;
          return discB - discA;
        }
        return 0; // featured
      });
  }, [products, filters]);

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.gender !== 'All' ? 1 : 0) +
    (filters.selectedSize ? 1 : 0) +
    (filters.maxPrice < 250 ? 1 : 0) +
    (filters.onSaleOnly ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <section id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Air Zoom Lineup</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Performance Catalog
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'shoe' : 'shoes'} curated for maximum responsiveness
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <label htmlFor="sort-dropdown" className="text-xs font-semibold text-slate-500 shrink-0">
            Sort by:
          </label>
          <select
            id="sort-dropdown"
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="py-6 space-y-4">
        {/* Category & Sale Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-cat-${cat.toLowerCase()}`}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filters.category === cat
                  ? 'bg-slate-900 text-white shadow-md ring-2 ring-slate-900 ring-offset-1'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            id="filter-sale-toggle"
            onClick={() => setFilters((prev) => ({ ...prev, onSaleOnly: !prev.onSaleOnly }))}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filters.onSaleOnly
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-600 ring-offset-1'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            ⚡ On Sale
          </button>

          {activeFilterCount > 0 && (
            <button
              id="reset-all-filters-btn"
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Secondary filters bar: Gender & Size Pills & Max Price */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          {/* Gender selection */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Gender:</span>
            <div className="flex items-center gap-1">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => setFilters((prev) => ({ ...prev, gender: g }))}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    filters.gender === g
                      ? 'bg-sky-500 text-white font-bold'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Size filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
            <span className="font-semibold text-slate-500 shrink-0">Size (US):</span>
            <button
              onClick={() => setFilters((prev) => ({ ...prev, selectedSize: null }))}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                filters.selectedSize === null
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              All
            </button>
            {allSizes.map((sz) => (
              <button
                key={sz}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedSize: prev.selectedSize === sz ? null : sz,
                  }))
                }
                className={`w-7 h-7 rounded text-[11px] font-semibold flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  filters.selectedSize === sz
                    ? 'bg-sky-500 text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="font-semibold text-slate-500 shrink-0">Max: {formatPrice(filters.maxPrice)}</span>
            <input
              id="price-range-slider"
              type="range"
              min="100"
              max="250"
              step="5"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-28 accent-sky-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div
          id="product-cards-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pt-4"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div id="no-products-empty-state" className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8 my-8">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">No shoes match your criteria</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Try adjusting your search query, clearing size filters, or expanding the price range to explore more models.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </section>
  );
};
