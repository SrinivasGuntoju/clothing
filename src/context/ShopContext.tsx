import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CollectionItem, CartItem, Order, User, Address, ProductSize, Coupon } from '../types';
import { PRODUCTS, COLLECTIONS, COUPONS, INITIAL_USER, INITIAL_ORDERS } from '../data/mockData';

interface ShopContextType {
  products: Product[];
  collections: CollectionItem[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  user: User | null;
  orders: Order[];
  activeOrder: Order | null;
  activeView: 'home' | 'catalog' | 'pdp' | 'cart' | 'checkout' | 'confirmation' | 'tracking' | 'account' | 'admin' | 'wishlist';
  selectedProductId: string | null;
  selectedCollection: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isAuthOpen: boolean;
  authMode: 'login' | 'signup';
  isSizeCalculatorOpen: boolean;
  appliedCoupon: { code: string; discountAmount: number; description: string } | null;
  showCinematicIntro: boolean;
  
  // Navigation & Views
  setActiveView: (view: ShopContextType['activeView']) => void;
  openPdp: (productId: string) => void;
  openCollection: (collectionSlug: string) => void;
  openCategory: (categoryName: string) => void;
  setShowCinematicIntro: (show: boolean) => void;

  // Cart operations
  addToCart: (product: Product, size: ProductSize, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  cartSubtotal: number;
  cartTotalDiscount: number;
  cartTotal: number;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Search & Modals
  setIsSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setIsAuthOpen: (open: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  setIsSizeCalculatorOpen: (open: boolean) => void;

  // Auth & User
  login: (emailOrMobile: string, pass: string) => Promise<boolean>;
  signup: (userData: Partial<User>, pass: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'customer' | 'admin') => void;
  updateUserPreferences: (prefs: User['sizePreferences']) => void;
  saveAddress: (addr: Address) => void;

  // Coupons
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Orders
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  trackOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], courier?: string, trackingNum?: string) => void;

  // Admin
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (product: Product) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [collections] = useState<CollectionItem[]>(COLLECTIONS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('venaro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('venaro_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1', 'prod-2'];
    }
  });
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [activeView, setActiveView] = useState<ShopContextType['activeView']>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-1');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isSizeCalculatorOpen, setIsSizeCalculatorOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; description: string } | null>(null);
  
