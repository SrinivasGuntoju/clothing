import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  Check,
  ChevronRight,
  ArrowLeft,
  Lock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Address, Order } from '../../types';
import { formatINR } from '../../utils/currency';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    user,
    cartSubtotal,
    cartTotalDiscount,
    cartTotal,
    appliedCoupon,
    createOrder,
    setActiveView,
  } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Contact
  const [contactName, setContactName] = useState(
    user ? `${user.firstName} ${user.lastName}` : ''
  );
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactMobile, setContactMobile] = useState(user?.mobile || '');

  // Step 2: Delivery Address
  const defaultAddr = user?.savedAddresses?.[0];
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>(
    defaultAddr?.id || 'new'
  );
  const [houseFlat, setHouseFlat] = useState(defaultAddr?.houseFlat || '');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [area, setArea] = useState(defaultAddr?.area || '');
  const [city, setCity] = useState(defaultAddr?.city || 'Mumbai');
  const [state, setState] = useState(defaultAddr?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '400013');
  const [landmark, setLandmark] = useState(defaultAddr?.landmark || '');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Step 3: Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard' | 'Express'>('Express');

  // Step 4: Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('alexander@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [cardName, setCardName] = useState('Alexander Wright');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  // Calculate dynamic delivery dates
  const now = new Date();
  const expressDate = new Date(now);
  expressDate.setDate(now.getDate() + 2);
  const standardDate = new Date(now);
  standardDate.setDate(now.getDate() + 4);

  const dateOpts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const expressDateStr = expressDate.toLocaleDateString('en-US', dateOpts);
  const standardDateStr = standardDate.toLocaleDateString('en-US', dateOpts);

  const shippingFee = deliveryMethod === 'Express' ? 199 : 0;
  const grandTotal = cartTotal + shippingFee;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalPayment = async () => {
    setIsProcessing(true);
    setProcessingStage('Encrypting credentials via TLS 1.3...');
    await new Promise((r) => setTimeout(r, 600));

    setProcessingStage('Authorizing transaction through payment gateway...');
    await new Promise((r) => setTimeout(r, 800));

    setProcessingStage('Allocating atelier inventory and booking courier...');
    await new Promise((r) => setTimeout(r, 600));

    const finalAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName: contactName,
      mobile: contactMobile,
      houseFlat,
      street,
      area,
      city,
      state,
      pincode,
      landmark,
      addressType,
    };

    try {
      await createOrder({
        address: finalAddress,
        deliveryMethod,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      });
      setIsProcessing(false);
      setActiveView('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setIsProcessing(false);
      alert('Order processing encountered an error. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#08090c] text-white">
        <h2 className="text-2xl font-brand font-bold mb-2">No Items in Checkout</h2>
        <p className="text-xs text-neutral-400 mb-6">Please select garments to proceed to payment.</p>
        <button
          onClick={() => setActiveView('catalog')}
          className="px-6 py-3 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-[#08090c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Flow Breadcrumb */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400">
            {[
              { num: 1, label: 'Contact' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Delivery' },
              { num: 4, label: 'Payment' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    step === s.num
                      ? 'bg-amber-400 text-black'
                      : step > s.num
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {step > s.num ? <Check size={12} /> : s.num}
                </span>
                <span className={step === s.num ? 'text-white font-bold' : ''}>{s.label}</span>
                {s.num < 4 && <ChevronRight size={14} className="text-neutral-600 hidden sm:inline" />}
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Grid: Form Left, Order Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Checkout Form Module (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
            {/* STEP 1: CONTACT */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                    STEP 1 OF 4
                  </span>
                  <h3 className="text-xl font-brand font-bold text-white mt-1">
                    Contact Information
                  </h3>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 mb-1 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Alexander Wright"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1 font-medium">
                      Email Address (for order tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="alexander@venaro.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1 font-medium">
                      Mobile Number (for delivery updates) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactMobile}
                      onChange={(e) => setContactMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/40"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Continue to Delivery Address
                </button>
              </form>
            )}

            {/* STEP 2: ADDRESS */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                      STEP 2 OF 4
                    </span>
                    <h3 className="text-xl font-brand font-bold text-white mt-1">
                      Delivery Address
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                </div>

                {/* Saved Address Quick Selector if available */}
                {user?.savedAddresses && user.savedAddresses.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <label className="block text-[11px] font-mono uppercase text-neutral-400">
                      Select Saved Address
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {user.savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => {
                            setSelectedSavedAddrId(addr.id);
                            setHouseFlat(addr.houseFlat);
                            setStreet(addr.street);
                            setArea(addr.area);
                            setCity(addr.city);
                            setState(addr.state);
                            setPincode(addr.pincode);
                            setLandmark(addr.landmark || '');
                            setAddressType(addr.addressType);
                          }}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedSavedAddrId === addr.id
                              ? 'border-amber-400 bg-amber-400/10 text-white'
                              : 'border-white/10 text-neutral-400 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span>{addr.addressType}</span>
                            {selectedSavedAddrId === addr.id && (
                              <Check size={14} className="text-amber-300" />
                            )}
                          </div>
                          <p className="line-clamp-2 text-neutral-300">
                            {addr.houseFlat}, {addr.street}, {addr.city} - {addr.pincode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Address Form Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Flat / Villa / House *</label>
                    <input
                      type="text"
                      required
                      value={houseFlat}
                      onChange={(e) => setHouseFlat(e.target.value)}
                      placeholder="Penthouse 14B, The Lumina"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Street / Building *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Senapati Bapat Marg"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Area / Locality *</label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Lower Parel"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mumbai"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Postal Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="400013"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Opp. Palladium Mall"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white"
                    />
                  </div>
                </div>

                {/* Address Type Tag */}
                <div>
                  <label className="block text-xs text-neutral-300 mb-1 font-medium">
                    Address Label
                  </label>
                  <div className="flex gap-3">
                    {(['Home', 'Work', 'Other'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAddressType(t)}
                        className={`px-4 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                          addressType === t
                            ? 'bg-amber-400 text-black font-semibold border-amber-400'
                            : 'border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Continue to Delivery Method
                </button>
              </form>
            )}

            {/* STEP 3: DELIVERY METHOD */}
            {step === 3 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                      STEP 3 OF 4
                    </span>
                    <h3 className="text-xl font-brand font-bold text-white mt-1">
                      Select Delivery Method
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Express Delivery */}
                  <label
                    onClick={() => setDeliveryMethod('Express')}
                    className={`block p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryMethod === 'Express'
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles size={16} className="text-amber-300" />
                        <div>
                          <p className="font-semibold text-white text-sm">
                            VÉNARO Priority Air Express
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            Guaranteed delivery by <strong>{expressDateStr}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-amber-300 font-bold">₹199</span>
                    </div>
                  </label>

                  {/* Standard Delivery */}
                  <label
                    onClick={() => setDeliveryMethod('Standard')}
                    className={`block p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      deliveryMethod === 'Standard'
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck size={16} className="text-emerald-400" />
                        <div>
                          <p className="font-semibold text-white text-sm">
                            Standard Secure Shipping
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            Estimated delivery by <strong>{standardDateStr}</strong>
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold uppercase">
                        Complimentary
                      </span>
                    </div>
                  </label>
                </div>

                <div className="p-3.5 glass-panel rounded-lg border border-white/5 text-[11px] text-neutral-400 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-300 shrink-0" />
                  <span>
                    All garments are dispatched in temper-evident protective wooden cedar boxes with personal hand-wax seal.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                >
                  Proceed to Secure Payment
                </button>
              </form>
            )}

            {/* STEP 4: PAYMENT */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                      STEP 4 OF 4
                    </span>
                    <h3 className="text-xl font-brand font-bold text-white mt-1">
                      Payment Architecture
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <ArrowLeft size={13} />
                    <span>Back</span>
                  </button>
                </div>

                {/* Payment Methods Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Card', label: 'Card (Encrypted)', icon: CreditCard },
                    { id: 'NetBanking', label: 'Net Banking', icon: Building },
                    { id: 'COD', label: 'Cash on Hand', icon: Banknote },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          paymentMethod === pm.id
                            ? 'border-amber-400 bg-amber-400/15 text-white font-semibold'
                            : 'border-white/10 text-neutral-400 hover:bg-white/5'
                        }`}
                      >
                        <Icon size={18} className={paymentMethod === pm.id ? 'text-amber-300' : ''} />
                        <span className="text-[11px]">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Details Views */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 glass-panel rounded-xl border border-white/10 space-y-3 text-xs">
                    <p className="font-semibold text-white">Instant UPI Settlement</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="flex-1 px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-amber-400/20 text-amber-300 rounded border border-amber-400/30 font-mono text-[11px]"
                      >
                        Verify UPI
                      </button>
                    </div>
                    <div className="p-3 bg-neutral-900/60 rounded flex items-center justify-between text-[11px] text-neutral-400">
                      <span>Supported: Google Pay, PhonePe, Paytm, CRED</span>
                      <span className="text-emerald-400">Zero Gateway Surcharge</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="p-4 glass-panel rounded-xl border border-white/10 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-white">Credit / Debit Card</p>
                      <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                        <Lock size={12} className="text-emerald-400" />
                        <span>Tokenized & Encrypted</span>
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NetBanking' && (
                  <div className="p-4 glass-panel rounded-xl border border-white/10 space-y-3 text-xs">
                    <p className="font-semibold text-white">Select Bank</p>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-900 border border-white/10 rounded text-white"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="State Bank of India">State Bank of India</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-4 glass-panel rounded-xl border border-white/10 space-y-2 text-xs">
                    <p className="font-semibold text-white">Cash on Hand Verification</p>
                    <p className="text-neutral-400 text-[11px]">
                      An automated verification SMS will be sent to <strong>{contactMobile}</strong> prior to atelier dispatch. Please keep cash or dynamic UPI QR ready at doorstep delivery.
                    </p>
                  </div>
                )}

                {/* Final Order Trigger */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleFinalPayment}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{processingStage}</span>
                    </div>
                  ) : (
                    <span>Confirm Order · Pay {formatINR(grandTotal)}</span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-white/10 shadow-xl space-y-6">
            <h3 className="text-base font-brand font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Cart Preview List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="w-14 h-18 rounded overflow-hidden bg-neutral-900 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] font-mono text-neutral-400">
                        Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono text-white font-bold">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatINR(cartSubtotal)}</span>
              </div>
              {cartTotalDiscount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Atelier Privilege Code</span>
                  <span>-{formatINR(cartTotalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery ({deliveryMethod})</span>
                <span>{shippingFee === 0 ? 'COMPLIMENTARY' : formatINR(shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Integrated GST (5%)</span>
                <span>{formatINR(Math.round(cartSubtotal * 0.05))}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount (INR)</span>
                <span className="text-amber-300 font-bold">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-neutral-400 text-center font-mono">
              Protected by 256-bit SSL & PCI-DSS Tier 1 Architecture
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
