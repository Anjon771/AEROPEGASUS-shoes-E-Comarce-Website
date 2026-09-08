import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { getShoeImage, handleImageError } from '../utils/imageHelper';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openProductDetail 
  } = useShop();

  const [selectedColorway, setSelectedColorway] = useState(product.colorways[0]);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <article
      id={`product-card-${product.id}`}
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl flex flex-col justify-between border border-slate-200/80 hover:border-slate-300"
      style={{ backgroundColor: selectedColorway.bgHex || '#F8FAFC' }}
    >
      {/* Top badges & Wishlist button */}
      <div className="p-4 flex items-center justify-between z-10">
        <div className="flex flex-wrap gap-1.5">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-sky-600 text-white font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              New
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              Save {discountPercent}%
            </span>
          )}
        </div>

        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-2 rounded-full transition-all duration-200 backdrop-blur-md cursor-pointer ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md scale-110'
              : 'bg-white/80 text-slate-700 hover:text-rose-500 hover:bg-white shadow-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Center Image Container with signature 3D rotation and sliding name ribbon */}
      <div
        className="relative px-6 py-4 flex items-center justify-center min-h-[220px] cursor-pointer"
        onClick={() => openProductDetail(product)}
      >
        {/* Vertical Name Banner inspired by original styles */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-950/90 text-white flex items-center justify-center rounded-r-xl transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 z-10 shadow-lg">
          <span className="text-[10px] font-black tracking-widest uppercase writing-mode-vertical rotate-180 truncate max-h-[180px]">
            {product.name}
          </span>
        </div>

        {/* Shoe image */}
        <img
          src={getShoeImage(selectedColorway.image || product.image)}
          alt={`${product.name} in ${selectedColorway.name}`}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-48 h-auto object-contain drop-shadow-md transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-115 group-hover:translate-x-2"
          loading="lazy"
        />

        {/* Quick View Hover Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openProductDetail(product);
          }}
          className="absolute bottom-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Bottom Info Card Area */}
      <div className="p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200/60 rounded-b-2xl space-y-3">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold uppercase tracking-wider text-slate-600">
            {product.category} · {product.gender}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating}</span>
            <span className="text-slate-600">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h2
            onClick={() => openProductDetail(product)}
            className="font-bold text-slate-900 text-base hover:text-sky-600 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h2>
          <p className="text-xs text-slate-500 line-clamp-1">{product.subtitle}</p>
        </div>

        {/* Colorway Switcher Dots */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {product.colorways.map((cw) => (
              <button
                key={cw.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorway(cw);
                }}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  selectedColorway.name === cw.name
                    ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: cw.hex }}
                title={cw.name}
                aria-label={`Select color ${cw.name}`}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-600 font-medium">
            {product.sizes.length} sizes
          </span>
        </div>

        {/* Price and Add to Cart action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-rose-500 line-through font-medium">
              {formatPrice(product.originalPrice)}
            </div>
            <div className="text-lg font-black text-slate-900">
              {formatPrice(product.price)}
            </div>
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              // Add default standard size (or open modal if preferred)
              addToCart(product, product.sizes[2] || 9, selectedColorway.name, 1);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-sky-500 text-white hover:text-slate-950 font-semibold text-xs transition-all duration-200 shadow hover:shadow-md active:scale-95 cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
