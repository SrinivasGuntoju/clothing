import React, { useState, useMemo } from 'react';
import { LayoutGrid, List, SlidersHorizontal, X, RotateCcw, Search } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from './ProductCard';
import { Product, ProductSize, Category, FitType } from '../../types';
import { formatINR } from '../../utils/currency';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    selectedCategory,
    openCategory,
    selectedCollection,
    openCollection,
    openPdp,
  } = useShop();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters state
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory || 'All');
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>([]);
  const [selectedFits, setSelectedFits] = useState<FitType[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(35000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('recommended');

  const categories: string[] = [
    'All',
    'Bandhgalas',
    'Sherwanis',
    'Kurta Sets',
    'Nehru Jackets',
    'Indo-Western',
    'Shirts',
    'Jackets',
    'Trousers',
    'Footwear',
    'Accessories',
  ];
  const sizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const fits: FitType[] = ['Slim Fit', 'Regular Fit', 'Oversized'];

  // Toggle helpers
  const toggleSize = (sz: ProductSize) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const toggleFit = (f: FitType) => {
    setSelectedFits((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  const resetFilters = () => {
    setActiveCategory('All');
    setSelectedSizes([]);
    setSelectedFits([]);
    setMaxPrice(35000);
    setMinRating(0);
    setSearchFilter('');
    setSortBy('recommended');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (selectedCollection) {
      list = list.filter(
        (p) => p.collection.toLowerCase().replace(/\s+/g, '-') === selectedCollection.toLowerCase()
      );
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) => p.sizes.some((sz) => selectedSizes.includes(sz)));
    }

    if (selectedFits.length > 0) {
      list = list.filter((p) => selectedFits.includes(p.fit));
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  }, [products, searchFilter, activeCategory, selectedCollection, selectedSizes, selectedFits, maxPrice, minRating, sortBy]);

  return (
    <div className="min-h-screen py-10 bg-[#08090c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono uppercase tracking-wider mb-2">
            <span>Atelier</span>
            <span>/</span>
            <span>Menswear</span>
            {selectedCollection && (
              <>
                <span>/</span>
                <span className="text-amber-300 font-bold">{selectedCollection.replace('-', ' ')}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-brand font-bold uppercase tracking-wide">
                {selectedCollection ? selectedCollection.replace('-', ' ') : 'All Garments & Essentials'}
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Showing {filteredProducts.length} pieces curated for modern masculine silhouettes.
              </p>
            </div>

            {/* Quick Filter Reset if active */}
            {(selectedSizes.length > 0 || activeCategory !== 'All' || maxPrice < 16000 || selectedFits.length > 0) && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 transition-colors"
              >
                <RotateCcw size={13} />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Toolbar: Category Pills + Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="flex items-center gap-2 px-3.5 py-2 glass-panel hover:bg-white/10 text-xs uppercase tracking-wider rounded-lg transition-colors border border-white/10"
            >
              <SlidersHorizontal size={14} className="text-amber-300" />
              <span>Filters</span>
              {(selectedSizes.length > 0 || selectedFits.length > 0 || maxPrice < 16000) && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 glass-panel text-xs uppercase tracking-wider text-neutral-200 rounded-lg border border-white/10 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="newest">Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center gap-1 glass-panel p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
                aria-label="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Filters Sidebar (when open) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filter Sidebar */}
          {filterDrawerOpen && (
            <aside className="lg:col-span-3 glass-panel rounded-xl p-5 border border-white/10 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
                  Refine Atelier Catalog
                </span>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                  Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search fabric, style..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/40"
                  />
                  <Search size={14} className="absolute right-3 top-2.5 text-neutral-400" />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-mono uppercase text-neutral-400 text-[11px]">Max Price</span>
                  <span className="font-mono text-amber-300 font-bold">{formatINR(maxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="35000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                  <span>{formatINR(1500)}</span>
                  <span>{formatINR(35000)}</span>
                </div>
              </div>

              {/* Size Selectors */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`py-1.5 text-xs font-mono rounded transition-colors ${
                        selectedSizes.includes(sz)
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Type */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                  Silhouette Fit
                </label>
                <div className="space-y-1.5 text-xs">
                  {fits.map((f) => (
                    <label key={f} className="flex items-center gap-2 cursor-pointer text-neutral-300">
                      <input
                        type="checkbox"
                        checked={selectedFits.includes(f)}
                        onChange={() => toggleFit(f)}
                        className="rounded border-white/20 bg-neutral-900 text-amber-400 focus:ring-0"
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-2">
                  Customer Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-xs text-white focus:outline-none"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.5}>4.5 Stars & Above</option>
                  <option value={4.8}>4.8 Stars & Above</option>
                  <option value={5.0}>5.0 Perfect Rating</option>
                </select>
              </div>

              <button
                onClick={resetFilters}
                className="w-full py-2 text-xs text-neutral-400 hover:text-white uppercase tracking-wider border border-white/10 rounded hover:bg-white/5 transition-colors"
              >
                Clear Filters
              </button>
            </aside>
          )}

          {/* Product Cards Container */}
          <main className={filterDrawerOpen ? 'lg:col-span-9' : 'lg:col-span-12'}>
            {filteredProducts.length === 0 ? (
              <div className="glass-panel rounded-2xl p-16 text-center border border-white/10 max-w-xl mx-auto my-12">
                <p className="text-amber-300 font-mono text-xs uppercase tracking-widest mb-2">
                  No Matches Found
                </p>
                <h3 className="text-xl font-brand font-semibold text-white mb-2">
                  Refine Your Search Parameters
                </h3>
                <p className="text-xs text-neutral-400 mb-6 font-light">
                  We could not find items matching your active filter criteria. Try adjusting your size, category, or price range.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${filterDrawerOpen ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => openPdp(p.id)}
                    className="glass-panel p-4 rounded-xl border border-white/10 hover:border-amber-400/40 transition-all flex flex-col sm:flex-row gap-5 cursor-pointer group hover:-translate-y-0.5"
                  >
                    <div className="w-full sm:w-44 aspect-[3/4] sm:aspect-square overflow-hidden rounded-lg bg-neutral-900 shrink-0">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                          <span className="font-mono uppercase tracking-wider">{p.category}</span>
                          <span className="text-amber-300 font-mono">★ {p.rating.toFixed(1)}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-amber-200 transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{p.description}</p>
                        <p className="text-xs text-amber-300/90 font-mono mt-2">{p.fit} · {p.material}</p>
                      </div>

                      <div className="flex items-baseline justify-between pt-3 border-t border-white/5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold font-mono text-white">
                            {formatINR(p.price)}
                          </span>
                          {p.originalPrice > p.price && (
                            <span className="text-xs text-neutral-500 line-through font-mono">
                              {formatINR(p.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold group-hover:underline">
                          View Atelier Details →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
          >
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-10 p-1.5 text-neutral-400 hover:text-white bg-black/40 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="aspect-[3/4] bg-neutral-900 overflow-hidden">
              <img
                src={quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300">
                  {quickViewProduct.category} · {quickViewProduct.collection}
                </span>
                <h3 className="text-xl font-brand font-bold text-white mt-1">
                  {quickViewProduct.name}
                </h3>
                <div className="flex items-baseline gap-3 my-3">
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatINR(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-sm text-neutral-500 line-through font-mono">
                      {formatINR(quickViewProduct.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-emerald-400 font-mono">
                    {quickViewProduct.discountPercent}% OFF
                  </span>
                </div>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  {quickViewProduct.description}
                </p>
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs text-neutral-400">
                  <p><strong>Fit:</strong> {quickViewProduct.fit}</p>
                  <p><strong>Material:</strong> {quickViewProduct.material}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    const id = quickViewProduct.id;
                    setQuickViewProduct(null);
                    openPdp(id);
                  }}
                  className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-neutral-200 transition-colors"
                >
                  View Full Product Details & 360° Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
