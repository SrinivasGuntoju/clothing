import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CraftsmanshipStory: React.FC = () => {
  const { setActiveView, setIsSizeCalculatorOpen } = useShop();

  return (
    <section className="py-24 border-b border-white/5 relative bg-[#08090c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Story Imagery Mosaic (6 Cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden glass-panel border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
                  alt="Atelier tailoring"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-[0.8] hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <p className="text-2xl font-brand font-bold text-amber-300 font-mono">15.5 oz</p>
                <p className="text-xs font-semibold text-white uppercase tracking-wider">Okayama Selvedge</p>
                <p className="text-[11px] text-neutral-400 font-light">
                  Shuttle-loomed with classic red ticker ID and natural indigo dye.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <p className="text-2xl font-brand font-bold text-white font-mono">100%</p>
                <p className="text-xs font-semibold text-white uppercase tracking-wider">Civitanova Calfskin</p>
                <p className="text-[11px] text-neutral-400 font-light">
                  Blake-stitched Italian leather engineered for a lifetime of resoleability.
                </p>
              </div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden glass-panel border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                  alt="Tailoring materials"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-[0.8] hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Editorial Text (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-amber-300">
              PHILOSOPHY OF REDUCTION
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-brand font-bold text-white uppercase tracking-tight leading-tight">
              ARCHITECTURAL FORM <br />
              <span className="metallic-silver-text">UNCOMPROMISING FABRIC</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              At VÉNARO, garments are not merely assembled; they are engineered. Every lapel angle, drop-shoulder slope, and pocket placement is measured against strict spatial mathematics to create a silhouette of effortless masculine authority.
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-bold font-mono">01.</span>
                <p className="text-neutral-300">
                  <strong className="text-white">Zero Synthetic Fillers:</strong> All woolens, fleeces, and denim selections use pure natural staples (GOTS Organic Cotton, Boiled Merino, Tuscan Lambskin).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-bold font-mono">02.</span>
                <p className="text-neutral-300">
                  <strong className="text-white">Grade 5 Titanium & Horn:</strong> Custom cast buttons carved from genuine buffalo horn and CNC-milled aerospace grade titanium hardware.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-amber-400 font-bold font-mono">03.</span>
                <p className="text-neutral-300">
                  <strong className="text-white">Interactive Sizing Intelligence:</strong> Anatomical machine-learning fitting algorithms guarantee flawless drape across every physique.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => setActiveView('catalog')}
                className="px-8 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Shop the Atelier
              </button>

              <button
                onClick={() => setIsSizeCalculatorOpen(true)}
                className="px-8 py-3.5 glass-panel text-amber-300 font-semibold text-xs uppercase tracking-widest rounded hover:bg-white/10 transition-colors cursor-pointer border border-amber-400/30"
              >
                Calibrate Smart Size
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
