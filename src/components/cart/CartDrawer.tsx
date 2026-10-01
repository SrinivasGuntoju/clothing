import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/currency';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotalDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput);
    setCouponFeedback({ success: res.success, msg: res.message });
    if (res.success) setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#08090c] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl p-6 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-300" />
            <h3 className="text-base font-brand font-bold text-white uppercase tracking-wider">
              Atelier Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close Shopping Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="py-3 border-b border-white/10 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between items-center text-neutral-300">
            <span>
              {remainingForFreeShipping > 0
                ? `Add ₹${remainingForFreeShipping.toLocaleString()} more for Free Express Shipping`
                : 'Complimentary Express Shipping Unlocked'}
            </span>
            <span className="text-amber-300 font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <ShoppingBag size={42} className="text-neutral-600" />
              <p className="text-sm font-semibold text-white">Your Shopping Bag is Empty</p>
              <p className="text-xs text-neutral-400 max-w-xs font-light">
                Discover modern luxury silhouettes crafted with refined materials.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('catalog');
                }}
                className="mt-2 px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-3.5 rounded-xl border border-white/10 flex gap-4 relative group"
              >
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between py-0.5 text-xs">
                  <div>
                    <h4 className="font-semibold text-white text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      Size: <span className="text-amber-300">{item.size}</span> · Color: {item.color}
                    </p>
                    <p className="font-mono text-white font-bold mt-1 tabular-nums">
                      {formatINR(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center glass-panel rounded border border-white/10 h-7 px-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Coupon + Summary + Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-4">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-amber-400/10 border border-amber-400/30 rounded-lg text-xs">
                  <div className="flex items-center gap-2 text-amber-200">
                    <Tag size={13} className="text-amber-400" />
                    <span>
                      Code <strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.discountAmount.toLocaleString()})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-white text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. WELCOME20)"
                    className="flex-1 px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 uppercase font-mono focus:outline-none focus:border-amber-400/40"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-lg transition-colors uppercase cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] mt-1.5 ${
                    couponFeedback.success ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {couponFeedback.msg}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-300 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(cartSubtotal)}</span>
              </div>
              {cartTotalDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Atelier Discount</span>
                  <span>-{formatINR(cartTotalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{cartSubtotal > 2999 ? 'COMPLIMENTARY' : formatINR(199)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10 font-mono">
                <span>Total (INR)</span>
                <span className="text-amber-300">{formatINR(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-white/10"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
