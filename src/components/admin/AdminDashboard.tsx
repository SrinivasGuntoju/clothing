import React, { useState } from 'react';
import {
  Shield,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Truck,
  Check,
  Search,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, OrderStatus, ProductSize, Category, FitType } from '../../types';
import { formatINR } from '../../utils/currency';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    user,
    addProduct,
    deleteProduct,
    updateProduct,
    updateOrderStatus,
    setActiveView,
    switchRole,
  } = useShop();

  const [activeSection, setActiveSection] = useState<'metrics' | 'products' | 'orders' | 'customers'>('metrics');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Category>('Shirts');
  const [newProdPrice, setNewProdPrice] = useState(3999);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState(4999);
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
  );
  const [newProdStock, setNewProdStock] = useState(30);
  const [newProdFit, setNewProdFit] = useState<FitType>('Regular Fit');
  const [newProdMaterial, setNewProdMaterial] = useState('100% Boiled Merino Wool');

  // Order status edit state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusInput, setStatusInput] = useState<OrderStatus>('Processing');
  const [courierInput, setCourierInput] = useState('BlueDart Luxury Express');
  const [trackingInput, setTrackingInput] = useState('');

  // Calculations
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter((p) => p.stock < 25);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100);
    const newP: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      slug: newProdName.toLowerCase().replace(/\s+/g, '-'),
      tagline: `${newProdMaterial} crafted for modern tailoring.`,
      category: newProdCategory,
      collection: 'New Arrivals',
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      discountPercent: Math.max(0, discount),
      rating: 5.0,
      reviewCount: 0,
      isNewArrival: true,
      images: [newProdImage],
      colors: [{ name: 'Matte Charcoal', hex: '#26282e' }],
      sizes: ['S', 'M', 'L', 'XL'],
      variants: [],
      fit: newProdFit,
      material: newProdMaterial,
      fabricDetails: ['Bespoke weave', 'Pre-washed luxury finish'],
      careInstructions: ['Dry clean only'],
      description: `New seasonal release crafted in ${newProdMaterial}.`,
      stock: Number(newProdStock),
      reviews: [],
    };
    addProduct(newP);
    setShowAddProductModal(false);
    setNewProdName('');
  };

  const handleUpdateOrderStatusSubmit = (orderId: string) => {
    updateOrderStatus(orderId, statusInput, courierInput, trackingInput);
    setSelectedOrderId(null);
  };

  return (
    <div className="min-h-screen py-10 bg-[#08090c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('home')}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300">
                  ATELIER MANAGEMENT SYSTEM
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-3xl font-brand font-bold uppercase tracking-wide">
                Admin Control Room
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => switchRole('customer')}
              className="px-3.5 py-1.5 glass-panel text-xs text-neutral-300 hover:text-white rounded-lg border border-white/10"
            >
              Exit to Client View
            </button>
            <span className="text-xs font-mono text-amber-300 bg-amber-400/10 px-3 py-1.5 rounded border border-amber-400/20">
              Role: Master Atelier Admin
            </span>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          {[
            { id: 'metrics', label: 'Overview Metrics' },
            { id: 'products', label: `Inventory & Catalog (${products.length})` },
            { id: 'orders', label: `Fulfillment Orders (${orders.length})` },
            { id: 'customers', label: 'Client Base' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSection === tab.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* METRICS VIEW */}
        {activeSection === 'metrics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-400">Total Net Sales (INR)</span>
                <p className="text-3xl font-brand font-bold text-white font-mono">
                  {formatINR(totalSales)}
                </p>
                <p className="text-[11px] text-emerald-400 font-mono">Verified gateway settlements</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-400">Active Orders</span>
                <p className="text-3xl font-brand font-bold text-amber-300 font-mono">
                  {orders.length}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono">100% on schedule</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-400">Active SKUs</span>
                <p className="text-3xl font-brand font-bold text-white font-mono">
                  {products.length}
                </p>
                <p className="text-[11px] text-neutral-400 font-mono">9 Seasonal Collections</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-mono uppercase text-neutral-400">Low Stock SKUs</span>
                <p className="text-3xl font-brand font-bold text-amber-400 font-mono">
                  {lowStockProducts.length}
                </p>
                <p className="text-[11px] text-amber-300 font-mono">Below 25 atelier units</p>
              </div>
            </div>

            {/* Quick Summary of Recent Orders */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-base font-brand font-bold uppercase tracking-wider text-white">
                Live Dispatches
              </h3>
              <div className="divide-y divide-white/5 text-xs">
                {orders.map((o) => (
                  <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-white font-mono">{o.id}</span>
                      <span className="text-neutral-400 ml-3">{o.address.fullName} ({o.address.city})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-300 font-mono bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                        {o.status}
                      </span>
                      <span className="font-mono font-bold text-white">{formatINR(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS MANAGEMENT */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-neutral-400">
                Manage garment inventory, prices in INR (₹), fabric specifications, and stock limits.
              </p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2 bg-white text-black font-semibold uppercase tracking-wider text-xs rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-neutral-200"
              >
                <Plus size={14} />
                <span>Add Product</span>
              </button>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/80 text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="p-4">Garment</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (INR)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Fit</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-12 object-cover rounded bg-neutral-800" />
                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{p.collection}</p>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-neutral-300">{p.category}</td>
                      <td className="p-4 font-mono font-bold text-white">{formatINR(p.price)}</td>
                      <td className="p-4 font-mono">
                        <span className={p.stock < 25 ? 'text-amber-400 font-bold' : 'text-neutral-300'}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">{p.fit}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT */}
        {activeSection === 'orders' && (
          <div className="space-y-6">
            <p className="text-xs text-neutral-400">
              Update shipment statuses, assign logistics air couriers, and manage customer tracking.
            </p>

            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3 text-xs">
                    <div>
                      <span className="font-bold text-white font-mono text-sm">{o.id}</span>
                      <span className="text-neutral-400 ml-3">Client: {o.address.fullName}</span>
                      <span className="text-neutral-500 font-mono ml-3">{o.address.mobile}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded bg-amber-400/10 text-amber-300 font-mono text-xs border border-amber-400/20">
                        {o.status}
                      </span>
                      <span className="font-mono text-white font-bold text-sm">
                        ₹{o.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="text-neutral-300">
                      <p><strong>Courier:</strong> {o.courier}</p>
                      <p className="font-mono text-neutral-400">AWB Tracking: {o.trackingNumber}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedOrderId === o.id ? statusInput : o.status}
                        onChange={(e) => {
                          setSelectedOrderId(o.id);
                          setStatusInput(e.target.value as OrderStatus);
                        }}
                        className="px-3 py-1.5 bg-neutral-900 border border-white/10 rounded text-xs text-white"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Payment Confirmed">Payment Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleUpdateOrderStatusSubmit(o.id)}
                        className="px-3.5 py-1.5 bg-white text-black font-semibold rounded text-xs hover:bg-neutral-200 cursor-pointer"
                      >
                        Apply Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS VIEW */}
        {activeSection === 'customers' && (
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-base font-brand font-bold uppercase tracking-wider text-white">
              Registered Atelier Clients
            </h3>
            <div className="divide-y divide-white/5 text-xs">
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Alexander Wright</p>
                  <p className="text-neutral-400 font-mono">alexander.wright@venaro.com</p>
                </div>
                <span className="font-mono text-amber-300">Tier: VIP Atelier Client</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Marcus Vance</p>
                  <p className="text-neutral-400 font-mono">marcus.v@atelier.net</p>
                </div>
                <span className="font-mono text-neutral-400">Tier: Premier Client</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div
          onClick={() => setShowAddProductModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-brand font-bold text-white text-lg">Add New Atelier Garment</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-neutral-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Sculptural Double-Breasted Blazer"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                  >
                    <option value="Bandhgalas">Bandhgalas (Jodhpuri)</option>
                    <option value="Sherwanis">Sherwanis (Ceremonial)</option>
                    <option value="Kurta Sets">Kurta Sets (Ethnic)</option>
                    <option value="Nehru Jackets">Nehru Jackets (Bundi)</option>
                    <option value="Indo-Western">Indo-Western (Achkan)</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Trousers">Trousers</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Footwear">Footwear (Mojaris & Shoes)</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Silhouette Fit</label>
                  <select
                    value={newProdFit}
                    onChange={(e) => setNewProdFit(e.target.value as FitType)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                  >
                    <option value="Regular Fit">Regular Fit</option>
                    <option value="Slim Fit">Slim Fit</option>
                    <option value="Oversized">Oversized</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Material Composition</label>
                <input
                  type="text"
                  required
                  value={newProdMaterial}
                  onChange={(e) => setNewProdMaterial(e.target.value)}
                  placeholder="e.g. 100% Japanese Selvedge Cotton"
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-white text-black font-semibold uppercase tracking-wider rounded cursor-pointer"
                >
                  Create Garment SKU
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 border border-white/10 text-neutral-400 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
