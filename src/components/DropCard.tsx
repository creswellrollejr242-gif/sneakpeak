import React from 'react';
import { Sneaker } from '../types';
import { Bell, DollarSign, Calendar, TrendingUp, Sparkles, Tag } from 'lucide-react';
import { getRarityConfig } from '../constants';

interface DropCardProps {
  sneaker: Sneaker;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  onPreorder?: (id: string) => void;
  onClick?: (sneaker: Sneaker) => void;
  onCop?: (sneaker: Sneaker) => void;
}

const DropCard: React.FC<DropCardProps> = ({ sneaker, onToggleWishlist, isWishlisted, onClick, onCop }) => {
  const dropDate = new Date(sneaker.dropDate);
  const isPast = dropDate < new Date();
  const rarity = getRarityConfig(sneaker.hypeScore);

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden mb-4 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div 
        className="relative h-52 w-full cursor-pointer group"
        onClick={() => onClick?.(sneaker)}
      >
        <img 
          src={sneaker.image} 
          alt={sneaker.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors"></div>
        
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white border border-white/10 uppercase tracking-widest">
          {sneaker.brand}
        </div>
        
        {/* Rarity Badge */}
        <div className={`absolute bottom-4 right-4 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg ${rarity.color}`}>
          {sneaker.hypeScore >= 90 ? <Sparkles size={10} fill="currentColor" /> : <Tag size={10} fill="currentColor" />}
          {rarity.label}
        </div>

        {sneaker.isRaffle && (
          <div className="absolute top-4 left-4 bg-violet-600/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white shadow-lg tracking-widest">
            RAFFLE
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div 
           className="flex justify-between items-start mb-3 cursor-pointer"
           onClick={() => onClick?.(sneaker)}
        >
          <h3 className="text-lg font-black italic text-white leading-tight w-3/4 tracking-tight hover:text-violet-400 transition-colors">{sneaker.name}</h3>
          <div className="flex flex-col items-end">
             <span className="text-emerald-400 font-mono font-black text-lg">${sneaker.price}</span>
             {sneaker.resalePrice && (
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Resell: ${sneaker.resalePrice}</span>
             )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-[11px] text-zinc-500 mb-5 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-zinc-600" />
            <span>{isPast ? 'Released' : dropDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className={rarity.text} />
            <span className={rarity.text}>Score: {sneaker.hypeScore}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => onToggleWishlist(sneaker.id)}
            className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              isWishlisted 
                ? 'bg-zinc-800 text-violet-400 shadow-inner' 
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <Bell size={14} fill={isWishlisted ? "currentColor" : "none"} />
            {isPast ? 'Track Price' : (isWishlisted ? 'Watching' : 'Notify')}
          </button>
          
          {isPast && (
             <button 
                onClick={() => onCop?.(sneaker)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                title="View Prices"
             >
                <DollarSign size={16} />
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropCard;