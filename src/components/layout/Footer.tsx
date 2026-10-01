import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { openCategory, openCollection, setActiveView, setShowCinematicIntro } = useShop();
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim() || !emailSub.includes('@')) return;
    setSubSuccess(true);
    setTimeout(() => {
      setEmailSub('');
      setSubSuccess(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#050608] text-white border-t border-white/10 pt-16 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Newsletter & Atelier Circle Banner */}
        <div className="glass-panel p-8 sm:p-12 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-gradient-to-r from-neutral-900/60 to-neutral-950/80">
          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300">
              VÉNARO PRIVATE CLIENTELE
            </span>
            <h3 className="text-2xl sm:text-3xl font-brand font-bold tracking-wide">
              Receive Numbered Atelier Allocations
            </h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Subscribers receive early access to limited 150-piece drops, private seasonal lookbooks, and private fitting invitations.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="email"
              required
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              placeholder="Enter client email..."
              className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 w-full sm:w-72 font-mono"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-semibold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {subSuccess ? (
                <>
                  <Check size={14} className="text-emerald-700" />
                  <span>Enrolled</span>
                </>
              ) : (
                <>
                  <span>Request Access</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* 4 Navigation Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-2xl font-brand tracking-[0.25em] font-bold text-white">
              VÉNARO
            </h2>
            <p className="text-neutral-400 text-xs font-light max-w-sm leading-relaxed">
              Modern luxury menswear engineered for the everyday gentleman. Combining Italian sartorial discipline with contemporary sculptural silhouettes.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowCinematicIntro(true)}
                className="text-[11px] font-mono text-amber-300 hover:text-amber-200 underline uppercase tracking-wider"
              >
                Replay 3D Cinematic Intro
              </button>
            </div>
          </div>

          {/* Catalog Col */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber-300">
              Wardrobe
            </p>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => openCollection('new-arrivals')} className="hover:text-white transition-colors">
                  New Season
                </button>
              </li>
              <li>
                <button onClick={() => openCategory('Shirts')} className="hover:text-white transition-colors">
                  Signature Overshirts
                </button>
              </li>
              <li>
                <button onClick={() => openCategory('Jackets')} className="hover:text-white transition-colors">
                  Italian Leather Jackets
                </button>
              </li>
              <li>
                <button onClick={() => openCategory('Trousers')} className="hover:text-white transition-colors">
                  Pleated Trousers
                </button>
              </li>
              <li>
                <button onClick={() => openCollection('premium-denim')} className="hover:text-white transition-colors">
                  Selvedge Denim
                </button>
              </li>
              <li>
                <button onClick={() => openCategory('Footwear')} className="hover:text-white transition-colors">
                  Chelsea Boots
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Services */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber-300">
              Services
            </p>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button onClick={() => setActiveView('account')} className="hover:text-white transition-colors">
                  Smart Size Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('tracking')} className="hover:text-white transition-colors">
                  Track Dispatched Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('account')} className="hover:text-white transition-colors">
                  Bespoke Consultations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('account')} className="hover:text-white transition-colors">
                  Complimentary Returns
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Atelier Locations */}
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber-300">
              Atelier Houses
            </p>
            <p className="text-neutral-400 leading-relaxed">
              Via Montenapoleone 18, Milan<br />
              Daikanyama, Tokyo<br />
              Lower Parel, Mumbai
            </p>
            <p className="text-[11px] font-mono text-neutral-500 pt-2">
              concierge@venaro.com<br />
              +91 (022) 8941 2026
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono gap-4">
          <p>© 2026 VÉNARO S.P.A. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <span>256-BIT SSL ENCRYPTION</span>
            <span>·</span>
            <span>PCI-DSS COMPLIANT</span>
            <span>·</span>
            <span>UPI & GLOBAL CARDS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
