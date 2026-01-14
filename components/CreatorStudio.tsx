
import React, { useState } from 'react';
import { Share2, Type } from 'lucide-react';
import { Sneaker } from '../types';

interface CreatorStudioProps {
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  sneakers: Sneaker[];
}

const TEMPLATES = [
  { id: 'w', label: "GOT 'EM", color: "bg-green-600", overlay: "GOT 'EM" },
  { id: 'l', label: "TOOK AN L", color: "bg-red-600", overlay: "DIDN'T GET 'EM" },
  { id: 'grail', label: "GRAIL", color: "bg-amber-500", overlay: "GRAIL SECURED" },
  { id: 'brick', label: "BRICK", color: "bg-zinc-600", overlay: "BRICK ALERT" },
];

const CreatorStudio: React.FC<CreatorStudioProps> = ({ onShowToast, sneakers }) => {
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(sneakers[0] || null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [customText, setCustomText] = useState('');

  const handleShare = () => {
    onShowToast("Image saved to gallery!", "success");
  };

  if (!selectedSneaker) return <div className="p-10 text-center text-zinc-500">No sneakers loaded.</div>;

  return (
    <div className="h-full overflow-y-auto pb-24 px-4 pt-4">
       <h1 className="text-2xl font-black italic tracking-tighter mb-1">CREATOR <span className="text-violet-500">STUDIO</span></h1>
       <p className="text-zinc-400 text-sm mb-6">Create viral content for your socials.</p>

       <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl aspect-[4/5]">
          {/* Background Blur */}
          <div className="absolute inset-0 bg-black">
             <img src={selectedSneaker.image} className="w-full h-full object-cover opacity-50 blur-xl scale-150" />
          </div>
          
          {/* Main Content */}
          <div className="relative z-10 w-full flex flex-col items-center">
             <img 
               src={selectedSneaker.image} 
               className="w-64 h-64 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500" 
             />
             
             <div className="mt-8 text-center">
               <h2 className={`text-4xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg ${selectedTemplate.id === 'w' ? 'animate-bounce' : ''}`}>
                 {selectedTemplate.overlay}
               </h2>
               <p className="text-emerald-400 font-mono font-bold mt-2">{selectedSneaker.name}</p>
               {customText && <p className="text-white font-bold mt-4 bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md">{customText}</p>}
             </div>
          </div>
          
          {/* Watermark */}
          <div className="absolute bottom-4 right-4 text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
            SneakPeak App
          </div>
       </div>

       <div className="space-y-6">
          {/* Sneaker Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Select Kicks</label>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
               {sneakers.map(s => (
                 <button 
                   key={s.id}
                   onClick={() => setSelectedSneaker(s)}
                   className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedSneaker.id === s.id ? 'border-violet-500 scale-110' : 'border-zinc-800 opacity-60'}`}
                 >
                    <img src={s.image} className="w-full h-full object-cover" />
                 </button>
               ))}
            </div>
          </div>

          {/* Template Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Vibe Check</label>
            <div className="grid grid-cols-4 gap-2">
               {TEMPLATES.map(t => (
                 <button
                   key={t.id}
                   onClick={() => setSelectedTemplate(t)}
                   className={`py-2 rounded-lg text-xs font-black uppercase transition-all ${
                     selectedTemplate.id === t.id ? t.color + ' text-white scale-105 shadow-lg' : 'bg-zinc-800 text-zinc-500'
                   }`}
                 >
                   {t.label}
                 </button>
               ))}
            </div>
          </div>

          {/* Custom Text */}
          <div>
             <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Add Caption</label>
             <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                <Type size={16} className="text-zinc-500 mr-2" />
                <input 
                  type="text" 
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. GRAIL ACQUIRED"
                  className="bg-transparent w-full text-white text-sm outline-none placeholder-zinc-600"
                  maxLength={30}
                />
             </div>
          </div>

          <button 
            onClick={handleShare}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-xl text-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 mb-8"
          >
            <Share2 size={20} strokeWidth={2.5} />
            Share to Socials
          </button>
       </div>
    </div>
  );
};

export default CreatorStudio;
