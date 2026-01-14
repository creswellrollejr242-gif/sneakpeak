import React, { useState, useEffect, useRef } from 'react';
import { X, Bell, Shield, FileText, Trash2, Mail, ChevronRight, LogOut, Info, Server, Zap, Database, Download, Upload, AlertCircle } from 'lucide-react';
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
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'connected' | 'missing'>('checking');
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if API Key is present in the environment
    const hasKey = (window as any).process?.env?.API_KEY;
    setApiKeyStatus(hasKey ? 'connected' : 'missing');
  }, []);

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This will delete your portfolio, badges, and all saved data permanently. This cannot be undone.")) {
      // Clear all local storage
      localStorage.clear();
      onLogout();
      alert("Account deleted and local data cleared.");
    }
  };

  const handleExportData = () => {
    const data = {
        user: localStorage.getItem('sneakpeak_user'),
        sneakers: localStorage.getItem('sneakpeak_sneakers'),
        version: localStorage.getItem('sneakpeak_version'),
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sneakpeak_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target?.result as string);
            if (data.user) localStorage.setItem('sneakpeak_user', data.user);
            if (data.sneakers) localStorage.setItem('sneakpeak_sneakers', data.sneakers);
            if (data.version) localStorage.setItem('sneakpeak_version', data.version);
            
            alert("Data imported successfully! The app will now reload.");
            window.location.reload();
        } catch (error) {
            alert("Invalid backup file.");
        }
    };
    reader.readAsText(file);
  };

  const renderDoc = (type: 'privacy' | 'terms') => (
    <div className="absolute inset-0 bg-zinc-950 z-20 flex flex-col animate-[slideLeft_0.2s_ease-out]">
      <div className="p-4 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/50 backdrop-blur-md sticky top-0">
        <button onClick={() => setActiveDoc(null)} className="p-1 hover:bg-zinc-800 rounded-full">
           <ChevronRight size={24} className="rotate-180 text-zinc-400" />
        </button>
        <h3 className="font-bold text-white">{type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h3>
      </div>
      
      <div className="p-6 overflow-y-auto text-sm text-zinc-400 leading-relaxed pb-20">
        {type === 'privacy' ? (
          <>
            <p className="mb-4 text-xs italic opacity-70">Last Updated: October 26, 2025</p>
            
            <h4 className="text-white font-bold mb-2">1. Introduction</h4>
            <p className="mb-4">
              SneakPeak ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
            </p>

            <h4 className="text-white font-bold mb-2">2. Information We Collect</h4>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Local Data:</strong> Your portfolio, wishlist, and preferences are stored locally on your device via LocalStorage. We do not maintain a central database of your personal inventory.</li>
              <li><strong>Uploaded Images:</strong> When you use "KickFlip Vision" (Legit Check/Identification), your images are transmitted to Google Gemini API for analysis. These images are processed transiently and are not permanently stored by our servers.</li>
              <li><strong>Usage Data:</strong> We may collect anonymous analytics to improve app performance.</li>
            </ul>

            <h4 className="text-white font-bold mb-2">3. How We Use Your Data</h4>
            <p className="mb-4">
              We use your data to provide core features, including:
              <br/>• Analyzing sneaker authenticity via AI.
              <br/>• Generating personalized style advice.
              <br/>• Tracking the value of your sneaker portfolio.
            </p>

            <h4 className="text-white font-bold mb-2">4. Third-Party Services</h4>
            <p className="mb-4">
              We utilize third-party services for specific functionalities:
              <br/>• <strong>Google Gemini API:</strong> For image recognition and AI chat.
              <br/>• <strong>Stripe (Demo):</strong> For payment processing simulation.
              <br/>• <strong>Vercel:</strong> For hosting the application infrastructure.
            </p>

            <h4 className="text-white font-bold mb-2">5. Data Security</h4>
            <p className="mb-4">
              We implement industry-standard security measures. However, no method of transmission over the internet is 100% secure. You are responsible for maintaining the confidentiality of your device and login credentials.
            </p>

            <h4 className="text-white font-bold mb-2">6. User Rights</h4>
            <p className="mb-4">
              You may delete all your data at any time by using the "Delete Account" button in Settings. This effectively wipes all locally stored data associated with SneakPeak from your device.
            </p>
          </>
        ) : (
          <>
            <p className="mb-4 text-xs italic opacity-70">Last Updated: October 26, 2025</p>

            <h4 className="text-white font-bold mb-2">1. Acceptance of Terms</h4>
            <p className="mb-4">
              By accessing or using SneakPeak, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use immediately.
            </p>

            <h4 className="text-white font-bold mb-2">2. Disclaimer of Warranties ("As Is")</h4>
            <p className="mb-4">
              The service is provided on an "AS IS" and "AS AVAILABLE" basis. SneakPeak makes no warranties regarding the accuracy of market data, release dates, or stock availability.
            </p>

            <h4 className="text-white font-bold mb-2">3. AI Legit Check Disclaimer</h4>
            <p className="mb-4 text-amber-400/90 border-l-2 border-amber-500 pl-3">
              <strong>Crucial:</strong> The "KickFlip Vision" and AI Legit Check features are for informational purposes only. The results are generated by artificial intelligence and <strong>do not constitute a professional authentication</strong>. SneakPeak is not liable for any financial loss resulting from the purchase or sale of counterfeit goods based on our AI analysis. Always seek professional, in-hand authentication for high-value items.
            </p>

            <h4 className="text-white font-bold mb-2">4. Financial Disclaimer</h4>
            <p className="mb-4">
              SneakPeak provides market data and historical price trends. This is <strong>not financial advice</strong>. The sneaker market is volatile; invest at your own risk. We are not responsible for any trading losses.
            </p>

            <h4 className="text-white font-bold mb-2">5. User Conduct</h4>
            <p className="mb-4">
              You agree not to misuse the app, including but not limited to: uploading illegal or offensive imagery, attempting to reverse engineer the code, or spamming the community features.
            </p>

            <h4 className="text-white font-bold mb-2">6. Affiliate Disclosure</h4>
            <p className="mb-4">
              SneakPeak may contain links to third-party retailers (e.g., StockX, GOAT, Nike). We may earn a commission if you make a purchase through these links. This comes at no extra cost to you.
            </p>

            <h4 className="text-white font-bold mb-2">7. Termination</h4>
            <p className="mb-4">
              We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </>
        )}
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
           {/* System Status */}
           <section>
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 px-2">System Status</h4>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4 space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Server size={16} className="text-zinc-400" />
                       <span className="text-sm font-medium text-white">App Version</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{APP_VERSION}</span>
                 </div>
                 
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Zap size={16} className={apiKeyStatus === 'connected' ? "text-emerald-500" : "text-amber-500"} />
                       <span className="text-sm font-medium text-white">AI Engine</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${apiKeyStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                       {apiKeyStatus === 'connected' ? 'LIVE (Gemini 2.5)' : 'DEMO MODE'}
                    </span>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Database size={16} className="text-blue-500" />
                       <span className="text-sm font-medium text-white">Database</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                       LOCAL STORAGE
                    </span>
                 </div>
              </div>
           </section>

           {/* Data Management - NEW */}
           <section>
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 px-2">Data Management</h4>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-4">
                 <div className="flex items-start gap-3 mb-4">
                    <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-zinc-400">Since SneakPeak runs locally on your device, use these tools to backup your portfolio or transfer it to a new phone.</p>
                 </div>
                 <div className="flex gap-2">
                    <button 
                      onClick={handleExportData}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                    >
                       <Download size={14} /> Export Backup
                    </button>
                    <button 
                      onClick={() => importInputRef.current?.click()}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                    >
                       <Upload size={14} /> Import Backup
                    </button>
                    <input 
                      type="file" 
                      ref={importInputRef} 
                      onChange={handleImportData} 
                      className="hidden" 
                      accept=".json"
                    />
                 </div>
              </div>
           </section>

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