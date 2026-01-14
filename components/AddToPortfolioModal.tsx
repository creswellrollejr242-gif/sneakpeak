
import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Sneaker, PortfolioItem } from '../types';

interface AddToPortfolioModalProps {
  sneaker: Sneaker;
  onClose: () => void;
  onAdd: (item: PortfolioItem) => void;
}

const CONDITIONS = ['DS', 'VNDS', 'Used'] as const;
const SIZES = ['4', '5', '6', '7', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13', '14'];

const AddToPortfolioModal: React.FC<AddToPortfolioModalProps> = ({ sneaker, onClose, onAdd }) => {
  const [purchasePrice, setPurchasePrice] = useState(sneaker.price.toString());
  const [size, setSize] = useState('10');
  const [condition, setCondition] = useState<'DS' | 'VNDS' | 'Used'>('DS');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PortfolioItem = {
      id: Date.now().toString(),
      sneakerId: sneaker.id,
      size,
      purchasePrice: Number(purchasePrice),
      condition,
      purchaseDate: new Date().toISOString()
    };
    onAdd(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-zinc-950 w-full max-w-sm rounded-2xl border border-violet-500/30 overflow-hidden shadow-2xl relative">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="font-black italic text-white flex items-center gap-2">
            ADD TO <span className="text-violet-500">COLLECTION</span>
          </h3>
          <button onClick={onClose}><X size={20} className="text-zinc-500" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-4 items-center mb-2">
             <img src={sneaker.image} className="w-16 h-16 rounded-lg object-cover border border-zinc-700" />
             <div>
                <p className="font-bold text-white text-sm leading-tight">{sneaker.name}</p>
                <p className="text-xs text-zinc-500">{sneaker.brand}</p>
             </div>
          </div>

          <div>
             <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Purchase Price ($)</label>
             <input 
               type="number" 
               value={purchasePrice} 
               onChange={(e) => setPurchasePrice(e.target.value)}
               className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white font-mono font-bold focus:border-violet-500 outline-none"
             />
          </div>

          <div>
             <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">Size (US)</label>
             <select 
               value={size} 
               onChange={(e) => setSize(e.target.value)}
               className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none"
             >
               {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>

          <div>
             <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">Condition</label>
             <div className="grid grid-cols-3 gap-2">
               {CONDITIONS.map(c => (
                 <button
                   key={c}
                   type="button"
                   onClick={() => setCondition(c)}
                   className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                     condition === c 
                       ? 'bg-violet-600 border-violet-600 text-white' 
                       : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white'
                   }`}
                 >
                   {c}
                 </button>
               ))}
             </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-xl mt-4 flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            CONFIRM ADD
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToPortfolioModal;
