import React, { useState, useEffect } from 'react';
import { Home, Calendar, Flame, Users, ScanLine, MessageCircle, ArrowRightLeft, Sparkles, Settings } from 'lucide-react';
import { MOCK_SNEAKERS, MOCK_POSTS, NEWS_TICKER, BADGES, MOCK_CONVERSATIONS, MOCK_STORIES, DEFAULT_RETAILERS } from './constants';
import { View, UserProfile, Sneaker, Post, ToastMessage, Conversation, Retailer } from './types';
import { supabase } from './supabaseClient';

// Components
import DropCard from './components/DropCard';
import LegitCheck from './components/LegitCheck';
import AIChat from './components/AIChat';
import SwipeMatch from './components/SwipeMatch';
import Community from './components/Community';
import Profile from './components/Profile';
import Toast from './components/Toast';
import AuthScreen from './components/AuthScreen';
import SneakerDetail from './components/SneakerDetail';
import VersusMode from './components/VersusMode';
import Messenger from './components/Messenger';
import Stories from './components/Stories';
import SettingsModal from './components/SettingsModal';
import AdminPanel from './components/AdminPanel';

const INITIAL_USER: UserProfile = {
  username: 'Collector_One',
  level: 1,
  xp: 0,
  owned: [],
  wishlist: [],
  savedScans: [],
  avatar: 'https://picsum.photos/seed/guest/200/200',
  isAdmin: false,
  isPremium: false,
  badges: [BADGES[0]]
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('sneakpeak_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch (e) { return INITIAL_USER; }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('sneakpeak_auth') === 'true');
  const [sneakers, setSneakers] = useState<Sneaker[]>(MOCK_SNEAKERS);
  const [currentView, setCurrentView] = useState<View>('home');
  const [posts] = useState<Post[]>(MOCK_POSTS);
  const [conversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [toasts] = useState<ToastMessage[]>([]);
  const [selectedSneaker, setSelectedSneaker] = useState<Sneaker | null>(null);
  const [showVersus, setShowVersus] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [retailers] = useState<Retailer[]>(DEFAULT_RETAILERS);

  useEffect(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(() => {
        (splash as any).style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
      }, 800);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sneakpeak_user', JSON.stringify(user));
    localStorage.setItem('sneakpeak_auth', isAuthenticated.toString());
  }, [user, isAuthenticated]);

  const handleLogin = (username: string, isAdmin = false) => {
    setUser({ ...INITIAL_USER, username, isAdmin });
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sneakpeak_auth');
    setCurrentView('home');
  };

  const toggleWishlist = (id: string) => {
    setUser(prev => {
      const exists = prev.wishlist.includes(id);
      return { ...prev, wishlist: exists ? prev.wishlist.filter(wId => wId !== id) : [...prev.wishlist, id] };
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="h-full overflow-y-auto pb-40 bg-zinc-950 font-sans no-scrollbar">
            {/* News Ticker */}
            <div className="bg-violet-600/10 border-b border-violet-500/20 py-2 overflow-hidden flex items-center mb-10">
               <div className="whitespace-nowrap animate-[marquee_25s_linear_infinite] px-4 text-[11px] text-violet-400 font-bold uppercase">
                  {NEWS_TICKER.map((item, i) => <span key={i} className="mr-10">{item} • </span>)}
               </div>
            </div>

            {/* Stories Section (RESTORED TO TOP) */}
            <div className="mb-10">
              <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 px-6">Market Stories</h4>
              <Stories stories={MOCK_STORIES} />
            </div>

            <div className="px-5">
              {/* PRIMARY FOCUS: Hot Drops & Upcoming */}
              <div className="space-y-8 mb-16">
                 <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Hot Drops</h3>
                    <button onClick={() => setCurrentView('drops')} className="text-xs font-bold text-violet-500 hover:text-white transition-colors">Calendar</button>
                 </div>
                 <div className="space-y-6">
                    {sneakers.slice(0, 10).map(s => (
                      <DropCard key={s.id} sneaker={s} isWishlisted={user.wishlist.includes(s.id)} onToggleWishlist={toggleWishlist} onClick={() => setSelectedSneaker(s)} />
                    ))}
                 </div>
              </div>

              {/* SECONDARY: Utility Actions */}
              <div className="mb-16">
                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4 px-1">Utility & Tools</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setCurrentView('chat')} className="bg-zinc-900 p-6 rounded-3xl flex flex-col gap-3 hover:bg-zinc-800 transition-all group shadow-xl">
                      <div className="bg-violet-500/10 p-3 rounded-2xl text-violet-500 w-fit group-hover:bg-violet-500 group-hover:text-white transition-colors shadow-inner"><Sparkles size={24} /></div>
                      <span className="text-sm font-black text-white uppercase italic tracking-tight">Sneaker Concierge</span>
                  </button>
                  <button onClick={() => setShowVersus(true)} className="bg-zinc-900 p-6 rounded-3xl flex flex-col gap-3 hover:bg-zinc-800 transition-all group shadow-xl">
                      <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 w-fit group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-inner"><ArrowRightLeft size={24} /></div>
                      <span className="text-sm font-black text-white uppercase italic tracking-tight">Versus Mode</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'drops': return <div className="h-full overflow-y-auto pb-40 px-5 pt-10 bg-zinc-950 font-sans"><h2 className="text-3xl font-black italic text-white mb-10 border-b border-zinc-800 pb-6 text-center uppercase tracking-tighter">Release Calendar</h2><div className="space-y-6">{sneakers.map(s => <DropCard key={s.id} sneaker={s} isWishlisted={user.wishlist.includes(s.id)} onToggleWishlist={toggleWishlist} onClick={() => setSelectedSneaker(s)} />)}</div></div>;
      case 'community': return <Community posts={posts} user={user} onLike={() => {}} onAddComment={() => {}} onAddPost={() => {}} />;
      case 'legit': return <LegitCheck onSaveScan={() => {}} />;
      case 'chat': return <AIChat />;
      case 'swipe': return <SwipeMatch onLike={(s) => toggleWishlist(s.id)} sneakers={sneakers} />;
      case 'profile': return <Profile user={user} wishlist={user.wishlist} allSneakers={sneakers} onSwitchUser={(admin) => setUser(u => ({...u, isAdmin: admin}))} onGoToAdmin={() => setCurrentView('admin')} onLogout={handleLogout} onOpenPremium={() => {}} onOpenSettings={() => setShowSettings(true)} onBackToApp={() => setCurrentView('home')} />;
      case 'messages': return <Messenger conversations={conversations} allSneakers={sneakers} userPortfolio={user.owned} onSendMessage={() => {}} onSendTrade={() => {}} onBack={() => setCurrentView('home')} />;
      case 'admin': return <AdminPanel sneakers={sneakers} onAddSneaker={(s) => setSneakers([s, ...sneakers])} onEditSneaker={(id, updates) => setSneakers(sneakers.map(s => s.id === id ? { ...s, ...updates } : s))} onDeleteSneaker={(id) => setSneakers(sneakers.filter(s => s.id !== id))} onExit={() => setCurrentView('profile')} retailers={retailers} onAddRetailer={() => {}} onDeleteRetailer={() => {}} />;
      default: return <div>View Not Found</div>;
    }
  };

  if (!isAuthenticated) return <AuthScreen onLogin={handleLogin} onGuest={() => handleLogin('Guest')} />;

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 flex flex-col font-sans text-white overflow-hidden selection:bg-violet-500/30">
      <Toast toasts={toasts} removeToast={() => {}} />
      {showVersus && <VersusMode sneakers={sneakers} onClose={() => setShowVersus(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onLogout={handleLogout} username={user.username} />}
      
      <header className="flex-none h-20 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between px-6 z-50">
         <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setCurrentView('profile')}>
            <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-violet-500/50 object-cover shadow-2xl" alt="user" />
            <div className="flex flex-col">
               <span className="text-xl font-black italic tracking-tighter text-white leading-none uppercase">Profile</span>
               <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Level {user.level} Collector</span>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('messages')} className="text-zinc-500 hover:text-white transition-all"><MessageCircle size={28} /></button>
         </div>
      </header>

      <main className="flex-1 overflow-hidden relative">{renderView()}</main>

      <footer className="flex-none h-28 bg-zinc-900 border-t border-zinc-800 px-6 pb-10 pt-4 z-50">
         <nav className="flex items-center justify-between max-w-md mx-auto h-full">
              <NavBtn icon={<Flame />} label="Match" active={currentView === 'swipe'} onClick={() => setCurrentView('swipe')} />
              <NavBtn icon={<Calendar />} label="Drops" active={currentView === 'drops'} onClick={() => setCurrentView('drops')} />
              
              <div className="relative -top-12">
                 <button onClick={() => setCurrentView('home')} className={`w-20 h-20 rounded-3xl flex items-center justify-center border-4 border-zinc-950 transition-all duration-300 ${currentView === 'home' ? 'bg-violet-600 shadow-[0_0_40px_rgba(124,58,237,0.5)] scale-110' : 'bg-zinc-800'}`}><Home size={36} className={currentView === 'home' ? 'text-white' : 'text-zinc-400'} /></button>
                 <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-widest ${currentView === 'home' ? 'text-violet-400' : 'text-zinc-500'}`}>HOME</span>
              </div>

              <NavBtn icon={<Users />} label="Club" active={currentView === 'community'} onClick={() => setCurrentView('community')} />
              <NavBtn icon={<ScanLine />} label="Verify" active={currentView === 'legit'} onClick={() => setCurrentView('legit')} />
         </nav>
      </footer>

      {selectedSneaker && (
        <SneakerDetail 
          sneaker={selectedSneaker} 
          onClose={() => setSelectedSneaker(null)} 
          onToggleWishlist={toggleWishlist} 
          isWishlisted={user.wishlist.includes(selectedSneaker.id)} 
          isPremium={user.isPremium}
          onOpenPremium={() => {}}
          retailers={retailers} 
        />
      )}
    </div>
  );
};

const NavBtn: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 transition-all active:scale-90 ${active ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
    {React.cloneElement(icon as React.ReactElement<any>, { size: 28, strokeWidth: active ? 3 : 2 })}
    <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default App;