import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { formatINR } from '../../utils/currency';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, openPdp } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Velvet Bandhgala',
    'Raw Silk Sherwani',
    'Draped Kurta Set',
  ]);

  const trendingSearches = [
    'Obsidian Velvet Bandhgala',
    'Raw Silk Sherwani',
    'Draped Kurta Bundi',
    'Nehru Jacket',
    'Indo-Western Achkan',
    'Zardozi Leather Mojari',
    'Black Overshirt',
    'Pleated Trousers',
  ];

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = searchTerm.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.material.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectProduct = (productId: string) => {
    if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
      setRecentSearches([searchTerm.trim(), ...recentSearches.slice(0, 4)]);
    }
    setIsSearchOpen(false);
    openPdp(productId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090c]/95 backdrop-blur-2xl text-white flex flex-col justify-start p-6 sm:p-12 animate-fadeIn overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300">
            ATELIER DISCOVERY SYSTEM
          </span>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close Search"
          >
            <X size={24} />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="relative">
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tailored overshirts, leather jackets, trousers..."
            className="w-full pb-4 text-2xl sm:text-4xl font-brand font-medium bg-transparent border-b-2 border-white/20 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 pr-12 transition-colors"
          />
          <Search size={28} className="absolute right-2 top-2 text-neutral-500" />
        </div>

        {/* Dynamic results if query entered */}
        {searchTerm.trim() ? (
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Found {filteredProducts.length} pieces for "{searchTerm}"
            </p>

            {filteredProducts.length === 0 ? (
              <p className="text-neutral-500 text-sm py-8 text-center">
                No atelier garments match this query. Try searching for "Shirt", "Jacket", or "Trouser".
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="glass-panel p-3 rounded-xl border border-white/10 hover:border-amber-400/40 transition-all flex gap-3 cursor-pointer group"
                  >
                    <img src={p.images[0]} alt="" className="w-16 h-20 object-cover rounded bg-neutral-900" />
                    <div className="flex-1 flex flex-col justify-between py-1 text-xs">
                      <div>
                        <p className="text-[10px] font-mono text-neutral-400 uppercase">{p.category}</p>
                        <h4 className="font-semibold text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                          {p.name}
                        </h4>
                      </div>
                      <p className="font-mono text-amber-300 font-bold">
                        {formatINR(p.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Recent & Trending Tags when query is empty */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            {/* Trending */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-400 font-mono uppercase tracking-wider text-[11px]">
                <TrendingUp size={14} className="text-amber-300" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 glass-panel rounded-lg border border-white/10 hover:border-amber-400/30 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-400 font-mono uppercase tracking-wider text-[11px]">
                <Clock size={14} className="text-neutral-400" />
                <span>Recent Atelier Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-neutral-900/80 rounded-lg border border-white/5 hover:border-white/20 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
