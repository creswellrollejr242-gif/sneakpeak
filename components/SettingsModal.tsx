
import React, { useState } from 'react';
import { X, Bell, Shield, FileText, Trash2, Mail, ChevronRight, LogOut, Info } from 'lucide-react';
import { APP_VERSION } from '../constants';

interface SettingsModalProps {
  onClose: () => void;
  onLogout: () => void;
  username: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onLogout, username }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [activeDoc, setActiveDoc] = useState<'privacy' | 'terms' | null>(null);

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This will delete your portfolio, badges, and all saved data permanently. This cannot be undone.")) {
      // Clear all local storage
      localStorage.clear();
      onLogout();
      alert("Account deleted and local data cleared.");
    }
  };

  const renderDoc = (type: 'privacy' | 'terms') => (
    <div className="absolute inset-0 bg-zinc-950 z-20 flex flex-col animate-[slideLeft_0.2s_ease-out]">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2">
        <button onClick={() => setActiveDoc(null)} className="p-1 hover:bg-zinc-800 rounded-full">
           <ChevronRight size={24} className="rotate-180 text-zinc-400" />
        </button>
        <h3 className="font-bold text-white">{type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h3>
      </div>
      <div className="p-6 overflow-y-auto text-sm text-zinc-400 leading-relaxed">
        <h4 className="text-white font-bold mb-2">1. Introduction</h4>
        <p className="mb-4">Welcome to SneakPeak. By accessing our app, you agree to be bound by these terms. We provide market data for informational purposes only.</p>
        <h4 className="text-white font-bold mb-2">2. Data Usage</h4>
        <p className="mb-4">We use AI to analyze your photos. These photos are processed securely and not shared with third parties without consent.</p>
        <h4 className="text-white font-bold mb-2">3. Affiliate Disclosure</h4>
        <p className="mb-4">SneakPeak may earn a commission when you purchase through links in our app. This helps support the development of new features.</p>
        <h4 className="text-white font-bold mb-2">4. Disclaimer</h4>
        <p className="mb-4">SneakPeak is not responsible for financial losses incurred through sneaker resale. All investments carry risk.</p>
        <div className="h-20"></div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-zinc-950 w-full max-w-sm rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]">
        
        {activeDoc && renderDoc(activeDoc)}

        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
           <h3 className="font-black italic text-white text-lg">SETTINGS</h3>
           <button onClick={onClose}><X size={20} className="text-zinc-500 hover:text-white" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           {/* Account Section */}
           <section>
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 px-2">Account</h4>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                 <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Username</span>
                    <span className="text-sm text-zinc-500">{username}</span>
                 </div>
                 <button className="w-full p-4 flex items-center justify-between hover:bg-zinc-800 transition-colors text-left">
                    <span className="text-sm font-medium text-white flex items-center gap-2"><Mail size={16} /> Contact Support</span>
                    <ChevronRight size={16} className="text-zinc-600" />
                 </button>
              </div>
           </section>

           {/* Notifications */}
           <section>
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 px-2">Notifications</h4>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                 <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-white flex items-center gap-2"><Bell size={16} /> Push Alerts</span>
                    <button 
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${pushEnabled ? 'bg-violet-600' : 'bg-zinc-700'}`}
                    >
                       <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${pushEnabled ? 'translate-x-4' : ''}`}></div>
                    </button>
                 </div>
                 <div className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-white flex items-center gap-2"><Mail size={16} /> Email Digests</span>
                    <button 
                      onClick={() => setEmailEnabled(!emailEnabled)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${emailEnabled ? 'bg-violet-600' : 'bg-zinc-700'}`}
                    >
                       <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${emailEnabled ? 'translate-x-4' : ''}`}></div>
                    </button>
                 </div>
              </div>
           </section>

           {/* Legal */}
           <section>
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 px-2">Legal & Privacy</h4>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                 <button 
                   onClick={() => setActiveDoc('privacy')}
                   className="w-full p-4 border-b border-zinc-800 flex items-center justify-between hover:bg-zinc-800 transition-colors text-left"
                 >
                    <span className="text-sm font-medium text-white flex items-center gap-2"><Shield size={16} /> Privacy Policy</span>
                    <ChevronRight size={16} className="text-zinc-600" />
                 </button>
                 <button 
                   onClick={() => setActiveDoc('terms')}
                   className="w-full p-4 flex items-center justify-between hover:bg-zinc-800 transition-colors text-left"
                 >
                    <span className="text-sm font-medium text-white flex items-center gap-2"><FileText size={16} /> Terms of Service</span>
                    <ChevronRight size={16} className="text-zinc-600" />
                 </button>
              </div>
           </section>

           {/* Danger Zone */}
           <section>
              <button 
                onClick={handleDeleteAccount}
                className="w-full p-4 rounded-xl border border-red-900/30 bg-red-900/10 text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-900/20 transition-colors"
              >
                 <Trash2 size={16} /> Delete Account
              </button>
              <div className="text-center mt-4">
                 <p className="text-[10px] text-zinc-600 font-mono">SneakPeak v{APP_VERSION}</p>
              </div>
           </section>
        </div>
        
        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
           <button 
             onClick={onLogout}
             className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
           >
             <LogOut size={18} /> Log Out
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;