import React from 'react';
import { CheckCircle2, ArrowRight, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderConfirmationBox } from '../3d/OrderConfirmationBox';
import { formatINR } from '../../utils/currency';

export const OrderConfirmation: React.FC = () => {
  const { activeOrder, setActiveView, trackOrder } = useShop();

  if (!activeOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-white text-center bg-[#08090c]">
        <p className="text-neutral-400 text-sm mb-4">No active order found.</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-[#08090c] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* 3D Unboxing Box */}
        <OrderConfirmationBox />

        {/* Status Confirmation Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-white/10 shadow-2xl text-center space-y-6 mt-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 size={14} />
            <span>PAYMENT SUCCESSFUL</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-brand font-bold uppercase tracking-wide text-white">
              ORDER CONFIRMED
            </h1>
            <p className="text-base sm:text-lg text-amber-200/90 font-display tracking-wider mt-1">
              "YOUR STYLE IS ON THE WAY."
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-900/60 border border-white/5 text-left text-xs font-mono">
            <div>
              <p className="text-neutral-500 text-[10px] uppercase">Order ID</p>
              <p className="text-white font-bold">{activeOrder.id}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-[10px] uppercase">Estimated Arrival</p>
              <p className="text-amber-300 font-bold">{activeOrder.estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-[10px] uppercase">Amount Settled (INR)</p>
              <p className="text-white font-bold">{formatINR(activeOrder.total)}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-[10px] uppercase">Tracking AWB</p>
              <p className="text-neutral-300">{activeOrder.trackingNumber.slice(0, 12)}...</p>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="border-t border-white/10 pt-4 text-left space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Allocated Garments ({activeOrder.items.length})
            </h3>
            <div className="space-y-2">
              {activeOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-neutral-950/40 rounded-lg border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-12 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-white font-bold">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="border-t border-white/10 pt-4 text-left text-xs space-y-1">
            <p className="text-neutral-500 font-mono text-[10px] uppercase">Delivery Address</p>
            <p className="text-white font-semibold">{activeOrder.address.fullName}</p>
            <p className="text-neutral-300 font-light">
              {activeOrder.address.houseFlat}, {activeOrder.address.street}, {activeOrder.address.city} - {activeOrder.address.pincode}
            </p>
            <p className="text-neutral-400 font-mono text-[11px]">Phone: {activeOrder.address.mobile}</p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
            <button
              onClick={() => trackOrder(activeOrder.id)}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <Truck size={15} />
              <span>Track Order Live</span>
            </button>

            <button
              onClick={() => setActiveView('catalog')}
              className="w-full sm:w-auto px-8 py-3.5 glass-panel text-white font-semibold text-xs uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={15} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
