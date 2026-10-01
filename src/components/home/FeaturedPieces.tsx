import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../catalog/ProductCard';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';

export const FeaturedPieces: React.FC = () => {
  const { products, setActiveView, openPdp } = useShop();
  const [filterTab, setFilterTab] = useState<'all' | 'indian' | 'western'>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const indianCategories = ['Bandhgalas', 'Sherwanis', 'Kurta Sets', 'Nehru Jackets', 'Indo-Western'];

  const filtered = products.filter((p) => {
    if (filterTab === 'indian') return indianCategories.includes(p.category);
    if (filterTab === 'western') return !indianCategories.includes(p.category);
    return true;
  }).slice(0, 8);

  return (
    <section className="py-20 border-b border-white/5 relative bg-[#08090c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-amber-300">
              ICONIC ATELIER DROPS · PRICES IN INR (₹)
            </span>
            <h2 className="text-3xl sm:text-4xl font-brand font-bold text-white tracking-wide mt-1">
              CURATED MASTERPIECES
            </h2>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900/80 rounded-lg border border-white/10 w-fit">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All Drops
            </button>
            <button
              onClick={() => setFilterTab('indian')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'indian'
                  ? 'bg-amber-400 text-black font-bold shadow-sm'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              <Sparkles size={12} />
              <span>Royal Indian Couture</span>
            </button>
            <button
              onClick={() => setFilterTab('western')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                filterTab === 'western'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Western Atelier
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-2 px-8 py-3.5 glass-panel text-white hover:text-amber-200 border border-white/10 hover:border-amber-400/40 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all group"
          >
            <span>Explore Entire Wardrobe Catalog</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
          >
            <div className="aspect-[3/4] bg-neutral-900">
              <img
                src={quickViewProduct.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col justify-between space-y-4 text-xs">
              <div>
                <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest">
                  {quickViewProduct.category} · {quickViewProduct.collection}
                </span>
                <h3 className="text-xl font-brand font-bold text-white mt-1">
                  {quickViewProduct.name}
                </h3>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-white">
                    {formatINR(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="font-mono text-sm text-neutral-500 line-through">
                      {formatINR(quickViewProduct.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-neutral-300 font-light leading-relaxed">
                  {quickViewProduct.description}
                </p>
                <div className="mt-3 pt-2 border-t border-white/10 space-y-1 text-neutral-400">
                  <p><strong>Fit:</strong> {quickViewProduct.fit}</p>
                  <p><strong>Material:</strong> {quickViewProduct.material}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  const id = quickViewProduct.id;
                  setQuickViewProduct(null);
                  openPdp(id);
                }}
                className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wider rounded hover:bg-neutral-200"
              >
                Inspect in 360° Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
