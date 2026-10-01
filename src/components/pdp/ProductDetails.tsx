import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Sparkles,
  ChevronDown,
  Check,
  MapPin,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product360Viewer } from '../3d/Product360Viewer';
import { SmartSizeModal } from '../sizing/SmartSizeModal';
import { ProductSize, Review } from '../../types';
import { formatINR } from '../../utils/currency';

export const ProductDetails: React.FC = () => {
  const {
    products,
    selectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeCalculatorOpen,
    setActiveView,
  } = useShop();

  const product = products.find((p) => p.id === selectedProductId) || products[0];

  // Gallery view mode: 'images' or '3d_360'
  const [galleryTab, setGalleryTab] = useState<'images' | '3d_360'>('images');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selection states
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product?.sizes[1] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);

  // Accordion toggles
  const [openSection, setOpenSection] = useState<'fabric' | 'fit' | 'care' | 'shipping' | null>('fabric');

  // Pincode Checker
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<any>(null);
  const [pincodeError, setPincodeError] = useState('');

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(product?.reviews || []);

  const isFavorited = isInWishlist(product.id);

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError('');
    if (!pincodeInput || pincodeInput.length !== 6 || !/^\d+$/.test(pincodeInput)) {
      setPincodeError('Please enter a valid 6-digit postal code.');
      return;
    }
    setPincodeLoading(true);
    try {
      const res = await fetch(`/api/pincode/check?pincode=${pincodeInput}`);
      const data = await res.json();
      if (res.ok && data.available) {
        setDeliveryResult(data);
      } else {
        setPincodeError(data.error || 'Delivery not serviceable to this pincode');
      }
    } catch {
      // Local fallback
      setDeliveryResult({
        available: true,
        pincode: pincodeInput,
        standardDelivery: { date: 'In 3-4 Business Days', fee: 0, label: 'Free Standard Delivery' },
        expressDelivery: { date: 'In 1-2 Business Days', fee: 199, label: 'VÉNARO Priority Air' },
      });
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor,
      rating: reviewRating,
      date: 'Just now',
      comment: reviewComment,
      verified: true,
    };
    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setReviewAuthor('');
    setReviewComment('');
  };

  return (
    <div className="min-h-screen py-10 bg-[#08090c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono uppercase tracking-wider mb-6">
          <button onClick={() => setActiveView('home')} className="hover:text-white">
            Home
          </button>
          <span>/</span>
          <button onClick={() => setActiveView('catalog')} className="hover:text-white">
            {product.category}
          </button>
          <span>/</span>
          <span className="text-amber-300 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Two-Column PDP Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Visual Gallery + 360 Viewer (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Gallery Tabs (Photography vs 360° Studio) */}
            <div className="flex items-center gap-2 bg-neutral-900/60 p-1.5 rounded-lg border border-white/10 w-fit">
              <button
                onClick={() => setGalleryTab('images')}
                className={`px-4 py-1.5 rounded text-xs uppercase tracking-wider font-medium transition-colors ${
                  galleryTab === 'images'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Atelier Photography
              </button>
              <button
                onClick={() => setGalleryTab('3d_360')}
                className={`px-4 py-1.5 rounded text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5 ${
                  galleryTab === '3d_360'
                    ? 'bg-amber-400 text-black font-semibold shadow-sm'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                <Sparkles size={13} />
                <span>360° 3D Inspector</span>
              </button>
            </div>

            {/* Display Canvas or Image */}
            {galleryTab === '3d_360' ? (
              <Product360Viewer product={product} />
            ) : (
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#11131a] border border-white/10">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />

                {/* Floating Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-amber-300 transition-all border border-white/10 shadow-lg"
                  aria-label="Save to Wishlist"
                >
                  <Heart size={18} className={isFavorited ? 'fill-amber-400 text-amber-400' : ''} />
                </button>
              </div>
            )}

            {/* Thumbnails row (when in images mode) */}
            {galleryTab === 'images' && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                <span className="uppercase tracking-[0.2em] text-amber-300">
                  {product.category} · {product.collection}
                </span>
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Star size={13} className="fill-amber-400" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                  <span className="text-neutral-500">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-brand font-bold uppercase tracking-wide text-white">
                {product.name}
              </h1>

              <p className="text-sm text-neutral-300 mt-2 font-light leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-4 glass-panel rounded-xl border border-white/10 flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold font-mono text-white">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-neutral-500 line-through font-mono">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                Taxes included
              </span>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono uppercase text-neutral-400 tracking-wider">
                  Color: <strong className="text-white">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-amber-400 bg-white/10 text-white font-medium shadow-sm'
                        : 'border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector + Smart Fit Experience */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono uppercase text-neutral-400 tracking-wider">
                  Select Size ({product.fit})
                </span>

                <button
                  type="button"
                  onClick={() => setIsSizeCalculatorOpen(true)}
                  className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  <Ruler size={13} />
                  <span className="underline">Smart Size Calculator</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-amber-400 text-black shadow-lg scale-102 font-bold'
                        : 'glass-panel text-neutral-300 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center glass-panel rounded-lg border border-white/10 h-12 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-12 bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full h-12 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <span>Buy Now · Express Checkout</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Pincode Delivery Availability Checker */}
            <div className="p-4 glass-panel rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <MapPin size={14} className="text-amber-300" />
                <span className="uppercase tracking-wider">Estimated Delivery & Services</span>
              </div>

              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  placeholder="Enter 6-digit Pincode (e.g. 400013)"
                  className="flex-1 px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/40 font-mono"
                />
                <button
                  type="submit"
                  disabled={pincodeLoading}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {pincodeLoading ? 'Checking...' : 'Check'}
                </button>
              </form>

              {pincodeError && (
                <p className="text-[11px] text-red-400">{pincodeError}</p>
              )}

              {deliveryResult && (
                <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Truck size={13} className="text-emerald-400" />
                      <span>{deliveryResult.standardDelivery?.label}</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {deliveryResult.standardDelivery?.date} (Free)
                    </span>
                  </div>
                  {deliveryResult.expressDelivery?.available && (
                    <div className="flex items-center justify-between text-neutral-300">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-amber-300" />
                        <span>{deliveryResult.expressDelivery?.label}</span>
                      </span>
                      <span className="font-mono text-amber-300 font-semibold">
                        {deliveryResult.expressDelivery?.date} (₹199)
                      </span>
                    </div>
                  )}
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Fulfilled from {deliveryResult.hub || 'Mumbai Atelier Dispatch'}
                  </p>
                </div>
              )}
            </div>

            {/* Accordion Specs */}
            <div className="border-t border-white/10 divide-y divide-white/5 text-xs">
              {/* Fabric Details */}
              <div className="py-3">
                <button
                  onClick={() => setOpenSection(openSection === 'fabric' ? null : 'fabric')}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-neutral-200"
                >
                  <span>Fabric & Material Specifications</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openSection === 'fabric' ? 'rotate-180 text-amber-300' : ''}`}
                  />
                </button>
                {openSection === 'fabric' && (
                  <div className="pt-3 text-neutral-400 space-y-2 font-light">
                    <p className="font-medium text-neutral-300">{product.material}</p>
                    <ul className="space-y-1 list-disc list-inside">
                      {product.fabricDetails.map((det, i) => (
                        <li key={i}>{det}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Fit Information */}
              <div className="py-3">
                <button
                  onClick={() => setOpenSection(openSection === 'fit' ? null : 'fit')}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-neutral-200"
                >
                  <span>Silhouette & Fit</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openSection === 'fit' ? 'rotate-180 text-amber-300' : ''}`}
                  />
                </button>
                {openSection === 'fit' && (
                  <div className="pt-3 text-neutral-400 space-y-2 font-light">
                    <p>Designed for a <strong className="text-white">{product.fit}</strong>.</p>
                    <p>Model is 6'1" (185 cm) with a 40" chest, wearing size Medium.</p>
                    <p>Recommended to take your standard size for the intended brand drape.</p>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              <div className="py-3">
                <button
                  onClick={() => setOpenSection(openSection === 'care' ? null : 'care')}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-neutral-200"
                >
                  <span>Care & Longevity</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openSection === 'care' ? 'rotate-180 text-amber-300' : ''}`}
                  />
                </button>
                {openSection === 'care' && (
                  <div className="pt-3 text-neutral-400 space-y-1 list-disc list-inside font-light">
                    {product.careInstructions.map((c, i) => (
                      <p key={i}>· {c}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                  className="w-full flex items-center justify-between text-left font-semibold uppercase tracking-wider text-neutral-200"
                >
                  <span>Complimentary Delivery & 14-Day Returns</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openSection === 'shipping' ? 'rotate-180 text-amber-300' : ''}`}
                  />
                </button>
                {openSection === 'shipping' && (
                  <div className="pt-3 text-neutral-400 space-y-2 font-light">
                    <p>All garments are wrapped in bespoke cedar-scented presentation boxes.</p>
                    <p>Enjoy complimentary insured shipping on all orders over ₹2,999.</p>
                    <p>Hassle-free 14-day doorstep exchange or store credit guarantee.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-20 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
                CLIENT VERIFICATIONS
              </span>
              <h3 className="text-2xl font-brand font-bold text-white tracking-wide mt-1">
                Atelier Reviews ({reviewsList.length})
              </h3>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 glass-panel text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10 w-fit"
            >
              <MessageSquare size={14} className="text-amber-300" />
              <span>Write a Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="glass-panel p-5 rounded-xl border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm">{rev.author}</h4>
                    <p className="text-[11px] font-mono text-neutral-400">{rev.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  "{rev.comment}"
                </p>
                {rev.verified && (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Check size={12} />
                    <span>Verified Atelier Client</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Size Modal */}
      <SmartSizeModal onApplySize={(sz) => setSelectedSize(sz)} />

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div
          onClick={() => setShowReviewModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass-panel rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4 text-xs"
          >
            <h4 className="text-lg font-brand font-bold text-white">Share Your Atelier Experience</h4>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Julian T."
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={20}
                        className={star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Review Comments</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Detail the fabric hand-feel, drape, and tailoring fit..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-white text-black font-semibold uppercase tracking-wider rounded"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
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
