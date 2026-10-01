import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, COLLECTIONS, COUPONS, INITIAL_ORDERS, INITIAL_USER } from './src/data/mockData.ts';
import { Order, Product, User } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory persistent database store
let productsDatabase: Product[] = [...PRODUCTS];
let ordersDatabase: Order[] = [...INITIAL_ORDERS];
let usersDatabase: User[] = [{ ...INITIAL_USER }];

// ----------------- API ROUTES -----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'VÉNARO', timestamp: new Date().toISOString() });
});

// Products: List, Search, Filter, Sort
app.get('/api/products', (req, res) => {
  const { category, collection, search, minPrice, maxPrice, sort, fit } = req.query;

  let results = [...productsDatabase];

  if (category && category !== 'All') {
    results = results.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (collection && collection !== 'All') {
    results = results.filter(
      (p) => p.collection.toLowerCase().replace(/\s+/g, '-') === String(collection).toLowerCase().replace(/\s+/g, '-')
    );
  }

  if (fit && fit !== 'All') {
    results = results.filter((p) => p.fit === fit);
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  // Sorting
  if (sort === 'price-asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    results.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    results.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  res.json({ products: results, count: results.length });
});

// Single Product
app.get('/api/products/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const product = productsDatabase.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Collections
app.get('/api/collections', (req, res) => {
  res.json(COLLECTIONS);
});

// Coupons validation
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Coupon code required' });
  }
  const coupon = COUPONS.find((c) => c.code.toUpperCase() === String(code).toUpperCase().trim());
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid or expired coupon code' });
  }

  const orderVal = Number(subtotal) || 0;
  if (orderVal < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString()}`,
    });
  }

  let discountAmount = 0;
  if (coupon.discountPercent) {
    discountAmount = Math.round((orderVal * coupon.discountPercent) / 100);
  } else if (coupon.flatDiscount) {
    discountAmount = coupon.flatDiscount;
  }

  res.json({
    valid: true,
    code: coupon.code,
    description: coupon.description,
    discountAmount,
  });
});

// Pincode Delivery Availability Checker
app.get('/api/pincode/check', (req, res) => {
  const { pincode } = req.query;
  const pin = String(pincode || '').trim();

  if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit postal code' });
  }

  // Dynamic delivery date calculation
  const now = new Date();
  const expressDate = new Date(now);
  expressDate.setDate(now.getDate() + 2);

  const standardDate = new Date(now);
  standardDate.setDate(now.getDate() + 4);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' };

  let hub = 'Mumbai Metro Hub';
  if (pin.startsWith('11') || pin.startsWith('12') || pin.startsWith('20')) hub = 'Delhi NCR Hub';
  if (pin.startsWith('56') || pin.startsWith('57')) hub = 'Bengaluru Hub';
  if (pin.startsWith('60') || pin.startsWith('61')) hub = 'Chennai Hub';
  if (pin.startsWith('70') || pin.startsWith('71')) hub = 'Kolkata Hub';

  res.json({
    available: true,
    pincode: pin,
    hub,
    standardDelivery: {
      date: standardDate.toLocaleDateString('en-US', options),
      days: '3-4 business days',
      fee: 0,
      label: 'Free Standard Delivery',
    },
    expressDelivery: {
      date: expressDate.toLocaleDateString('en-US', options),
      days: '1-2 business days',
      fee: 199,
      label: 'VÉNARO Priority Air Courier',
      available: true,
    },
    codAvailable: true,
  });
});

// Orders: Create with Server-side Price & Inventory Verification
app.post('/api/orders', (req, res) => {
  const { items, address, deliveryMethod, paymentMethod, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  if (!address || !address.fullName || !address.pincode || !address.mobile) {
    return res.status(400).json({ error: 'Complete delivery address is required' });
  }

  // Server-side calculation
  let subtotal = 0;
  for (const item of items) {
    const verifiedProduct = productsDatabase.find((p) => p.id === item.productId);
    if (!verifiedProduct) {
      return res.status(400).json({ error: `Product not recognized: ${item.name}` });
    }
    subtotal += verifiedProduct.price * item.quantity;
  }

  let discount = 0;
  if (couponCode) {
    const coupon = COUPONS.find((c) => c.code.toUpperCase() === String(couponCode).toUpperCase().trim());
    if (coupon && subtotal >= coupon.minOrderValue) {
      if (coupon.discountPercent) {
        discount = Math.round((subtotal * coupon.discountPercent) / 100);
      } else if (coupon.flatDiscount) {
        discount = coupon.flatDiscount;
      }
    }
  }

  const shippingFee = deliveryMethod === 'Express' ? 199 : 0;
  const tax = Math.round((subtotal - discount) * 0.05); // 5% GST
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  const orderId = `VEN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const now = new Date();
  const estDate = new Date(now);
  estDate.setDate(now.getDate() + (deliveryMethod === 'Express' ? 2 : 4));
  const estimatedDelivery = estDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const newOrder: Order = {
    id: orderId,
    date: now.toISOString().split('T')[0],
    items,
    subtotal,
    discount,
    couponCode: couponCode || undefined,
    shippingFee,
    tax,
    total,
    address,
    deliveryMethod: deliveryMethod || 'Standard',
    estimatedDelivery,
    paymentMethod: paymentMethod || 'UPI',
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
    status: 'Payment Confirmed',
    trackingNumber: `VNR-${deliveryMethod === 'Express' ? 'EXP' : 'STD'}-${Math.floor(1000000 + Math.random() * 9000000)}`,
    courier: deliveryMethod === 'Express' ? 'BlueDart Luxury Express' : 'Delhivery Premium Surface',
    trackingTimeline: [
      {
        status: 'Order Placed',
        date: 'Just now',
        description: 'Order details recorded and validated.',
        completed: true,
      },
      {
        status: 'Payment Confirmed',
        date: 'Just now',
        description: paymentMethod === 'COD' ? 'Cash on Delivery verified.' : 'Payment settled securely via encrypted gateway.',
        completed: true,
      },
      {
        status: 'Processing',
        date: 'Scheduled',
        description: 'Allocated to master tailoring atelier for quality certification.',
        completed: false,
      },
      {
        status: 'Packed',
        date: 'Scheduled',
        description: 'Placed into signature cedar-scented presentation box.',
        completed: false,
      },
      {
        status: 'Shipped',
        date: 'Scheduled',
        description: 'Handed over to verified courier partner.',
        completed: false,
      },
      {
        status: 'Out for Delivery',
        date: 'Scheduled',
        description: 'Dispatched for local handoff.',
        completed: false,
      },
      {
        status: 'Delivered',
        date: estimatedDelivery,
        description: 'Direct courier delivery with secure PIN verification.',
        completed: false,
      },
    ],
  };

  ordersDatabase.unshift(newOrder);

  res.status(201).json({
    success: true,
    order: newOrder,
  });
});

