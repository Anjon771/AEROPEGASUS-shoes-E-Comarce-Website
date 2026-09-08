import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShippingAddress } from '../types';
import { getShoeImage, handleImageError } from '../utils/imageHelper';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartTax, 
    formatPrice, 
    placeOrder 
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address form
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States',
    phone: '+1 (555) 234-5678',
  });

  // Shipping selection
  const [shippingSpeed, setShippingSpeed] = useState<'standard' | 'express' | 'nextday'>('standard');

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingCost =
    shippingSpeed === 'express' ? 15 : shippingSpeed === 'nextday' ? 25 : cartSubtotal >= 100 ? 0 : 9.99;
  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + shippingCost + cartTax);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        placeOrder(
          formData,
          paymentMethod === 'card' ? 'Credit Card (Ending 4242)' : paymentMethod === 'applepay' ? 'Apple Pay' : 'PayPal Express',
          shippingSpeed
        );
      }, 800);
    }
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={closeCheckout}
    >
      <div
        id="checkout-dialog"
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-checkout-btn"
          onClick={closeCheckout}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          aria-label="Cancel checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Multi-step checkout form */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[85vh]">
          {/* Progress tracker */}
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                1
              </span>
              <span className={step === 1 ? 'text-slate-900' : 'text-slate-500'}>Shipping</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                2
              </span>
              <span className={step === 2 ? 'text-slate-900' : 'text-slate-500'}>Delivery</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                3
              </span>
              <span className={step === 3 ? 'text-slate-900' : 'text-slate-500'}>Payment</span>
            </div>
          </div>

          <form onSubmit={handleNextStep} className="space-y-6">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-lg text-slate-900">Delivery Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-lg text-slate-900">Choose Shipping Speed</h3>
                </div>

                <div className="space-y-3">
                  <label
                    onClick={() => setShippingSpeed('standard')}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      shippingSpeed === 'standard'
                        ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingSpeed === 'standard'}
                        onChange={() => setShippingSpeed('standard')}
                        className="accent-sky-500 w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">Standard Delivery</div>
                        <div className="text-xs text-slate-500">Delivered in 3-5 business days</div>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900">
                      {cartSubtotal >= 100 ? (
                        <span className="text-emerald-600 font-extrabold">FREE</span>
                      ) : (
                        formatPrice(9.99)
                      )}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingSpeed('express')}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      shippingSpeed === 'express'
                        ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingSpeed === 'express'}
                        onChange={() => setShippingSpeed('express')}
                        className="accent-sky-500 w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">Air Express 2-Day</div>
                        <div className="text-xs text-slate-500">Guaranteed 2 business days delivery</div>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900">{formatPrice(15.00)}</span>
                  </label>

                  <label
                    onClick={() => setShippingSpeed('nextday')}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      shippingSpeed === 'nextday'
                        ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingSpeed === 'nextday'}
                        onChange={() => setShippingSpeed('nextday')}
                        className="accent-sky-500 w-4 h-4"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900">Overnight Priority</div>
                        <div className="text-xs text-slate-500">Arrives by 10:30 AM next business day</div>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900">{formatPrice(25.00)}</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  <h3 className="font-bold text-lg text-slate-900">Payment Information</h3>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-slate-950 bg-slate-950 text-white shadow'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      paymentMethod === 'applepay'
                        ? 'border-slate-950 bg-slate-950 text-white shadow'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                      paymentMethod === 'paypal'
                        ? 'border-slate-950 bg-slate-950 text-white shadow'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    PayPal
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-1">
                          <span className="text-[10px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">
                            VISA
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Expires (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">CVC Code</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-600">
                    <p>
                      You will be redirected to complete payment with{' '}
                      <strong>{paymentMethod === 'applepay' ? 'Apple Pay' : 'PayPal'}</strong> securely.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>256-Bit Bank Grade SSL Encryption Guaranteed</span>
                </div>
              </div>
            )}

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as any)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-300 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Authorizing Order...</span>
                ) : step === 3 ? (
                  <>
                    <span>Confirm & Pay {formatPrice(finalTotal)}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary Review */}
        <div className="w-full md:w-80 bg-slate-50 p-6 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
              Order Summary ({cart.length} items)
            </h3>

            {/* Thumbnail items list */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 mb-4 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 text-xs">
                  <img
                    src={getShoeImage(item.image)}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      US {item.size} · Qty {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Line totals */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-bold text-slate-900">{formatPrice(cartTax)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-950">
                <span>Grand Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>30-Day Risk Free Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
