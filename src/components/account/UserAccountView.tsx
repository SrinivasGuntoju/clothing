import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Ruler,
  Tag,
  HelpCircle,
  LogOut,
  Shield,
  Plus,
  Trash2,
  Check,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Address } from '../../types';
import { formatINR } from '../../utils/currency';

type AccountTab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'sizes' | 'coupons' | 'support';

export const UserAccountView: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    products,
    logout,
    trackOrder,
    openPdp,
    toggleWishlist,
    saveAddress,
    switchRole,
    updateUserPreferences,
    setActiveView,
  } = useShop();

  const [activeTab, setActiveTab] = useState<AccountTab>('orders');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // New address state
  const [newFullName, setNewFullName] = useState(user ? `${user.firstName} ${user.lastName}` : '');
  const [newMobile, setNewMobile] = useState(user?.mobile || '');
  const [newFlat, setNewFlat] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newState, setNewState] = useState('Maharashtra');
  const [newPincode, setNewPincode] = useState('400013');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Size preference form state
  const [prefHeight, setPrefHeight] = useState(user?.sizePreferences?.height || 180);
  const [prefWeight, setPrefWeight] = useState(user?.sizePreferences?.weight || 75);
  const [prefChest, setPrefChest] = useState(user?.sizePreferences?.chest || 40);
  const [prefWaist, setPrefWaist] = useState(user?.sizePreferences?.waist || 32);
  const [prefFit, setPrefFit] = useState(user?.sizePreferences?.preferredFit || 'Regular Fit');
  const [sizeSavedMsg, setSizeSavedMsg] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-white text-center bg-[#08090c]">
        <h2 className="text-2xl font-brand font-bold mb-2">Atelier Sign In Required</h2>
        <p className="text-xs text-neutral-400 mb-6">Please log in to view your orders and client profile.</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded"
        >
          Return Home
        </button>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      fullName: newFullName,
      mobile: newMobile,
      houseFlat: newFlat,
      street: newStreet,
      area: '',
      city: newCity,
      state: newState,
      pincode: newPincode,
      addressType: newType,
    };
    saveAddress(newAddr);
    setShowAddAddress(false);
    setNewFlat('');
    setNewStreet('');
  };

  const handleSaveSizePrefs = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserPreferences({
      height: prefHeight,
      weight: prefWeight,
      chest: prefChest,
      waist: prefWaist,
      preferredFit: prefFit as any,
    });
    setSizeSavedMsg(true);
    setTimeout(() => setSizeSavedMsg(false), 2500);
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package, badge: orders.length },
    { id: 'profile', label: 'Client Profile', icon: User },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlist.length },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'sizes', label: 'Smart Sizing AI', icon: Ruler },
    { id: 'coupons', label: 'Privilege Vouchers', icon: Tag },
    { id: 'support', label: 'Concierge & Help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen py-10 bg-[#08090c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-black flex items-center justify-center text-xl font-bold font-brand shadow-lg">
              {user.firstName[0]}
              {user.lastName[0] || ''}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-brand font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                  {user.role === 'admin' ? 'Atelier Admin' : 'VIP Client'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{user.email} · {user.mobile}</p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => switchRole(user.role === 'admin' ? 'customer' : 'admin')}
              className="px-3.5 py-2 glass-panel text-xs text-neutral-300 hover:text-white rounded-lg transition-colors border border-white/10 flex items-center gap-1.5 font-mono"
            >
              <Shield size={14} className="text-amber-300" />
              <span>Toggle Role: {user.role === 'admin' ? 'Customer' : 'Admin'}</span>
            </button>
            {user.role === 'admin' && (
              <button
                onClick={() => setActiveView('admin')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-lg"
              >
                Go to Admin Console
              </button>
            )}
            <button
              onClick={logout}
              className="p-2 text-neutral-400 hover:text-red-400 glass-panel rounded-lg border border-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (3 Cols) */}
          <aside className="lg:col-span-3 glass-panel rounded-2xl p-3 border border-white/10 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AccountTab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white text-black shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={activeTab === tab.id ? 'text-black' : 'text-neutral-400'} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        activeTab === tab.id ? 'bg-black text-white' : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Tab Panel (9 Cols) */}
          <main className="lg:col-span-9 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl min-h-[480px]">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-brand font-bold uppercase tracking-wide">
                      Order History ({orders.length})
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Track past dispatches, view invoices, or schedule concierge returns.
                    </p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-xs">
                    No orders placed yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-5 rounded-xl bg-neutral-900/60 border border-white/10 space-y-4 hover:border-amber-400/30 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3 text-xs">
                          <div>
                            <span className="font-mono text-white font-bold text-sm">
                              #{order.id}
                            </span>
                            <span className="text-neutral-400 font-mono text-[11px] ml-3">
                              Placed on {order.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                              {order.status}
                            </span>
                            <span className="font-mono text-white font-bold">
                              {formatINR(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-3 items-center">
                              <img src={item.image} alt="" className="w-12 h-14 object-cover rounded bg-neutral-800" />
                              <div>
                                <h4 className="font-semibold text-white line-clamp-1">{item.name}</h4>
                                <p className="text-[11px] font-mono text-neutral-400">
                                  Size: {item.size} · Qty: {item.quantity} · {formatINR(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Tracking CTA */}
                        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/5 text-xs">
                          <span className="text-[11px] font-mono text-neutral-400">
                            Courier: {order.courier} (AWB: {order.trackingNumber})
                          </span>
                          <button
                            onClick={() => trackOrder(order.id)}
                            className="px-4 py-2 bg-white text-black font-semibold uppercase tracking-wider rounded text-[11px] hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck size={13} />
                            <span>Track Shipment</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6 text-xs max-w-lg">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-brand font-bold uppercase tracking-wide">
                    Personal Details
                  </h2>
                  <p className="text-neutral-400 mt-0.5">Manage your identity and atelier credentials.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">First Name</label>
                    <input
                      type="text"
                      disabled
                      value={user.firstName}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      disabled
                      value={user.lastName}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Registered Email</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-neutral-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Mobile Contact</label>
                    <input
                      type="tel"
                      disabled
                      value={user.mobile}
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-neutral-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-brand font-bold uppercase tracking-wide">
                    Saved Pieces ({wishlistProducts.length})
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Your personal luxury curation ready for atelier selection.
                  </p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="py-12 text-center text-neutral-400 text-xs">
                    Your wishlist is currently empty.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistProducts.map((p) => (
                      <div
                        key={p.id}
                        className="glass-panel rounded-xl overflow-hidden border border-white/10 flex flex-col justify-between p-3 space-y-3"
                      >
                        <div
                          onClick={() => openPdp(p.id)}
                          className="aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 cursor-pointer"
                        >
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-xs line-clamp-1">{p.name}</h4>
                          <p className="font-mono text-white font-bold text-xs mt-1">
                            {formatINR(p.price)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openPdp(p.id)}
                            className="flex-1 py-1.5 bg-white text-black font-semibold text-[11px] uppercase tracking-wider rounded hover:bg-neutral-200"
                          >
                            View
                          </button>
                          <button
                            onClick={() => toggleWishlist(p.id)}
                            className="p-1.5 glass-panel text-neutral-400 hover:text-red-400 rounded border border-white/10"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h2 className="text-xl font-brand font-bold uppercase tracking-wide">
                      Saved Delivery Addresses
                    </h2>
                    <p className="text-neutral-400 mt-0.5">Manage your home, atelier, and office destinations.</p>
                  </div>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="px-3.5 py-2 bg-white text-black font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Address</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleSaveNewAddress} className="glass-panel p-5 rounded-xl border border-white/10 space-y-3">
                    <h3 className="font-semibold text-white text-sm">Add New Address</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Mobile</label>
                        <input
                          type="text"
                          required
                          value={newMobile}
                          onChange={(e) => setNewMobile(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Flat / Building / House</label>
                      <input
                        type="text"
                        required
                        value={newFlat}
                        onChange={(e) => setNewFlat(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-400 mb-1">Street & Area</label>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-400 mb-1">Pincode</label>
                        <input
                          type="text"
                          required
                          value={newPincode}
                          onChange={(e) => setNewPincode(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-amber-400 text-black font-bold uppercase rounded cursor-pointer"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 border border-white/10 text-neutral-400 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-xl glass-panel border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white uppercase font-mono tracking-wider">
                          {addr.addressType}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-white">{addr.fullName}</p>
                      <p className="text-neutral-400 font-light">
                        {addr.houseFlat}, {addr.street}, {addr.city} - {addr.pincode}
                      </p>
                      <p className="text-neutral-500 font-mono">Mobile: {addr.mobile}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SIZING PREFERENCES TAB */}
            {activeTab === 'sizes' && (
              <form onSubmit={handleSaveSizePrefs} className="space-y-6 text-xs max-w-lg">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-brand font-bold uppercase tracking-wide">
                    Smart Size Intelligence
                  </h2>
                  <p className="text-neutral-400 mt-0.5">
                    Your anatomical parameters auto-populate sizing recommendations across the catalog.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Height (cm): {prefHeight}</label>
                    <input
                      type="range"
                      min="160"
                      max="205"
                      value={prefHeight}
                      onChange={(e) => setPrefHeight(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Weight (kg): {prefWeight}</label>
                    <input
                      type="range"
                      min="50"
                      max="125"
                      value={prefWeight}
                      onChange={(e) => setPrefWeight(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1">Chest (inches): {prefChest}"</label>
                    <input
                      type="range"
                      min="34"
                      max="52"
                      value={prefChest}
                      onChange={(e) => setPrefChest(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">Waist (inches): {prefWaist}"</label>
                    <input
                      type="range"
                      min="26"
                      max="44"
                      value={prefWaist}
                      onChange={(e) => setPrefWaist(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-2">Preferred Fit Silhouette</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Slim Fit', 'Regular Fit', 'Oversized'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setPrefFit(f as any)}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          prefFit === f
                            ? 'bg-amber-400 text-black font-bold border-amber-400'
                            : 'border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {sizeSavedMsg && (
                  <p className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                    <Check size={13} />
                    <span>Size calibration saved to your Atelier Profile.</span>
                  </p>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black font-semibold uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Save Sizing Profile
                </button>
              </form>
            )}

            {/* COUPONS & OFFERS TAB */}
            {activeTab === 'coupons' && (
              <div className="space-y-6 text-xs">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-brand font-bold uppercase tracking-wide">
                    Privilege Vouchers & Codes
                  </h2>
                  <p className="text-neutral-400 mt-0.5">Exclusive atelier rewards for your wardrobe acquisition.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      code: 'WELCOME20',
                      desc: '20% OFF your first luxury purchase',
                      cond: 'Min Order: ₹2,000 · Valid through Dec 2026',
                    },
                    {
                      code: 'VENARO10',
                      desc: '10% OFF all seasonal outerwear & tailoring',
                      cond: 'Min Order: ₹1,500 · Unlimited use',
                    },
                    {
                      code: 'LUXURY500',
                      desc: 'Flat ₹500 discount on cart total',
                      cond: 'Min Order: ₹4,000 · One-time redemption',
                    },
                  ].map((c) => (
                    <div
                      key={c.code}
                      className="p-5 rounded-xl border border-amber-400/30 bg-amber-400/5 space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg font-bold text-amber-300">
                          {c.code}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded">
                          ACTIVE
                        </span>
                      </div>
                      <p className="font-semibold text-white">{c.desc}</p>
                      <p className="text-neutral-400 text-[11px]">{c.cond}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6 text-xs max-w-lg">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-xl font-brand font-bold uppercase tracking-wide">
                    Atelier Concierge
                  </h2>
                  <p className="text-neutral-400 mt-0.5">Direct client relationship assistance.</p>
                </div>

                <div className="space-y-3 text-neutral-300">
                  <div className="p-4 glass-panel rounded-xl border border-white/10 space-y-1">
                    <p className="font-semibold text-white">Private Styling & Sizing Inquiries</p>
                    <p className="text-neutral-400">concierge@venaro.com</p>
                    <p className="text-[11px] text-amber-300">Hours: Monday to Saturday, 9 AM – 9 PM IST</p>
                  </div>
                  <div className="p-4 glass-panel rounded-xl border border-white/10 space-y-1">
                    <p className="font-semibold text-white">Direct Line (Mumbai Atelier)</p>
                    <p className="text-neutral-400">+91 (022) 8941 2026</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
