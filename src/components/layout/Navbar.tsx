import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Shield, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    cart,
    wishlist,
    user,
    setActiveView,
    openCategory,
    openCollection,
    setIsSearchOpen,
    setIsCartOpen,
    setIsAuthOpen,
    setAuthMode,
    activeView,
    switchRole,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navCategories = [
    { label: 'New Arrivals', action: () => openCollection('new-arrivals') },
    { label: 'Bandhgalas', action: () => openCategory('Bandhgalas') },
    { label: 'Sherwanis', action: () => openCategory('Sherwanis') },
    { label: 'Kurta Sets', action: () => openCategory('Kurta Sets') },
    { label: 'Indo-Western', action: () => openCategory('Indo-Western') },
    { label: 'Jackets & Coats', action: () => openCategory('Jackets') },
    { label: 'Catalog', action: () => { setActiveView('catalog'); } },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090c]/85 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl font-brand tracking-[0.25em] text-white hover:text-amber-200 transition-colors cursor-pointer select-none font-bold"
          >
            VÉNARO
          </button>
        </div>

        {/* Zone 2: Clean 4–6 text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-neutral-300">
          {navCategories.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="hover:text-amber-200 transition-colors relative py-1 cursor-pointer group whitespace-nowrap"
            >
              <span>{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-300 transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions (Search, Wishlist, Cart, Account) */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Indian Rupee Currency Indicator */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900/80 border border-white/10 text-[11px] font-mono text-amber-300 shadow-sm">
            <span className="font-bold text-amber-400">₹</span>
            <span className="text-neutral-300">INR</span>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-neutral-300 hover:text-white transition-colors p-1.5 cursor-pointer"
            aria-label="Search Catalog"
            title="Search (⌘K)"
          >
            <Search size={18} />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setActiveView('wishlist')}
            className="text-neutral-300 hover:text-white transition-colors p-1.5 relative cursor-pointer"
            aria-label="Wishlist"
            title="Wishlist"
          >
            <Heart size={18} className={wishlist.length > 0 ? 'text-amber-300' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-neutral-300 hover:text-white transition-colors p-1.5 relative cursor-pointer"
            aria-label="Shopping Bag"
            title="Shopping Bag"
          >
            <ShoppingBag size={18} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Account / Admin Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                if (user) {
                  setAccountMenuOpen(!accountMenuOpen);
                } else {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }
              }}
              className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors p-1.5 cursor-pointer"
              aria-label="User Account"
            >
              <User size={18} />
              {user && (
                <span className="hidden xl:inline text-xs font-mono text-neutral-400">
                  {user.firstName}
                </span>
              )}
            </button>

            {/* Account Quick Dropdown */}
            {accountMenuOpen && user && (
              <div
                className="absolute right-0 mt-2 w-56 glass-panel rounded-xl py-2 shadow-2xl z-50 border border-white/10 divide-y divide-white/5"
                onMouseLeave={() => setAccountMenuOpen(false)}
              >
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                  <span className="mt-1 inline-block text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    {user.role === 'admin' ? 'Atelier Admin' : 'VIP Client'}
                  </span>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveView('account');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Client Dashboard & Orders
                  </button>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setActiveView('admin');
                        setAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-amber-300 hover:text-amber-200 hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                      <span>Admin Management</span>
                      <Shield size={12} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      switchRole(user.role === 'admin' ? 'customer' : 'admin');
                    }}
                    className="w-full text-left px-4 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5 transition-colors font-mono text-[11px]"
                  >
                    Switch to {user.role === 'admin' ? 'Customer' : 'Admin Demo'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-300 hover:text-white p-1.5"
            aria-label="Toggle Mobile Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-6 py-6 animate-fadeIn">
          <nav className="flex flex-col gap-4 text-sm uppercase tracking-wider font-medium">
            {navCategories.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between text-left py-2 border-b border-white/5 text-neutral-300 hover:text-amber-200"
              >
                <span>{item.label}</span>
                <ChevronRight size={14} className="text-neutral-500" />
              </button>
            ))}
            <button
              onClick={() => {
                setActiveView('wishlist');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between text-left py-2 border-b border-white/5 text-neutral-300"
            >
              <span>Wishlist ({wishlist.length})</span>
              <Heart size={14} className="text-neutral-500" />
            </button>
            <button
              onClick={() => {
                if (user) {
                  setActiveView('account');
                } else {
                  setIsAuthOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between text-left py-2 text-neutral-300"
            >
              <span>{user ? 'My Account' : 'Sign In / Register'}</span>
              <User size={14} className="text-neutral-500" />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
