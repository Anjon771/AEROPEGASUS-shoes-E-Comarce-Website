import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { getShoeImage, handleImageError } from '../utils/imageHelper';

export const WishlistDrawer: React.FC = () => {
  const { 
    isWishlistOpen, 
    closeWishlist, 
    wishlist, 
    products, 
    toggleWishlist, 
    moveWishlistToCart, 
    formatPrice,
    openProductDetail 
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div
      id="wishlist-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={closeWishlist}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="wishlist-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-current" />
              <h2 className="font-black text-lg text-slate-900">Saved Wishlist</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                {wishlist.length}
              </span>
            </div>
            <button
              id="close-wishlist-btn"
              onClick={closeWishlist}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List or Empty State */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Your wishlist is empty</h3>
                <p className="text-slate-500 text-xs max-w-xs mb-6">
                  Tap the heart icon on any shoe card to save your favorites for later.
                </p>
                <button
                  onClick={closeWishlist}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow transition-colors cursor-pointer"
                >
                  Browse Sneakers
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  id={`wishlist-item-${product.id}`}
                  className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center"
                >
                  <div
                    className="w-20 h-20 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-slate-200/60 cursor-pointer"
                    onClick={() => {
                      closeWishlist();
                      openProductDetail(product);
                    }}
                  >
                    <img
                      src={getShoeImage(product.image)}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-auto object-contain transform -rotate-12 hover:scale-110 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        onClick={() => {
                          closeWishlist();
                          openProductDetail(product);
                        }}
                        className="font-bold text-sm text-slate-900 truncate hover:text-sky-600 transition-colors cursor-pointer"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      {product.category} · {product.gender}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-extrabold text-slate-900">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        onClick={() => moveWishlistToCart(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {wishlistedProducts.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/50">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => moveWishlistToCart(p));
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Move All To Cart ({wishlistedProducts.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
