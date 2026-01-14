
import React, { useState } from 'react';
import { X, Check, CreditCard, ShieldCheck, Zap, Lock } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUpgrade }) => {
  const [step, setStep] = useState<'benefits' | 'payment'>('benefits');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '', zip: '' });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onUpgrade();
      onClose();
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Basic formatting
    let formattedValue = value;
    if (name === 'number') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardInfo({ ...cardInfo, [name]: formattedValue });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-zinc-950 w-full max-w-md rounded-2xl border border-amber-500/30 overflow-hidden shadow-2xl shadow-amber-500/10 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10"
        >
          <X size={20} />
        </button>

        {step === 'benefits' ? (
          <div className="p-8 text-center relative overflow-hidden">
             {/* Background glow */}
             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 mb-6 border border-amber-500/50 shadow-lg shadow-amber-500/20">
               <ShieldCheck size={32} />
             </div>
             
             <h2 className="text-3xl font-black italic text-white mb-2 tracking-tighter">SNEAKPEAK <span className="text-amber-500">PRO</span></h2>
             <p className="text-zinc-400 mb-8">Unlock the ultimate reseller toolkit.</p>

             <div className="space-y-4 text-left mb-8">
               <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                  <div className="bg-amber-500/20 p-1.5 rounded-full text-amber-500"><Zap size={16} /></div>
                  <span className="text-sm font-bold text-white">Unlimited AI Legit Checks</span>
               </div>
               <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                  <div className="bg-amber-500/20 p-1.5 rounded-full text-amber-500"><TrendingUpIcon /></div>
                  <span className="text-sm font-bold text-white">6-Month Price History Analytics</span>
               </div>
               <div className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                  <div className="bg-amber-500/20 p-1.5 rounded-full text-amber-500"><Lock size={16} /></div>
                  <span className="text-sm font-bold text-white">Exclusive "Shock Drop" Alerts</span>
               </div>
             </div>

             <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
                <span className="text-xs text-zinc-500 uppercase font-bold">Total Due Today</span>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-3xl font-black text-white">$9.99</span>
                  <span className="text-sm text-zinc-500 mb-1">/ month</span>
                </div>
             </div>

             <button 
               onClick={() => setStep('payment')}
               className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-lg uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
             >
               Upgrade Now
             </button>
          </div>
        ) : (
          <div className="p-6">
             <div className="text-center mb-6">
               <h3 className="text-xl font-bold text-white">Secure Checkout</h3>
               <p className="text-xs text-zinc-500 flex items-center justify-center gap-1 mt-1">
                 <Lock size={10} /> 256-bit SSL Encrypted
               </p>
             </div>

             <form onSubmit={handlePayment} className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Card Number</label>
                  <div className="relative">
                     <CreditCard size={18} className="absolute left-3 top-3 text-zinc-500" />
                     <input 
                       type="text" 
                       name="number"
                       placeholder="0000 0000 0000 0000"
                       value={cardInfo.number}
                       onChange={handleInputChange}
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                       required
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Expiry</label>
                    <input 
                       type="text" 
                       name="expiry"
                       placeholder="MM/YY"
                       value={cardInfo.expiry}
                       onChange={handleInputChange}
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                       required
                     />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">CVC</label>
                    <input 
                       type="text" 
                       name="cvc"
                       placeholder="123"
                       value={cardInfo.cvc}
                       onChange={handleInputChange}
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                       required
                     />
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Zip Code</label>
                  <input 
                     type="text" 
                     name="zip"
                     placeholder="10001"
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-amber-500 transition-colors"
                     required
                   />
               </div>

               <button 
                 type="submit" 
                 disabled={isProcessing}
                 className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-xl text-lg uppercase tracking-wider shadow-lg shadow-amber-500/20 mt-4 transition-all flex items-center justify-center gap-2"
               >
                 {isProcessing ? (
                   <>Processing...</>
                 ) : (
                   <>Pay $9.99</>
                 )}
               </button>
               
               <button 
                 type="button"
                 onClick={() => setStep('benefits')}
                 className="w-full text-zinc-500 text-xs font-bold hover:text-white py-2"
               >
                 Go Back
               </button>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};

const TrendingUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default PremiumModal;
