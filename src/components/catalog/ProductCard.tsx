import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { openPdp, addToCart, toggleWishlist, isInWishlist } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Standard');
  const [showQuickAddDrawer, setShowQuickAddDrawer] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setShowQuickAddDrawer(false);
    }, 1200);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAddDrawer(false);
      }}
      onClick={() => openPdp(product.id)}
      className="group relative flex flex-col glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-2xl cursor-pointer"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#111319]">
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Secondary Image on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate`}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {product.isNewArrival && (
              <span className="text-[10px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur-md text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                NEW SEASON
              </span>
            )}
            {product.isLimited && (
              <span className="text-[10px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur-md text-neutral-200 px-2 py-0.5 rounded border border-white/20">
                LIMITED DROP
              </span>
            )}
          </div>

          {/* Wishlist Button (Pointer events auto) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="pointer-events-auto p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-amber-300 hover:bg-black/70 transition-all transform active:scale-90"
            aria-label="Save to Wishlist"
          >
            <Heart
              size={16}
              className={`transition-colors ${isFavorited ? 'fill-amber-400 text-amber-400' : ''}`}
            />
          </button>
        </div>

        {/* Quick View Button Hover Layer */}
        <div
          className={`absolute bottom-3 left-3 right-3 flex items-center gap-2 transition-all duration-300 z-10 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="flex-1 py-2 px-3 bg-black/80 backdrop-blur-md hover:bg-black text-white text-[11px] font-medium uppercase tracking-wider rounded border border-white/20 hover:border-amber-400/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickAddDrawer(!showQuickAddDrawer);
            }}
            className="flex-1 py-2 px-3 bg-white hover:bg-neutral-200 text-black text-[11px] font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <ShoppingBag size={13} />
            <span>Quick Add</span>
          </button>
        </div>

        {/* Quick Add Size Selection Drawer */}
        {showQuickAddDrawer && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-0 bottom-0 bg-[#08090c]/95 backdrop-blur-xl p-4 border-t border-white/10 z-20 animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                Select Size:
              </span>
              <span className="text-[10px] text-amber-300 font-mono">
                {product.fit}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-8 h-8 rounded text-xs font-mono font-medium transition-colors ${
                    selectedSize === sz
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <button
              onClick={handleQuickAdd}
              disabled={addedAnimation}
              className="w-full py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
            >
              {addedAnimation ? (
                <>
                  <Check size={14} className="text-emerald-700" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>Confirm ({selectedSize})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Metadata Zone */}
      <div className="p-4 flex flex-col justify-between flex-1 space-y-2">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span className="uppercase tracking-widest font-mono">{product.category}</span>
            <div className="flex items-center gap-1 text-amber-300 font-mono">
              <Star size={12} className="fill-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h4 className="text-sm sm:text-base font-semibold text-white tracking-wide group-hover:text-amber-200 transition-colors line-clamp-1">
            {product.name}
          </h4>

          {/* Tagline */}
          <p className="text-xs text-neutral-400 line-clamp-1 font-light">
            {product.tagline}
          </p>
        </div>

        {/* Price & Colors Baseline */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-white font-mono tabular-nums">
              {formatINR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-neutral-500 line-through font-mono tabular-nums">
                {formatINR(product.originalPrice)}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-[10px] text-emerald-400 font-mono">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Color Dot Swatches */}
          <div className="flex items-center gap-1">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full border border-white/30"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
