
import React, { useState } from 'react';
import { Sneaker } from '../types';
import { X, Trophy, TrendingUp, DollarSign, ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { getRarityConfig } from '../constants';

interface VersusModeProps {
  sneakers: Sneaker[];
  onClose: () => void;
}

const VersusMode: React.FC<VersusModeProps> = ({ sneakers, onClose }) => {
  const [leftId, setLeftId] = useState<string>(sneakers[0]?.id || '');
  const [rightId, setRightId] = useState<string>(sneakers[1]?.id || '');

  const leftSneaker = sneakers.find(s => s.id === leftId);
  const rightSneaker = sneakers.find(s => s.id === rightId);

  const getWinnerClass = (val1: number, val2: number, higherIsBetter: boolean) => {
    if (val1 === val2) return 'text-zinc-400';
    if (higherIsBetter) return val1 > val2 ? 'text-emerald-400 font-bold' : 'text-red-500 opacity-60';
    return val1 < val2 ? 'text-emerald-400 font-bold' : 'text-red-500 opacity-60';
  };

  const calculateROI = (s: Sneaker | undefined) => {
    if (!s || !s.resalePrice) return 0;
    return ((s.resalePrice - s.price) / s.price) * 100;
  };

  const leftROI = calculateROI(leftSneaker);
  const rightROI = calculateROI(rightSneaker);

  return (
    <div className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col animate-[fadeIn_0.2s_ease-out]">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-xl font-black italic text-white flex items-center gap-2">
          <ArrowRightLeft className="text-violet-500" /> VERSUS <span className="text-zinc-600">MODE</span>
        </h2>
        <button onClick={onClose} className="bg-zinc-800 p-2 rounded-full text-white hover:bg-zinc-700">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe">
        {/* Selection Area */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Contender A</label>
            <select 
              value={leftId} 
              onChange={(e) => setLeftId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-violet-500"
            >
              {sneakers.map(s => <option key={s.id} value={s.id}>{s.name.substring(0, 20)}...</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase">Contender B</label>
            <select 
              value={rightId} 
              onChange={(e) => setRightId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-violet-500"
            >
              {sneakers.map(s => <option key={s.id} value={s.id}>{s.name.substring(0, 20)}...</option>)}
            </select>
          </div>
        </div>

        {/* Visuals */}
        <div className="grid grid-cols-2 relative h-48">
          <div className="relative border-r border-zinc-800">
             {leftSneaker && (
               <>
                 <img src={leftSneaker.image} className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                 <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-xs font-black text-white leading-tight block">{leftSneaker.brand}</span>
                    <span className="text-[10px] text-zinc-400 leading-tight block truncate">{leftSneaker.name}</span>
                 </div>
               </>
             )}
          </div>
          <div className="relative">
             {rightSneaker && (
               <>
                 <img src={rightSneaker.image} className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                 <div className="absolute bottom-2 left-2 right-2 text-right">
                    <span className="text-xs font-black text-white leading-tight block">{rightSneaker.brand}</span>
                    <span className="text-[10px] text-zinc-400 leading-tight block truncate">{rightSneaker.name}</span>
                 </div>
               </>
             )}
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-violet-600 rounded-full w-10 h-10 flex items-center justify-center font-black italic text-violet-500 z-10 shadow-xl shadow-violet-500/20">
            VS
          </div>
        </div>

        {/* Stats Grid */}
        {leftSneaker && rightSneaker && (
          <div className="p-4 space-y-4">
            
            {/* Stat Row: Retail */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
               <div className="flex justify-center mb-2">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                   <DollarSign size={12} /> Retail Price
                 </span>
               </div>
               <div className="flex justify-between items-center px-4">
                 <div className={`text-lg font-mono ${getWinnerClass(leftSneaker.price, rightSneaker.price, false)}`}>
                    ${leftSneaker.price}
                 </div>
                 <div className={`text-lg font-mono ${getWinnerClass(rightSneaker.price, leftSneaker.price, false)}`}>
                    ${rightSneaker.price}
                 </div>
               </div>
            </div>

            {/* Stat Row: Resale */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
               <div className="flex justify-center mb-2">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                   <TrendingUp size={12} /> Resale Value
                 </span>
               </div>
               <div className="flex justify-between items-center px-4">
                 <div className={`text-lg font-mono ${getWinnerClass(leftSneaker.resalePrice || 0, rightSneaker.resalePrice || 0, true)}`}>
                    ${leftSneaker.resalePrice}
                 </div>
                 <div className={`text-lg font-mono ${getWinnerClass(rightSneaker.resalePrice || 0, leftSneaker.resalePrice || 0, true)}`}>
                    ${rightSneaker.resalePrice}
                 </div>
               </div>
            </div>

            {/* Stat Row: ROI */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
               <div className="flex justify-center mb-2">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                   <Trophy size={12} /> Return on Investment
                 </span>
               </div>
               <div className="flex justify-between items-center px-4">
                 <div className={`text-lg font-mono ${getWinnerClass(leftROI, rightROI, true)}`}>
                    {leftROI.toFixed(0)}%
                 </div>
                 <div className={`text-lg font-mono ${getWinnerClass(rightROI, leftROI, true)}`}>
                    {rightROI.toFixed(0)}%
                 </div>
               </div>
            </div>

            {/* Stat Row: Hype */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
               <div className="flex justify-center mb-2">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1">
                   🔥 Hype Score
                 </span>
               </div>
               <div className="flex justify-between items-center px-4">
                 <div className={`text-lg font-mono ${getWinnerClass(leftSneaker.hypeScore, rightSneaker.hypeScore, true)}`}>
                    {leftSneaker.hypeScore}
                 </div>
                 <div className={`text-lg font-mono ${getWinnerClass(rightSneaker.hypeScore, leftSneaker.hypeScore, true)}`}>
                    {rightSneaker.hypeScore}
                 </div>
               </div>
            </div>

            {/* Verdict */}
            <div className="mt-6 text-center">
              <span className="text-xs font-bold text-zinc-500 uppercase mb-2 block">THE BETTER BUY</span>
              <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-xl p-4 flex items-center justify-center gap-3">
                 <CheckCircle2 size={24} className="text-emerald-500" />
                 <span className="text-xl font-black italic text-white uppercase tracking-tighter">
                    {leftROI > rightROI ? leftSneaker.name : rightSneaker.name}
                 </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default VersusMode;