// Orders List
app.get('/api/orders', (req, res) => {
  res.json(ordersDatabase);
});

// Single Order Tracking
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = ordersDatabase.find((o) => o.id === id || o.trackingNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// Update Order Status (Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, courier, trackingNumber } = req.body;

  const orderIndex = ordersDatabase.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = ordersDatabase[orderIndex];
  if (status) {
    order.status = status;
    const timelineStep = order.trackingTimeline.find((s) => s.status === status);
    if (timelineStep) {
      timelineStep.completed = true;
      timelineStep.date = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  if (courier) order.courier = courier;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  res.json(order);
});

// Auth Login Simulation
app.post('/api/auth/login', (req, res) => {
  const { emailOrMobile, password } = req.body;
  if (!emailOrMobile || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  const input = String(emailOrMobile).toLowerCase().trim();
  const isAdmin = input === 'admin@venaro.com';

  const user: User = {
    id: isAdmin ? 'admin-1' : 'usr-101',
    firstName: isAdmin ? 'VÉNARO' : 'Alexander',
    lastName: isAdmin ? 'Admin' : 'Wright',
    email: isAdmin ? 'admin@venaro.com' : 'alexander.wright@venaro.com',
    mobile: '+91 98765 43210',
    role: isAdmin ? 'admin' : 'customer',
    savedAddresses: INITIAL_USER.savedAddresses,
    sizePreferences: INITIAL_USER.sizePreferences,
  };

  res.json({
    success: true,
    user,
    token: `vnr_jwt_${Buffer.from(user.email).toString('base64')}`,
  });
});

// Auth Signup
app.post('/api/auth/signup', (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;
  if (!firstName || !email || !password) {
    return res.status(400).json({ error: 'First name, email, and password are required' });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    firstName,
    lastName: lastName || '',
    email,
    mobile: mobile || '',
    role: 'customer',
    savedAddresses: [],
    sizePreferences: {
      preferredFit: 'Regular Fit',
    },
  };

  usersDatabase.push(newUser);

  res.status(201).json({
    success: true,
    user: newUser,
    token: `vnr_jwt_${Buffer.from(newUser.email).toString('base64')}`,
  });
});

// Admin Metrics
app.get('/api/admin/metrics', (req, res) => {
  const totalSales = ordersDatabase.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = ordersDatabase.length;
  const lowStockCount = productsDatabase.filter((p) => p.stock < 25).length;

  res.json({
    totalSales,
    totalOrders,
    customersCount: usersDatabase.length + 1420,
    productsCount: productsDatabase.length,
    lowStockCount,
    recentOrders: ordersDatabase.slice(0, 5),
  });
});

// Admin Add Product
app.post('/api/admin/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
  };
  productsDatabase.unshift(newProduct);
  res.status(201).json(newProduct);
});

// Admin Delete Product
app.delete('/api/admin/products/:id', (req, res) => {
  const { id } = req.params;
  productsDatabase = productsDatabase.filter((p) => p.id !== id);
  res.json({ success: true, id });
});

// ----------------- VITE INTEGRATION -----------------

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VÉNARO luxury server running on port ${PORT}`);
  });
}

startServer();
