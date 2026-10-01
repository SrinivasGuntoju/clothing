import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { OrderStatus } from '../../types';
import { formatINR } from '../../utils/currency';

export const OrderTrackingView: React.FC = () => {
  const { activeOrder, orders, trackOrder, setActiveView } = useShop();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const order = activeOrder || orders[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-white text-center bg-[#08090c]">
        <p className="text-neutral-400 text-sm mb-4">No order selected for tracking.</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded"
        >
          Return Home
        </button>
      </div>
    );
  }

  const stepsOrder: OrderStatus[] = [
    'Order Placed',
    'Payment Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const currentStepIndex = stepsOrder.indexOf(order.status);

  return (
    <div className="min-h-screen py-10 bg-[#08090c] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('account')}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-300">
                LIVE SHIPMENT TRACKING
              </span>
              <h1 className="text-2xl font-brand font-bold uppercase tracking-wide">
                Order #{order.id}
              </h1>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 glass-panel text-xs text-neutral-300 hover:text-white rounded-lg transition-colors border border-white/10"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-amber-300' : ''} />
            <span className="font-mono">Refresh GPS</span>
          </button>
        </div>

        {/* Top Summary Banner */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 shadow-xl mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-[11px] font-mono uppercase text-neutral-400">Current Status</p>
            <p className="text-xl font-brand font-bold text-amber-300 mt-1">
              {order.status}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">Courier: {order.courier}</p>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase text-neutral-400">Estimated Delivery</p>
            <p className="text-xl font-bold font-mono text-white mt-1">
              {order.estimatedDelivery}
            </p>
            <p className="text-xs text-emerald-400 mt-0.5">On Schedule · Air Priority</p>
          </div>

          <div>
            <p className="text-[11px] font-mono uppercase text-neutral-400">Waybill / Tracking No.</p>
            <p className="text-base font-mono text-neutral-200 mt-1 font-semibold break-all">
              {order.trackingNumber}
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">Signed Handoff Required</p>
          </div>
        </div>

        {/* Detailed Timeline */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl mb-8">
          <h2 className="text-sm font-mono uppercase tracking-widest text-neutral-400 mb-6">
            Atelier Dispatch & Logistics Pipeline
          </h2>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {stepsOrder.map((stepName, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              const matchedTimelineStep = order.trackingTimeline?.find((s) => s.status === stepName);

              return (
                <div key={stepName} className="relative group">
                  {/* Status Circle Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-amber-400 text-black shadow-md'
                        : isCurrent
                        ? 'bg-amber-400 text-black ring-4 ring-amber-400/20 animate-pulse'
                        : 'bg-neutral-900 border border-white/20 text-neutral-600'
                    }`}
                  >
                    {isPast || isCurrent ? <CheckCircle2 size={14} /> : <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <h3
                        className={`text-sm sm:text-base font-semibold tracking-wide ${
                          isCurrent
                            ? 'text-amber-300 font-bold'
                            : isPast
                            ? 'text-white'
                            : 'text-neutral-500'
                        }`}
                      >
                        {stepName}
                      </h3>
                      <span className="text-xs font-mono text-neutral-400">
                        {matchedTimelineStep?.date || (isFuture ? 'Pending' : 'Completed')}
                      </span>
                    </div>

                    <p className={`text-xs ${isPast || isCurrent ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {matchedTimelineStep?.description || `Logistics stage: ${stepName}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Destination Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Destination */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px] uppercase tracking-wider">
              <MapPin size={14} />
              <span>Delivery Destination</span>
            </div>
            <p className="font-semibold text-white">{order.address.fullName}</p>
            <p className="text-neutral-300 font-light">
              {order.address.houseFlat}, {order.address.street}
            </p>
            <p className="text-neutral-300 font-light">
              {order.address.city}, {order.address.state} - {order.address.pincode}
            </p>
            <p className="text-neutral-400 font-mono mt-1">Recipient Mobile: {order.address.mobile}</p>
          </div>

          {/* Garments in this dispatch */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-[11px] uppercase tracking-wider">
              <Package size={14} />
              <span>Dispatched Garments</span>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-neutral-300">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt="" className="w-8 h-10 object-cover rounded" />
                    <span>
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    {formatINR(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
