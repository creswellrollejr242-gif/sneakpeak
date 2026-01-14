import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { UserPreferences } from '../types';

interface OnboardingProps {
  username: string;
  onComplete: (prefs: UserPreferences) => void;
}

const SIZES = ['4', '5', '6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13', '14'];
const BRANDS = ['Nike', 'Jordan', 'Adidas', 'Yeezy', 'New Balance', 'PUMA', 'Asics', 'Crocs'];

const Onboarding: React.FC<OnboardingProps> = ({ username, onComplete }) => {
  const [step, setStep] = useState(1);
  const [size, setSize] = useState('10');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    } else {
      setSelectedBrands(prev => [...prev, brand]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onComplete({ size, brands: selectedBrands });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center p-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Progress Bar */}
      <div className="w-full max-w-sm flex gap-2 mb-8">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-violet-600' : 'bg-zinc-800'}`}></div>
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-violet-600' : 'bg-zinc-800'}`}></div>
      </div>

      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2">
          YO, <span className="text-violet-500 uppercase">{username}</span>.
        </h1>
        <p className="text-zinc-500 mb-8">Let's personalize your setup.</p>

        {step === 1 && (
          <div className="animate-[slideUp_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-white mb-4">What's your size?</h2>
            <div className="grid grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto no-scrollbar p-1">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 rounded-xl font-bold border-2 transition-all ${
                    size === s
                      ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-600 mt-4">We'll use this to find deals in your size.</p>
          </div>
        )}

        {step === 2 && (
          <div className="animate-[slideUp_0.3s_ease-out]">
            <h2 className="text-xl font-bold text-white mb-4">Brands you rock?</h2>
            <div className="grid grid-cols-2 gap-3">
              {BRANDS.map((brand) => {
                const isSelected = selectedBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`py-4 px-4 rounded-xl font-bold border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-white text-black'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {brand}
                    {isSelected && <Check size={16} className="text-black" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-zinc-600 mt-4">Select at least one to continue.</p>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={step === 2 && selectedBrands.length === 0}
          className="w-full mt-8 bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-xl text-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {step === 1 ? 'Next' : 'Finish Setup'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;