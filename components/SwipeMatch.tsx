
import React, { useState } from 'react';
import { Heart, X, Info } from 'lucide-react';
import { Sneaker } from '../types';

interface SwipeMatchProps {
  onLike: (sneaker: Sneaker) => void;
  sneakers: Sneaker[];
}

const SwipeMatch: React.FC<SwipeMatchProps> = ({ onLike, sneakers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<'left' | 'right' | null>(null);

  // Fallback if list is empty
  if (sneakers.length === 0) {
    return <div className="h-full flex items-center justify-center text-zinc-500">No kicks found.</div>;
  }

  const currentSneaker = sneakers[currentIndex % sneakers.length];

  const handleSwipe = (direction: 'left' | 'right') => {
    setLastDirection(direction);
    if (direction === 'right') {
      onLike(currentSneaker);
    }
    
    setTimeout(() => {
      setLastDirection(null);
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 pb-20 overflow-hidden">
      <div className="relative w-full max-w-sm aspect-[3/4]">
        {/* Card Stack Effect (Background) */}
        <div className="absolute top-4 left-4 right-4 bottom-4 bg-zinc-800 rounded-2xl opacity-50 transform scale-95 translate-y-2"></div>
        
        {/* Active Card */}
        <div 
          className={`absolute inset-0 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl transition-transform duration-300 ${
            lastDirection === 'left' ? '-translate-x-full rotate-[-15deg] opacity-0' :
            lastDirection === 'right' ? 'translate-x-full rotate-[15deg] opacity-0' :
            'translate-x-0 rotate-0'
          }`}
        >
          <img 
            src={currentSneaker.image} 
            alt={currentSneaker.name} 
            className="w-full h-3/5 object-cover"
          />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 to-transparent p-4">
             <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold border border-white/10">
               {currentSneaker.brand}
             </span>
          </div>

          <div className="p-5 flex flex-col h-2/5 justify-between bg-gradient-to-b from-zinc-900 via-zinc-900 to-black">
            <div>
               <h2 className="text-2xl font-black italic tracking-tight text-white leading-tight mb-1">{currentSneaker.name}</h2>
               <p className="text-emerald-400 font-mono text-lg font-bold">${currentSneaker.price}</p>
            </div>
            
            <div className="flex gap-2 mt-2">
               <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                 Hype: {currentSneaker.hypeScore}
               </span>
               <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
                 {currentSneaker.isRaffle ? 'Raffle' : 'Retail'}
               </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-6">
          <button 
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 text-red-500 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
          >
            <X size={32} strokeWidth={3} />
          </button>
          
          <button 
             className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 flex items-center justify-center shadow-lg mt-2 hover:bg-zinc-800"
          >
            <Info size={20} />
          </button>

          <button 
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 text-emerald-500 flex items-center justify-center shadow-lg hover:scale-110 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all"
          >
            <Heart size={32} fill="currentColor" strokeWidth={0} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeMatch;
