import React, { useState } from 'react';
import { UserProfile, Sneaker } from '../types';
import { Settings, Edit2, X, BookOpen, ListChecks, LogOut } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  wishlist: string[];
  allSneakers: Sneaker[];
  onSwitchUser: (isAdmin: boolean) => void;
  onGoToAdmin: () => void;
  onLogout: () => void;
  onOpenPremium: () => void;
  onOpenSettings?: () => void;
  onBackToApp?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, wishlist, allSneakers, onSwitchUser, onGoToAdmin, onLogout, onOpenPremium, onOpenSettings, onBackToApp }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [newName, setNewName] = useState(user.username);
  
  const portfolioItems = user.owned || [];
  const totalCount = portfolioItems.length;
  const costBasis = portfolioItems.reduce((acc, item) => acc + item.purchasePrice, 0);
  
  const currentValue = portfolioItems.reduce((acc, item) => {
    const sneaker = allSneakers.find(s => s.id === item.sneakerId);
    return acc + (sneaker?.resalePrice || sneaker?.price || 0);
  }, 0);

  const profit = currentValue - costBasis;
  const profitPercent = costBasis > 0 ? ((profit / costBasis) * 100).toFixed(1) : '0';

  return (
    <div className="h-full overflow-y-auto pb-32 bg-zinc-950 font-sans">
      <div className="p-6">
        {/* IDENTITY SECTION */}
        <div className="flex justify-between items-center mb-8">
           <div className="relative group">
             <img src={user.avatar} alt={user.username} className={`w-24 h-24 rounded-3xl border-4 shadow-2xl object-cover ${user.isPremium ? 'border-violet-500' : 'border-zinc-800'}`} />
             <button onClick={() => setShowEditProfile(true)} className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={24} className="text-white" /></button>
           </div>
           <div className="flex flex-col gap-2">
              <button onClick={onOpenSettings} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-colors border border-zinc-800">
                <Settings size={24} />
              </button>
              {user.isAdmin && (
                <button onClick={onGoToAdmin} className="p-3 bg-zinc-900 rounded-2xl text-violet-500 border border-zinc-800 text-xs font-black uppercase">Admin Panel</button>
              )}
           </div>
        </div>
        
        <div className="mb-8">
           <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none mb-2">
             {user.username}
           </h1>
           <div className="flex gap-2">
             <span className="bg-violet-600/10 text-violet-500 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-violet-500/20">Collector Tier {user.level}</span>
             {user.isPremium && <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-amber-500/20">PRO Member</span>}
           </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 text-center shadow-lg">
            <span className="text-zinc-500 text-[10px] mb-2 block uppercase font-black tracking-widest">Pairs</span>
            <p className="text-2xl font-black text-white">{totalCount}</p>
          </div>
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 text-center shadow-lg">
            <span className="text-zinc-500 text-[10px] mb-2 block uppercase font-black tracking-widest">Value</span>
            <p className="text-2xl font-black text-white">${currentValue.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 text-center shadow-lg">
            <span className="text-zinc-500 text-[10px] mb-2 block uppercase font-black tracking-widest">ROI</span>
            <p className={`text-2xl font-black ${profit >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
              {profit >= 0 ? '+' : ''}{profitPercent}%
            </p>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="mb-10 space-y-4">
          <h3 className="text-white text-sm font-black uppercase tracking-widest px-1">Collector Dashboard</h3>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-violet-500/10 p-2 rounded-xl text-violet-500"><BookOpen size={18} /></div>
              <p className="text-sm text-zinc-300 font-bold uppercase">Features</p>
            </div>
            <ul className="space-y-3">
              {[
                'Live Price Monitoring',
                'AI Legitimacy Checks',
                'ROI Comparison Tool',
                'Portfolio Growth Performance'
              ].map((f, i) => (
                <li key={i} className="text-xs text-zinc-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-3">
           <button onClick={() => onSwitchUser(!user.isAdmin)} className="w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
             Switch View: {user.isAdmin ? 'USER MODE' : 'ADMIN MODE'}
           </button>
           <button onClick={onLogout} className="w-full py-4 border border-red-900/30 text-red-500/50 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2">
             <LogOut size={16} /> Logout
           </button>
        </div>
      </div>

      {showEditProfile && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-5 backdrop-blur-sm">
            <div className="bg-zinc-900 w-full max-w-sm rounded-3xl border border-zinc-800 p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                    <h3 className="text-white font-black text-sm uppercase tracking-widest">Edit Identity</h3>
                    <button onClick={() => setShowEditProfile(false)}><X size={24} className="text-zinc-500" /></button>
                </div>
                <div className="space-y-6">
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-violet-500 text-sm font-bold shadow-inner" placeholder="Username" />
                    <button onClick={() => setShowEditProfile(false)} className="w-full bg-violet-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-violet-600/30 transition-all uppercase text-xs tracking-widest">Save Changes</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Profile;