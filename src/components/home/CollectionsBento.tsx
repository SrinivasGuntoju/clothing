import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CollectionsBento: React.FC = () => {
  const { collections, openCollection } = useShop();

  return (
    <section className="py-20 border-b border-white/5 relative bg-[#08090c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-amber-300">
              CURATED EDITIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-brand font-bold text-white tracking-wide mt-1">
              THE COLLECTIONS
            </h2>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm mt-3 md:mt-0 font-light">
            Distinct design narratives spanning architectural workwear, precision tailoring, and limited atelier drops.
          </p>
        </div>

        {/* Asymmetric Curated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {collections.map((col, idx) => {
            // Asymmetric sizing
            let colSpan = 'md:col-span-4';
            if (idx === 0) colSpan = 'md:col-span-8'; // Featured big card
            else if (idx === 1) colSpan = 'md:col-span-4';
            else if (idx === 2) colSpan = 'md:col-span-6';
            else if (idx === 3) colSpan = 'md:col-span-6';
            else if (idx === 4) colSpan = 'md:col-span-4';
            else if (idx === 5) colSpan = 'md:col-span-4';
            else if (idx === 6) colSpan = 'md:col-span-4';
            else if (idx === 7) colSpan = 'md:col-span-7';
            else if (idx === 8) colSpan = 'md:col-span-5';
            else if (idx === 9) colSpan = 'md:col-span-6'; // Royal Bandhgala
            else if (idx === 10) colSpan = 'md:col-span-6'; // Heritage Sherwani
            else if (idx === 11) colSpan = 'md:col-span-12'; // Contemporary Kurta Bundi Panorama

            return (
              <div
                key={col.id}
                onClick={() => openCollection(col.slug)}
                className={`group relative overflow-hidden rounded-2xl glass-panel border border-white/10 cursor-pointer min-h-[340px] md:min-h-[400px] flex flex-col justify-end p-6 sm:p-8 transition-all duration-500 hover:border-amber-400/40 hover:-translate-y-1 shadow-xl ${colSpan}`}
              >
                {/* Background Image with Zoom & Dark Scrim */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={col.image}
                    alt={col.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.7] group-hover:brightness-[0.8]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/50 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
                      {col.subtitle}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                      {col.productCount} Pieces
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-brand font-bold text-white tracking-wide group-hover:text-amber-200 transition-colors">
                    {col.title}
                  </h3>

                  <p className="text-xs text-neutral-300 font-light line-clamp-2 max-w-lg">
                    {col.tagline}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs uppercase tracking-widest text-white font-medium group-hover:text-amber-300 transition-colors">
                    <span>Explore Collection</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