  // Show intro only once per initial load unless triggered
  const [showCinematicIntro, setShowCinematicIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('venaro_intro_seen');
    } catch {
      return true;
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('venaro_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('venaro_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [wishlist]);

  // Load products from server if available
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Use static initial products
      });

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
          setActiveOrder(data[0]);
        }
      })
      .catch(() => {});
  }, []);

  const openPdp = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCollection = (collectionSlug: string) => {
    setSelectedCollection(collectionSlug);
    setSelectedCategory(null);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedCollection(null);
    setActiveView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, size: ProductSize, color: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size,
        color,
        quantity,
        category: product.category,
      };
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTotalDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const cartShippingFee = cartSubtotal > 2999 || cartSubtotal === 0 ? 0 : 199;
  const cartTotal = Math.max(0, cartSubtotal - cartTotalDiscount + cartShippingFee);

  const applyCoupon = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          description: data.description,
        });
        return { success: true, message: `Coupon ${data.code} applied! Saved ₹${data.discountAmount}` };
      } else {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
    } catch {
      // Local fallback
      const found = COUPONS.find((c) => c.code === trimmed);
      if (!found) return { success: false, message: 'Invalid coupon code' };
      if (cartSubtotal < found.minOrderValue) {
        return { success: false, message: `Minimum order value ₹${found.minOrderValue} required` };
      }
      const disc = found.discountPercent ? Math.round((cartSubtotal * found.discountPercent) / 100) : (found.flatDiscount || 0);
      setAppliedCoupon({ code: found.code, discountAmount: disc, description: found.description });
      return { success: true, message: `Applied ${found.code} (Saved ₹${disc})` };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const login = async (emailOrMobile: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrMobile, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthOpen(false);
        return true;
      }
    } catch {
      // Fallback local auth
    }
    const isAdmin = emailOrMobile.toLowerCase().includes('admin');
    setUser({
      ...INITIAL_USER,
      email: emailOrMobile,
      role: isAdmin ? 'admin' : 'customer',
      firstName: isAdmin ? 'VÉNARO' : 'Alexander',
    });
    setIsAuthOpen(false);
    return true;
  };

  const signup = async (userData: Partial<User>, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthOpen(false);
        return true;
      }
    } catch {
      // Fallback
    }
    const newUser: User = {
      id: `usr-${Date.now()}`,
      firstName: userData.firstName || 'Gentleman',
      lastName: userData.lastName || '',
      email: userData.email || '',
      mobile: userData.mobile || '',
      role: 'customer',
      savedAddresses: [],
    };
    setUser(newUser);
    setIsAuthOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setActiveView('home');
  };

  const switchRole = (role: 'customer' | 'admin') => {
    if (!user) return;
    setUser({ ...user, role });
  };

  const updateUserPreferences = (prefs: User['sizePreferences']) => {
    if (!user) return;
    setUser({ ...user, sizePreferences: { ...user.sizePreferences, ...prefs } });
  };

  const saveAddress = (addr: Address) => {
    if (!user) return;
    const exists = user.savedAddresses.some((a) => a.id === addr.id);
    let updated: Address[];
    if (exists) {
      updated = user.savedAddresses.map((a) => (a.id === addr.id ? addr : a));
    } else {
      updated = [addr, ...user.savedAddresses];
    }
    setUser({ ...user, savedAddresses: updated });
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          address: orderData.address,
          deliveryMethod: orderData.deliveryMethod,
          paymentMethod: orderData.paymentMethod,
          couponCode: appliedCoupon?.code,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const order = data.order;
        setOrders((prev) => [order, ...prev]);
        setActiveOrder(order);
        clearCart();
        return order;
      }
    } catch (e) {
      console.warn('API order failed, creating locally', e);
    }

    // Local fallback order
    const orderId = `VEN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartTotalDiscount,
      couponCode: appliedCoupon?.code,
      shippingFee: orderData.deliveryMethod === 'Express' ? 199 : 0,
      tax: Math.round(cartSubtotal * 0.05),
      total: cartTotal + (orderData.deliveryMethod === 'Express' ? 199 : 0),
      address: orderData.address || INITIAL_USER.savedAddresses[0],
      deliveryMethod: orderData.deliveryMethod || 'Standard',
      estimatedDelivery: orderData.deliveryMethod === 'Express' ? 'Within 48 Hours' : '3-4 Business Days',
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Payment Confirmed',
      trackingNumber: `VNR-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      courier: 'BlueDart Luxury Express',
      trackingTimeline: [
        { status: 'Order Placed', date: 'Just now', description: 'Order confirmed and verified.', completed: true },
        { status: 'Payment Confirmed', date: 'Just now', description: 'Payment verified successfully.', completed: true },
        { status: 'Processing', date: 'Scheduled', description: 'Atelier craftsmanship preparation.', completed: false },
        { status: 'Packed', date: 'Scheduled', description: 'Signature cedar gift presentation.', completed: false },
        { status: 'Shipped', date: 'Scheduled', description: 'Air express dispatch.', completed: false },
        { status: 'Out for Delivery', date: 'Scheduled', description: 'Local courier transfer.', completed: false },
        { status: 'Delivered', date: 'Scheduled', description: 'Handover with PIN code.', completed: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const trackOrder = (orderId: string) => {
    const found = orders.find((o) => o.id === orderId || o.trackingNumber === orderId);
    if (found) {
      setActiveOrder(found);
    }
    setActiveView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], courier?: string, trackingNum?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedTimeline = o.trackingTimeline.map((step) =>
          step.status === status ? { ...step, completed: true, date: 'Updated by Atelier' } : step
        );
        return {
          ...o,
          status,
          courier: courier || o.courier,
          trackingNumber: trackingNum || o.trackingNumber,
          trackingTimeline: updatedTimeline,
        };
      })
    );

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, courier, trackingNumber: trackingNum }),
      });
    } catch {}
  };

  const addProduct = (p: Product) => {
    setProducts((prev) => [p, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        collections,
        cart,
        wishlist,
        user,
        orders,
        activeOrder,
        activeView,
        selectedProductId,
        selectedCollection,
        selectedCategory,
        searchQuery,
        isSearchOpen,
        isCartOpen,
        isAuthOpen,
        authMode,
        isSizeCalculatorOpen,
        appliedCoupon,
        showCinematicIntro,
        setActiveView,
        openPdp,
        openCollection,
        openCategory,
        setShowCinematicIntro,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        setIsCartOpen,
        cartSubtotal,
        cartTotalDiscount,
        cartTotal,
        toggleWishlist,
        isInWishlist,
        setIsSearchOpen,
        setSearchQuery,
        setIsAuthOpen,
        setAuthMode,
        setIsSizeCalculatorOpen,
        login,
        signup,
        logout,
        switchRole,
        updateUserPreferences,
        saveAddress,
        applyCoupon,
        removeCoupon,
        createOrder,
        trackOrder,
        updateOrderStatus,
        addProduct,
        deleteProduct,
        updateProduct,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
