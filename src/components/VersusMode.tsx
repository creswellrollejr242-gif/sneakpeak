import React, { useState } from 'react';
import { Sneaker } from '../types';
import { X, Trophy, TrendingUp, DollarSign, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

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
    if (higherIsBetter) return val1 > val2 ? 'text-emerald-400 font-black drop-shadow-md' : 'text-red-400 opacity-70';
    return val1 < val2 ? 'text-emerald-400 font-black drop-shadow-md' : 'text-red-400 opacity-70';
  };

  const calculateROI = (s: Sneaker | undefined) => {
    if (!s || !s.resalePrice) return 0;
    return ((s.resalePrice - s.price) / s.price) * 100;
  };

  const leftROI = calculateROI(leftSneaker);
  const rightROI = calculateROI(rightSneaker);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-zinc-950 w-full h-full sm:max-w-lg sm:h-[85vh] sm:rounded-2xl border-x sm:border border-zinc-800 flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
          <h2 className="text-xl font-black italic text-white flex items-center gap-2">
            <ArrowRightLeft className="text-violet-500" /> VERSUS <span className="text-zinc-500">MODE</span>
          </h2>
          <button onClick={onClose} className="bg-zinc-800 p-2 rounded-full text-white hover:bg-zinc-700 border border-zinc-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-safe no-scrollbar">
          {/* Selection Area */}
          <div className="grid grid-cols-2 gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contender A</label>
              <select 
                value={leftId} 
                onChange={(e) => setLeftId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm font-bold text-white outline-none focus:border-violet-500 appearance-none"
              >
                {sneakers.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Contender B</label>
              <select 
                value={rightId} 
                onChange={(e) => setRightId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm font-bold text-white outline-none focus:border-violet-500 appearance-none"
              >
                {sneakers.map(s => <option key={s.id} value={s.id} className="text-black">{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Visuals */}
          <div className="grid grid-cols-2 relative h-56 bg-zinc-900">
            <div className="relative border-r border-zinc-800">
               {leftSneaker && (
                 <>
                   <img src={leftSneaker.image} className="w-full h-full object-cover opacity-90" alt={leftSneaker.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                   <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-black text-white leading-tight block bg-black/60 backdrop-blur-md px-2 py-1 rounded w-fit border border-white/10">{leftSneaker.brand}</span>
                   </div>
                 </>
               )}
            </div>
            <div className="relative">
               {rightSneaker && (
                 <>
                   <img src={rightSneaker.image} className="w-full h-full object-cover opacity-90" alt={rightSneaker.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                   <div className="absolute bottom-3 left-3 right-3 flex justify-end">
                      <span className="text-xs font-black text-white leading-tight block bg-black/60 backdrop-blur-md px-2 py-1 rounded w-fit border border-white/10">{rightSneaker.brand}</span>
                   </div>
                 </>
               )}
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border-4 border-violet-600 rounded-full w-14 h-14 flex items-center justify-center font-black italic text-violet-500 z-10 shadow-xl shadow-violet-500/30 text-xl">
              VS
            </div>
          </div>

          {/* Stats Grid */}
          {leftSneaker && rightSneaker && (
            <div className="p-4 space-y-4">
              
              {/* Stat Row: Retail */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg">
                 <div className="flex justify-center mb-3">
                   <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1 tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                     <DollarSign size={14} className="text-violet-500" /> Retail Price
                   </span>
                 </div>
                 <div className="flex justify-between items-center px-2">
                   <div className={`text-2xl font-mono ${getWinnerClass(leftSneaker.price, rightSneaker.price, false)}`}>
                      ${leftSneaker.price}
                   </div>
                   <div className={`text-2xl font-mono ${getWinnerClass(rightSneaker.price, leftSneaker.price, false)}`}>
                      ${rightSneaker.price}
                   </div>
                 </div>
              </div>

              {/* Stat Row: Resale */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg">
                 <div className="flex justify-center mb-3">
                   <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1 tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                     <TrendingUp size={14} className="text-violet-500" /> Resale Value
                   </span>
                 </div>
                 <div className="flex justify-between items-center px-2">
                   <div className={`text-2xl font-mono ${getWinnerClass(leftSneaker.resalePrice || 0, rightSneaker.resalePrice || 0, true)}`}>
                      ${leftSneaker.resalePrice}
                   </div>
                   <div className={`text-2xl font-mono ${getWinnerClass(rightSneaker.resalePrice || 0, leftSneaker.resalePrice || 0, true)}`}>
                      ${rightSneaker.resalePrice}
                   </div>
                 </div>
              </div>

              {/* Stat Row: ROI */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg">
                 <div className="flex justify-center mb-3">
                   <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1 tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                     <Trophy size={14} className="text-violet-500" /> ROI %
                   </span>
                 </div>
                 <div className="flex justify-between items-center px-2">
                   <div className={`text-2xl font-mono ${getWinnerClass(leftROI, rightROI, true)}`}>
                      {leftROI.toFixed(0)}%
                   </div>
                   <div className={`text-2xl font-mono ${getWinnerClass(rightROI, leftROI, true)}`}>
                      {rightROI.toFixed(0)}%
                   </div>
                 </div>
              </div>

              {/* Stat Row: Hype */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-lg">
                 <div className="flex justify-center mb-3">
                   <span className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1 tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                     🔥 Hype Score
                   </span>
                 </div>
                 <div className="flex justify-between items-center px-2">
                   <div className={`text-2xl font-mono ${getWinnerClass(leftSneaker.hypeScore, rightSneaker.hypeScore, true)}`}>
                      {leftSneaker.hypeScore}
                   </div>
                   <div className={`text-2xl font-mono ${getWinnerClass(rightSneaker.hypeScore, leftSneaker.hypeScore, true)}`}>
                      {rightSneaker.hypeScore}
                   </div>
                 </div>
              </div>

              {/* Verdict */}
              <div className="mt-6 text-center">
                <span className="text-xs font-bold text-zinc-500 uppercase mb-3 block tracking-widest">AND THE WINNER IS</span>
                <div className="bg-emerald-900/20 border border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-500/10">
                   <CheckCircle2 size={32} className="text-emerald-500 mb-1" />
                   <span className="text-2xl font-black italic text-white uppercase tracking-tight text-center leading-none">
                      {leftROI > rightROI ? leftSneaker.name : rightSneaker.name}
                   </span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersusMode;