import React, { useState, useEffect } from 'react';
import { Sneaker, PortfolioItem, Retailer } from '../types';
import { X, Calendar, TrendingUp, ExternalLink, ShieldCheck, Share2, Bell, Loader2, Check, Lock, PlusCircle, CalendarPlus, Ticket, BarChart3, Info, Shirt, Flag, Sparkles } from 'lucide-react';
import { getRarityConfig } from '../constants';
import AddToPortfolioModal from './AddToPortfolioModal';
import { generateStyleAdvice } from '../services/geminiService';

interface SneakerDetailProps {
  sneaker: Sneaker;
  onClose: () => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  isPremium?: boolean;
  onOpenPremium?: () => void;
  onAddToPortfolio?: (item: PortfolioItem) => void;
  onReportIssue?: (type: string) => void;
  retailers?: Retailer[];
  initialTab?: 'overview' | 'raffles' | 'market' | 'style';
}

interface StockInfo {
  price: number;
  available: boolean;
}

const SIZES = ['4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'];

const SneakerDetail: React.FC<SneakerDetailProps> = ({ sneaker, onClose, onToggleWishlist, isWishlisted, isPremium, onOpenPremium, onAddToPortfolio, onReportIssue, retailers = [], initialTab = 'overview' }) => {
  const rarity = getRarityConfig(sneaker.hypeScore);
  const dropDate = new Date(sneaker.dropDate);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'raffles' | 'market' | 'style'>(initialTab);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [stockData, setStockData] = useState<Record<string, StockInfo>>({});
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  
  // AI Style State
  const [styleAdvice, setStyleAdvice] = useState<{fit: string, color: string} | null>(null);
  const [loadingStyle, setLoadingStyle] = useState(false);

  // Mock Price History
  const generatePriceHistory = () => {
    const data = [];
    let price = sneaker.resalePrice || sneaker.price;
    for (let i = 0; i < 6; i++) {
        price = price * (1 + (Math.random() * 0.1 - 0.05));
        data.push(price);
    }
    return data;
  };
  const priceHistory = generatePriceHistory();
  const maxPrice = Math.max(...priceHistory);
  const minPrice = Math.min(...priceHistory);

  // Stock Check Simulation
  useEffect(() => {
    if (selectedSize && activeTab === 'market') {
      setIsScanning(true);
      setStockData({});

      const timer = setTimeout(() => {
        const basePrice = sneaker.resalePrice || sneaker.price;
        const volatility = 0.2;
        const newStockData: Record<string, StockInfo> = {};
        
        // Generate mock data for each retailer
        retailers.forEach(r => {
           newStockData[r.name] = {
             price: Math.floor(basePrice * (1 + (Math.random() * volatility - volatility/2))),
             available: Math.random() > 0.2 // 80% chance available
           };
        });
        
        setStockData(newStockData);
        setIsScanning(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [selectedSize, sneaker, activeTab, retailers]);

  // Load Style Advice via AI when tab is opened
  useEffect(() => {
    if (activeTab === 'style' && !styleAdvice && !loadingStyle) {
      const fetchStyle = async () => {
        setLoadingStyle(true);
        const advice = await generateStyleAdvice(sneaker.name);
        setStyleAdvice(advice);
        setLoadingStyle(false);
      };
      fetchStyle();
    }
  }, [activeTab, sneaker.name, styleAdvice, loadingStyle]);

  const handleAddToCalendar = () => {
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  const handleReport = (issue: string) => {
    if (onReportIssue) onReportIssue(issue);
    setShowReportMenu(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-zinc-950 w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-2xl rounded-t-3xl border-t sm:border border-zinc-800 flex flex-col shadow-2xl overflow-hidden relative animate-[slideUp_0.3s_ease-out]">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>

          <div className="overflow-y-auto flex-1 pb-safe no-scrollbar">
            {/* Hero Image */}
            <div className="relative h-64 w-full bg-zinc-900">
               <img src={sneaker.image} alt={sneaker.name} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-90"></div>
               
               <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                     <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase ${rarity.color}`}>
                        {rarity.label}
                     </div>
                     {sneaker.isRaffle && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-violet-600 text-white tracking-widest">
                           <Ticket size={10} /> RAFFLE
                        </div>
                     )}
                  </div>
                  <h2 className="text-2xl font-black italic text-white leading-tight tracking-tight mb-1">{sneaker.name}</h2>
                  <div className="flex justify-between items-end">
                     <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{sneaker.brand}</p>
                     <button 
                       onClick={handleAddToCalendar}
                       className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-md transition-all active:scale-95"
                     >
                       {calendarAdded ? <Check size={12} className="text-emerald-400" /> : <CalendarPlus size={12} />}
                       {calendarAdded ? 'Added' : 'Sync Calendar'}
                     </button>
                  </div>
               </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800 px-4 overflow-x-auto no-scrollbar bg-zinc-950 sticky top-0 z-10">
               <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Info size={14} />} />
               <TabButton label="Raffles" active={activeTab === 'raffles'} onClick={() => setActiveTab('raffles')} icon={<Ticket size={14} />} count={sneaker.raffles?.length} />
               <TabButton label="Market" active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<BarChart3 size={14} />} />
               <TabButton label="Style" active={activeTab === 'style'} onClick={() => setActiveTab('style')} icon={<Shirt size={14} />} />
            </div>

            <div className="p-6 min-h-[300px]">
               {/* OVERVIEW TAB */}
               {activeTab === 'overview' && (
                 <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
                    <div className="grid grid-cols-2 gap-3">
                       <StatBox label="Retail Price" value={`$${sneaker.price}`} color="text-white" />
                       <StatBox label="Est. Resale" value={`$${sneaker.resalePrice || 'N/A'}`} color="text-emerald-400" />
                       <StatBox label="Release Date" value={dropDate.toLocaleDateString()} color="text-white" icon={<Calendar size={14} className="text-violet-500" />} />
                       <StatBox label="Hype Score" value={`${sneaker.hypeScore}/100`} color={rarity.text} icon={<TrendingUp size={14} />} />
                    </div>
                    
                    <div className="px-1">
                       <h3 className="text-[10px] font-black text-zinc-600 mb-3 uppercase tracking-widest">Technical Brief</h3>
                       <p className="text-zinc-400 text-sm leading-relaxed">{sneaker.description}</p>
                    </div>

                    {/* Market Snapshot - Premium Insight Treatement */}
                    <div className="bg-zinc-900 rounded-2xl p-6 relative overflow-hidden group shadow-xl">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                            Market Performance
                            {!isPremium && <Sparkles size={12} className="text-amber-500" />}
                          </h3>
                          {isPremium && <span className="text-[10px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded tracking-widest">PRO</span>}
                       </div>
                       
                       <div className={`relative h-24 w-full flex items-end gap-2 transition-all duration-700 ${!isPremium ? 'blur-[6px] opacity-20 scale-95' : ''}`}>
                          {priceHistory.map((val, i) => {
                             const heightPercent = ((val - minPrice) / (maxPrice - minPrice)) * 80 + 10;
                             return (
                                <div key={i} className={`flex-1 rounded-t-md ${isPremium ? 'bg-violet-600/30' : 'bg-zinc-800'}`} style={{ height: `${heightPercent}%` }}>
                                   {isPremium && <div className="w-full h-1 bg-violet-400 rounded-t-md"></div>}
                                </div>
                             );
                          })}
                       </div>

                       {!isPremium && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-zinc-900/10 backdrop-blur-[2px]">
                             <button 
                                onClick={onOpenPremium} 
                                className="bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-2xl uppercase tracking-widest transition-all active:scale-95"
                             >
                                <Lock size={12} fill="currentColor" /> Unlock Analysis
                             </button>
                             <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-4 text-center">Historical data mapping restricted to Pro tiers</p>
                          </div>
                       )}
                    </div>

                    {/* Report Issue Button */}
                    <div className="flex justify-center pt-2 relative">
                        {showReportMenu && (
                          <div className="absolute bottom-full mb-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 shadow-2xl flex flex-col gap-1 z-10 w-48 animate-[fadeIn_0.1s_ease-out]">
                             <button onClick={() => handleReport('Wrong Price')} className="text-[10px] font-bold text-left text-zinc-400 hover:text-white hover:bg-zinc-800 p-2.5 rounded-lg uppercase">Wrong Price</button>
                             <button onClick={() => handleReport('Wrong Date')} className="text-[10px] font-bold text-left text-zinc-400 hover:text-white hover:bg-zinc-800 p-2.5 rounded-lg uppercase">Wrong Date</button>
                             <button onClick={() => handleReport('Fake/Bad Image')} className="text-[10px] font-bold text-left text-zinc-400 hover:text-white hover:bg-zinc-800 p-2.5 rounded-lg uppercase">Bad Image</button>
                          </div>
                        )}
                        <button 
                          onClick={() => setShowReportMenu(!showReportMenu)}
                          className="text-[9px] font-black text-zinc-700 hover:text-red-500/70 uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                           <Flag size={10} /> Data Feedback
                        </button>
                    </div>
                 </div>
               )}

               {/* RAFFLES TAB */}
               {activeTab === 'raffles' && (
                 <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-violet-900/10 rounded-2xl p-5 mb-6">
                       <h3 className="text-violet-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Ticket size={16} /> Draw Intelligence
                       </h3>
                       <p className="text-xs text-zinc-500 font-medium">Verified active entry points for global retail networks.</p>
                    </div>

                    {!sneaker.raffles || sneaker.raffles.length === 0 ? (
                       <div className="text-center py-16">
                          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                            <Ticket size={24} className="text-zinc-700" />
                          </div>
                          <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">No Active Draws</p>
                          <p className="text-zinc-600 text-[10px] font-bold uppercase mt-1">Standby for retail confirmation</p>
                       </div>
                    ) : (
                       sneaker.raffles.map(raffle => {
                          const closing = new Date(raffle.closesAt);
                          const isOpen = raffle.status === 'open';
                          return (
                             <div key={raffle.id} className="bg-zinc-900 rounded-2xl p-5 flex items-center justify-between group hover:bg-zinc-800/80 transition-colors shadow-sm">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 font-black text-xs shadow-inner">
                                      {raffle.store.substring(0, 2).toUpperCase()}
                                   </div>
                                   <div>
                                      <h4 className="text-white font-black text-sm uppercase italic">{raffle.store}</h4>
                                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mt-1">
                                         <span className="text-zinc-500">{raffle.type}</span>
                                         <span className="text-zinc-700">•</span>
                                         <span className={isOpen ? 'text-emerald-400' : 'text-red-500'}>
                                            {isOpen ? `Ends ${closing.toLocaleDateString()}` : 'Expired'}
                                         </span>
                                      </div>
                                   </div>
                                </div>
                                <a 
                                  href={raffle.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                                     isOpen ? 'bg-white text-black hover:scale-105 shadow-lg' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                                  }`}
                                >
                                   {isOpen ? 'ENTER' : 'CLOSED'}
                                </a>
                             </div>
                          );
                       })
                    )}
                 </div>
               )}

               {/* MARKET TAB */}
               {activeTab === 'market' && (
                 <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
                    {/* Size Selector */}
                    <div>
                       <div className="flex justify-between items-center mb-4 px-1">
                          <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Select Specs (US)</h3>
                          {selectedSize && (
                             <button onClick={() => setSelectedSize(null)} className="text-[9px] font-black text-violet-500 uppercase tracking-widest hover:text-white">Reset</button>
                          )}
                       </div>
                       <div className="grid grid-cols-5 gap-2">
                          {SIZES.map(size => (
                             <button
                               key={size}
                               onClick={() => setSelectedSize(size)}
                               className={`py-2.5 rounded-xl text-xs font-black transition-all ${
                                  selectedSize === size 
                                     ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30' 
                                     : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
                               }`}
                             >
                                {size}
                             </button>
                          ))}
                       </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                       <h3 className="text-[10px] font-black text-zinc-600 mb-4 px-1 uppercase tracking-widest flex justify-between">
                          <span>Live Liquidity Nodes</span>
                          {selectedSize && (
                             <span className="text-emerald-500 flex items-center gap-1 tracking-tight">
                                {isScanning ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                                {isScanning ? 'Polling...' : 'Real-time'}
                             </span>
                          )}
                       </h3>
                       
                       <div className="space-y-3">
                          {retailers.map((market) => {
                            const stock = stockData[market.name];
                            const query = selectedSize ? `${sneaker.name} size ${selectedSize}` : sneaker.name;
                            const finalUrl = `${market.baseUrl}${encodeURIComponent(query)}${market.affiliateParam}`;

                            return (
                              <a 
                                key={market.name}
                                href={finalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full bg-zinc-900 hover:bg-zinc-800 text-white p-5 rounded-2xl flex items-center justify-between transition-all group shadow-sm ${!selectedSize ? 'opacity-60' : ''}`}
                              >
                                 <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] shadow-inner ${market.bg || 'bg-zinc-800'} ${market.color || 'text-zinc-500'}`}>
                                      {market.abbr}
                                    </div>
                                    <div className="text-left">
                                       <span className="block font-black text-sm uppercase italic tracking-tight">{market.name}</span>
                                       {selectedSize && !isScanning && stock ? (
                                          stock.available ? (
                                             <span className="block text-emerald-400 font-mono text-xs font-black tracking-tight">${stock.price}</span>
                                          ) : (
                                             <span className="block text-red-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Stock Depleted</span>
                                          )
                                       ) : (
                                          <span className="block text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-0.5">Poll Marketplace</span>
                                       )}
                                    </div>
                                 </div>
                                 <ExternalLink size={16} className="text-zinc-700 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </a>
                            );
                          })}
                       </div>
                    </div>
                 </div>
               )}

               {/* STYLE TAB - NEW AI INTEGRATED */}
               {activeTab === 'style' && (
                 <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-zinc-900 rounded-2xl p-2 shadow-inner">
                       <div className="grid grid-cols-2 gap-2">
                          <img src={`https://picsum.photos/seed/${sneaker.id}feet1/400/500`} className="w-full h-52 object-cover rounded-xl" alt="On feet 1" />
                          <img src={`https://picsum.photos/seed/${sneaker.id}feet2/400/500`} className="w-full h-52 object-cover rounded-xl" alt="On feet 2" />
                       </div>
                    </div>
                    
                    <div className="px-1">
                       <h3 className="text-[10px] font-black text-zinc-600 mb-4 uppercase tracking-widest flex items-center gap-2">
                          Directives
                          {loadingStyle && <Loader2 size={12} className="animate-spin text-violet-500" />}
                       </h3>
                       
                       <div className="space-y-4">
                          {/* Fit Advice */}
                          <div className="bg-zinc-900 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                             <div className="bg-zinc-800 p-2.5 rounded-xl mt-0.5 text-zinc-400 shadow-inner"><Shirt size={18} /></div>
                             <div>
                                <p className="text-[10px] font-black text-zinc-600 mb-1.5 uppercase tracking-widest">Silhouette Pairing</p>
                                <p className="text-sm text-zinc-100 font-bold italic leading-relaxed">
                                   {styleAdvice ? styleAdvice.fit : (loadingStyle ? "Syncing style nodes..." : "Select tab to load")}
                                </p>
                             </div>
                          </div>

                          {/* Color Advice */}
                          <div className="bg-zinc-900 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
                             <div className="bg-zinc-800 p-2.5 rounded-xl mt-0.5 text-zinc-400 shadow-inner"><div className="w-4.5 h-4.5 bg-gradient-to-tr from-zinc-500 to-white rounded-full"></div></div>
                             <div>
                                <p className="text-[10px] font-black text-zinc-600 mb-1.5 uppercase tracking-widest">Tonal Directive</p>
                                <p className="text-sm text-zinc-100 font-bold italic leading-relaxed">
                                   {styleAdvice ? styleAdvice.color : (loadingStyle ? "Calculating palettes..." : "Select tab to load")}
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-5 bg-zinc-950 border-t border-zinc-900 flex gap-3 pb-safe z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
             <button className="p-3.5 bg-zinc-900 rounded-2xl text-zinc-500 hover:text-white transition-all active:scale-90 border border-transparent hover:border-zinc-700">
                <Share2 size={22} />
             </button>
             
             <button 
                onClick={() => setShowPortfolioModal(true)}
                className="flex-1 bg-zinc-900 text-emerald-500 font-black text-[11px] uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98]"
             >
                <PlusCircle size={18} /> Own Pair
             </button>

             <button 
                onClick={() => onToggleWishlist(sneaker.id)}
                className={`flex-1 font-black text-[11px] uppercase tracking-widest py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
                   isWishlisted 
                   ? 'bg-zinc-800 text-violet-500 shadow-inner' 
                   : 'bg-violet-600 text-white hover:bg-violet-500'
                }`}
             >
                {isWishlisted ? <><ShieldCheck size={18} /> Watching</> : <><Bell size={18} /> Notify</>}
             </button>
          </div>
        </div>
      </div>

      {showPortfolioModal && onAddToPortfolio && (
        <AddToPortfolioModal 
          sneaker={sneaker} 
          onClose={() => setShowPortfolioModal(false)}
          onAdd={onAddToPortfolio}
        />
      )}
    </>
  );
};

// Sub-components for cleaner code
const StatBox: React.FC<{ label: string; value: string; color: string; icon?: React.ReactNode }> = ({ label, value, color, icon }) => (
   <div className="bg-zinc-900 p-4 rounded-2xl shadow-sm">
      <span className="text-[9px] font-black text-zinc-600 block mb-1 uppercase tracking-widest">{label}</span>
      <div className={`flex items-center gap-1.5 font-mono font-black ${color}`}>
         {icon}
         <span className="text-sm">{value}</span>
      </div>
   </div>
);

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void; icon: React.ReactNode; count?: number }> = ({ label, active, onClick, icon, count }) => (
   <button 
      onClick={onClick}
      className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all whitespace-nowrap px-1 ${
         active ? 'border-violet-600 text-white bg-violet-600/5' : 'border-transparent text-zinc-600 hover:text-zinc-400'
      }`}
   >
      {React.cloneElement(icon as React.ReactElement<any>, { size: 14, strokeWidth: active ? 3 : 2 })}
      {label}
      {count !== undefined && count > 0 && (
         <span className="bg-violet-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-lg">{count}</span>
      )}
   </button>
);

export default SneakerDetail;