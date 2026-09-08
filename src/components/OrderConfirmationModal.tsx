import React from 'react';
import { useShop } from '../context/ShopContext';
import { getShoeImage, handleImageError } from '../utils/imageHelper';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Printer, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const { latestOrder, dismissOrderConfirmation, formatPrice, openOrderTracking } = useShop();

  if (!latestOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="order-confirmation-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
    >
      <div
        id="order-confirmation-dialog"
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 p-6 sm:p-8 space-y-6"
      >
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Order Confirmed!
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Thank you for your purchase! A confirmation receipt has been sent to{' '}
            <strong className="text-slate-900">{latestOrder.shippingAddress.email}</strong>.
          </p>
        </div>

        {/* Order Details Badge Grid */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Order Number</span>
            <span className="font-extrabold text-slate-900 text-sm">{latestOrder.id}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Estimated Arrival</span>
            <span className="font-extrabold text-emerald-600 text-sm">{latestOrder.estimatedDelivery}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Payment</span>
            <span className="font-bold text-slate-900">{latestOrder.paymentMethod}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Total Paid</span>
            <span className="font-extrabold text-slate-900 text-sm">{formatPrice(latestOrder.total)}</span>
          </div>
        </div>

        {/* Tracking Milestone Bar */}
        <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span className="flex items-center gap-1.5 text-sky-700">
              <Truck className="w-4 h-4" />
              <span>Tracking Number: {latestOrder.trackingNumber}</span>
            </span>
            <button
              onClick={() => {
                dismissOrderConfirmation();
                openOrderTracking(latestOrder.id);
              }}
              className="text-sky-600 hover:text-sky-800 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Live Track</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1 font-semibold">
            <div className="text-sky-600">
              <div className="h-1.5 bg-sky-500 rounded-full mb-1" />
              <span>Order Placed</span>
            </div>
            <div className="text-slate-400">
              <div className="h-1.5 bg-slate-200 rounded-full mb-1" />
              <span>Processing</span>
            </div>
            <div className="text-slate-400">
              <div className="h-1.5 bg-slate-200 rounded-full mb-1" />
              <span>In Transit</span>
            </div>
            <div className="text-slate-400">
              <div className="h-1.5 bg-slate-200 rounded-full mb-1" />
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Items summary */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Items in This Shipment</h4>
          <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
            {latestOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl text-xs">
                <img
                  src={getShoeImage(item.image)}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 truncate">{item.name}</div>
                  <div className="text-[11px] text-slate-500">
                    US {item.size} · {item.color} · Qty {item.quantity}
                  </div>
                </div>
                <div className="font-bold text-slate-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping address details */}
        <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900">{latestOrder.shippingAddress.fullName}</strong> ·{' '}
            {latestOrder.shippingAddress.address}, {latestOrder.shippingAddress.city},{' '}
            {latestOrder.shippingAddress.state} {latestOrder.shippingAddress.postalCode},{' '}
            {latestOrder.shippingAddress.country}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            id="continue-shopping-btn"
            onClick={dismissOrderConfirmation}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
