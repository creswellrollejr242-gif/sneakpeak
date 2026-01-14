
import React from 'react';
import { PortfolioItem, Sneaker } from '../types';
import { X, ArrowRightLeft } from 'lucide-react';

interface TradeProposalModalProps {
  portfolio: PortfolioItem[];
  allSneakers: Sneaker[];
  onSelect: (item: PortfolioItem) => void;
  onClose: () => void;
}

const TradeProposalModal: React.FC<TradeProposalModalProps> = ({ portfolio, allSneakers, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[80] bg-black/90 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 overflow-hidden max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center gap-2">
            <ArrowRightLeft className="text-violet-500" /> Select Item to Offer
          </h3>
          <button onClick={onClose}><X size={20} className="text-zinc-500" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {portfolio.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">
              Your closet is empty. Add shoes to trade.
            </div>
          ) : (
            portfolio.map(item => {
              const sneaker = allSneakers.find(s => s.id === item.sneakerId);
              if (!sneaker) return null;
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => onSelect(item)}
                  className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center gap-4 hover:border-violet-500 cursor-pointer"
                >
                  <img src={sneaker.image} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{sneaker.name}</h4>
                    <p className="text-xs text-zinc-500">Size: {item.size} • Cond: {item.condition}</p>
                    <p className="text-xs font-mono text-emerald-400 mt-1">Est. Value: ${sneaker.resalePrice || sneaker.price}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeProposalModal;
