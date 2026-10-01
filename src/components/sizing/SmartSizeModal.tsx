import React, { useState } from 'react';
import { X, Check, Sparkles, Ruler, ArrowRight, User } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductSize, FitType } from '../../types';

interface SmartSizeModalProps {
  onApplySize?: (size: ProductSize) => void;
}

export const SmartSizeModal: React.FC<SmartSizeModalProps> = ({ onApplySize }) => {
  const { isSizeCalculatorOpen, setIsSizeCalculatorOpen, user, updateUserPreferences } = useShop();

  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(user?.sizePreferences?.height || 180);
  const [weightKg, setWeightKg] = useState<number>(user?.sizePreferences?.weight || 76);
  const [chestInches, setChestInches] = useState<number>(user?.sizePreferences?.chest || 40);
  const [waistInches, setWaistInches] = useState<number>(user?.sizePreferences?.waist || 32);
  const [preferredFit, setPreferredFit] = useState<FitType>(user?.sizePreferences?.preferredFit || 'Regular Fit');

  const [calculated, setCalculated] = useState(false);

  if (!isSizeCalculatorOpen) return null;

  // Smart Sizing Recommendation Algorithm
  const calculateRecommendedSize = (): { size: ProductSize; confidence: number; note: string } => {
    let score = (chestInches * 1.5) + (weightKg * 0.4) + (heightCm * 0.2);

    if (preferredFit === 'Slim Fit') score -= 3;
    if (preferredFit === 'Oversized') score += 4;

    if (score < 118) return { size: 'XS', confidence: 96, note: 'Cut close to chest for tailored drape.' };
    if (score < 125) return { size: 'S', confidence: 94, note: 'Flattering chest taper with clean shoulder seam.' };
    if (score < 133) return { size: 'M', confidence: 98, note: 'Balanced silhouette providing 2 inches of natural breathing room.' };
    if (score < 142) return { size: 'L', confidence: 97, note: 'Structured drop-shoulder contour with ease through the torso.' };
    if (score < 152) return { size: 'XL', confidence: 95, note: 'Relaxed athletic chest room with full arm mobility.' };
    return { size: 'XXL', confidence: 93, note: 'Spacious architectural cut ideal for layered styling.' };
  };

  const recommendation = calculateRecommendedSize();

  const handleApply = () => {
    updateUserPreferences({
      height: heightCm,
      weight: weightKg,
      chest: chestInches,
      waist: waistInches,
      preferredFit,
      recommendedSize: recommendation.size,
    });
    if (onApplySize) {
      onApplySize(recommendation.size);
    }
    setIsSizeCalculatorOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setIsSizeCalculatorOpen(false)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300 bg-amber-400/10 px-3 py-1 rounded border border-amber-400/20 mb-2">
            <Sparkles size={12} />
            <span>VÉNARO SMART FIT ALGORITHM</span>
          </div>
          <h3 className="text-2xl font-brand font-bold text-white tracking-wide">
            Interactive Size Intelligence
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto font-light">
            Our atelier sizing engine computes bespoke garment fit based on your anatomical proportions and drape preference.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          {/* Height & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-neutral-300 font-medium">Height (cm)</label>
                <span className="font-mono text-amber-300">{heightCm} cm</span>
              </div>
              <input
                type="range"
                min="160"
                max="205"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-neutral-300 font-medium">Weight (kg)</label>
                <span className="font-mono text-amber-300">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min="50"
                max="125"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Chest & Waist */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-neutral-300 font-medium">Chest (inches)</label>
                <span className="font-mono text-amber-300">{chestInches}"</span>
              </div>
              <input
                type="range"
                min="34"
                max="52"
                value={chestInches}
                onChange={(e) => setChestInches(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-neutral-300 font-medium">Waist (inches)</label>
                <span className="font-mono text-amber-300">{waistInches}"</span>
              </div>
              <input
                type="range"
                min="26"
                max="44"
                value={waistInches}
                onChange={(e) => setWaistInches(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Preferred Fit Segmented Control */}
          <div>
            <label className="block text-neutral-300 mb-2 font-medium">Preferred Fit Drape</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Slim Fit', 'Regular Fit', 'Oversized'] as FitType[]).map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setPreferredFit(fit)}
                  className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                    preferredFit === fit
                      ? 'bg-amber-400/15 border-amber-400 text-amber-200 font-semibold'
                      : 'border-white/10 text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Live Recommendation Result Box */}
          <div className="mt-6 p-5 glass-panel rounded-xl border border-amber-400/30 bg-amber-400/5 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
              ATELIER CALIBRATION COMPLETE
            </span>
            <div className="text-4xl font-brand font-bold text-white my-1">
              Recommended Size: <span className="text-amber-400">{recommendation.size}</span>
            </div>
            <p className="text-xs text-neutral-300 font-light max-w-sm mx-auto mt-2">
              {recommendation.note}
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-[11px] font-mono text-neutral-400">
              <span>Fit Confidence: {recommendation.confidence}%</span>
              <span>·</span>
              <span>Free returns on sizing</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-3 bg-white text-black font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply Size {recommendation.size} to Garment</span>
              <Check size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
