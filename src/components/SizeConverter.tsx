import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeConverterProps {
  onClose: () => void;
}

const BRANDS = ['Nike/Jordan', 'Adidas/Yeezy', 'New Balance', 'Converse'];

// Mock conversion logic (simplified for demo)
const SIZE_MAP: Record<string, Record<string, number>> = {
  'Nike/Jordan': { offset: 0, euOffset: 33, cmBase: 20 },
  'Adidas/Yeezy': { offset: 0.5, euOffset: 33.5, cmBase: 20.5 },
  'New Balance': { offset: 0, euOffset: 32.5, cmBase: 20 },
  'Converse': { offset: -1, euOffset: 32, cmBase: 21 },
};

const SizeConverter: React.FC<SizeConverterProps> = ({ onClose }) => {
  const [usSize, setUsSize] = useState<string>('10');
  const [brand, setBrand] = useState('Nike/Jordan');

  const calculateSizes = () => {
    const us = parseFloat(usSize) || 0;
    const rules = SIZE_MAP[brand];
    
    const uk = us - 1 + rules.offset;
    const eu = 30 + us + (us > 7 ? 3 : 2) + rules.offset; // Approximate
    const cm = rules.cmBase + us;

    return { uk, eu, cm };
  };

  const { uk, eu, cm } = calculateSizes();

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-zinc-900 w-full max-w-sm rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
           <h3 className="font-black italic text-white flex items-center gap-2">
             <Ruler className="text-violet-500" /> SIZE <span className="text-zinc-500">CONVERTER</span>
           </h3>
           <button onClick={onClose}><X size={20} className="text-zinc-500 hover:text-white" /></button>
        </div>

        <div className="p-6 space-y-6">
           <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Brand Profile</label>
              <div className="grid grid-cols-2 gap-2">
                 {BRANDS.map(b => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                        brand === b 
                          ? 'bg-violet-600 border-violet-600 text-white' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                       {b}
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">US Size Input</label>
              <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                 <span className="font-bold text-zinc-500 mr-4">US</span>
                 <input 
                   type="number" 
                   value={usSize}
                   onChange={(e) => setUsSize(e.target.value)}
                   className="bg-transparent text-white font-mono text-xl font-bold w-full outline-none"
                 />
              </div>
           </div>

           <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800 text-center">
                 <span className="text-[10px] text-zinc-500 font-bold block mb-1">UK</span>
                 <span className="text-xl font-mono font-bold text-white">{uk}</span>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800 text-center">
                 <span className="text-[10px] text-zinc-500 font-bold block mb-1">EU</span>
                 <span className="text-xl font-mono font-bold text-white">{eu}</span>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800 text-center">
                 <span className="text-[10px] text-zinc-500 font-bold block mb-1">CM</span>
                 <span className="text-xl font-mono font-bold text-white">{cm}</span>
              </div>
           </div>
        </div>
        
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-center">
           <p className="text-[10px] text-zinc-600">Estimates vary by specific silhouette (e.g. Yeezy 350 vs 700).</p>
        </div>
      </div>
    </div>
  );
};

export default SizeConverter;