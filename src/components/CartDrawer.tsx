import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { getShoeImage, handleImageError } from '../utils/imageHelper';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Sparkles,
  Check
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    formatPrice, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTax, 
    cartTotal, 
    applyPromoCode, 
    activePromoCode, 
    removePromoCode,
    openCheckout
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 100;
  const progressToFreeShipping = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput.trim());
    if (success) setPromoInput('');
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={closeCart}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h2 className="font-black text-lg text-slate-900">Your Cart</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              id="close-cart-btn"
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-sky-50/70 border-b border-sky-100 text-xs">
            <div className="flex items-center justify-between font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-600" />
                {amountNeededForFreeShipping === 0 ? (
                  <span className="font-bold text-emerald-600">🎉 Free Shipping Unlocked!</span>
                ) : (
                  <span>
                    Add <strong className="text-slate-900">{formatPrice(amountNeededForFreeShipping)}</strong> for Free Express Delivery
                  </span>
                )}
              </span>
              <span className="font-bold text-sky-700">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-sky-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List or Empty State */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">Your cart is empty</h3>
                <p className="text-slate-500 text-xs max-w-xs mb-6">
                  Check out our latest Air Zoom series and find your perfect ride for high-tempo runs.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full shadow transition-colors cursor-pointer"
                >
                  Start Exploring Shoes
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 items-center"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-slate-200/60">
                    <img
                      src={getShoeImage(item.image)}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-full h-auto object-contain transform -rotate-12"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 mt-0.5">
                      Size: <strong className="text-slate-800">US {item.size}</strong> · {item.color}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold text-slate-900 min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-sm font-extrabold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Checkout (Only when cart has items) */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-4">
              {/* Promo Code input */}
              <div>
                {activePromoCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{activePromoCode} applied</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. PEGASUS20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-slate-900">
                    {cartShipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(cartShipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8.25%)</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartTax)}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-950">
                  <span>Total Due</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="drawer-checkout-btn"
                onClick={openCheckout}
                className="w-full py-4 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm transition-all duration-200 shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
