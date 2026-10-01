import React from 'react';
import { ArrowUpRight, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { HeroFashionCanvas } from '../3d/HeroFashionCanvas';

export const HeroSection: React.FC = () => {
  const { setActiveView, openCollection } = useShop();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-white/5 pt-4 pb-12">
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-radial from-[#13151f]/50 via-[#08090c] to-[#08090c] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text / Editorial Zone (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 pt-6 lg:pt-0">
            {/* Tagline Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase font-mono tracking-[0.3em] text-amber-300 bg-amber-400/10 px-3 py-1 rounded border border-amber-400/20">
                FW 2026 COUTURE & ROYAL HERITAGE
              </span>
              <span className="text-xs text-neutral-400 font-mono tracking-wider flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">₹</span>
                <span>INDIAN RUPEES (INR)</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h2 className="text-xs uppercase tracking-[0.4em] font-mono text-neutral-400">
                ROYAL BANDHGALAS · BESPOKE SHERWANIS · MODERN SILHOUETTES
              </h2>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-brand font-bold tracking-tight text-white uppercase leading-[1.05]">
                OWN YOUR <br />
                <span className="metallic-gold-text">STYLE</span>
              </h1>
            </div>

            {/* Editorial Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 font-light max-w-xl leading-relaxed">
              Imperial silk velvet bandhgalas, hand-embroidered Banarasi sherwanis, and modern draped kurta sets. Engineered with Italian craftsmanship and Indian royal sartorial heritage.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => openCollection('royal-bandhgala')}
                className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs tracking-[0.2em] uppercase rounded transition-all flex items-center gap-3 shadow-xl hover:shadow-amber-400/20 cursor-pointer"
              >
                <span>Royal Indian Couture</span>
                <ArrowUpRight size={16} />
              </button>

              <button
                onClick={() => setActiveView('catalog')}
                className="px-8 py-4 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase rounded hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-xl hover:shadow-white/10 cursor-pointer"
              >
                <span>Shop All Men</span>
                <Compass size={14} />
              </button>
            </div>

            {/* Atelier Trust Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-neutral-400">
              <div>
                <p className="text-white font-semibold text-xs">Varanasi & Civitanova</p>
                <p className="text-[11px] text-neutral-400">Artisan Looms</p>
              </div>
              <div>
                <p className="text-white font-semibold text-xs">Pan-India Air</p>
                <p className="text-[11px] text-neutral-400">Delivery in 24–48h</p>
              </div>
              <div>
                <p className="text-white font-semibold text-xs">Imperial Fit</p>
                <p className="text-[11px] text-neutral-400">Smart Sizing AI</p>
              </div>
              <div>
                <p className="text-white font-semibold text-xs">Indian Rupees (₹)</p>
                <p className="text-[11px] text-neutral-400">Zero Gateway Fee</p>
              </div>
            </div>
          </div>

          {/* Right 3D Fashion Interactive Viewport (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <HeroFashionCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};
