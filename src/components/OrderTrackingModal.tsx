import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { getShoeImage, handleImageError } from '../utils/imageHelper';
import { 
  X, 
  Package, 
  Search, 
  CheckCircle2, 
  Truck, 
  Clock, 
  ArrowRight,
  MapPin,
  RefreshCw
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { isOrderTrackingOpen, closeOrderTracking, orders, formatPrice } = useShop();

  const [searchId, setSearchId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!isOrderTrackingOpen) return null;

  const currentOrder =
    orders.find((o) => o.id.toLowerCase() === (selectedOrderId || searchId).toLowerCase()) ||
    orders[0];

  const milestones = [
    { title: 'Order Placed', desc: 'Payment verified & order queued', time: currentOrder?.createdAt || 'Just now', done: true },
    { title: 'Packing & Lab Inspection', desc: 'Shoe cushioning inspected & packed in original box', time: 'Estimated +4h', done: true },
    { title: 'Carrier In Transit', desc: 'Handed to FedEx Express Hub', time: 'Estimated +24h', done: false },
    { title: 'Out For Delivery', desc: 'Loaded on local carrier route', time: currentOrder?.estimatedDelivery || 'In 2 days', done: false },
  ];

  return (
    <div
      id="order-tracking-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={closeOrderTracking}
    >
      <div
        id="order-tracking-dialog"
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Track Shipment</h2>
              <p className="text-xs text-slate-500">Live order status & courier dispatch telemetry</p>
            </div>
          </div>
          <button
            id="close-tracking-btn"
            onClick={closeOrderTracking}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lookup input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Order # (e.g. PEG-123456)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 pl-9 pr-4 py-2 text-xs rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase font-mono"
            />
          </div>
          <button
            onClick={() => setSelectedOrderId(searchId)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Track
          </button>
        </div>

        {/* Order Details or No Orders State */}
        {currentOrder ? (
          <div className="space-y-5">
            {/* Header pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Order Reference</span>
                <span className="font-extrabold text-slate-900 text-sm">{currentOrder.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Courier Tracking</span>
                <span className="font-mono font-bold text-sky-600">{currentOrder.trackingNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentOrder.status}</span>
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 px-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Shipping Milestones</h4>
              <div className="space-y-4">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          m.done ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {m.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      {idx < milestones.length - 1 && (
                        <div className={`w-0.5 h-10 ${m.done ? 'bg-sky-300' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{m.title}</span>
                        <span className="text-slate-400 text-[11px]">{m.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Address */}
            <div className="p-3 bg-slate-50 rounded-xl text-xs flex items-center gap-2.5 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Shipping to:{' '}
                <strong className="text-slate-800">
                  {currentOrder.shippingAddress.fullName}, {currentOrder.shippingAddress.city},{' '}
                  {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}
                </strong>
              </span>
            </div>

            {/* Items inside */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Package Contents ({currentOrder.items.length} pairs)
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {currentOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getShoeImage(item.image)}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        onError={handleImageError}
                        className="w-9 h-9 object-contain bg-white rounded-lg p-1 border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          US {item.size} · {item.color} · Qty {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No recent orders located</h4>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Place an order on the store to generate an instant live order tracking timeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
