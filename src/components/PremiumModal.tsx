import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Lock, ExternalLink, ArrowRight } from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onUpgrade }) => {
  const [step, setStep] = useState<'benefits' | 'payment'>('benefits');
  
  // REPLACE THIS LINK WITH YOUR ACTUAL STRIPE PAYMENT LINK
  // Go to Stripe Dashboard -> Product Catalog -> Create Product -> Create Payment Link
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/PLACEHOLDER'; 

  const handlePayment = () => {
    // 1. Open Stripe in a new tab
    window.open(STRIPE_PAYMENT_LINK, '_blank');
    
    // 2. In a real production app with a backend, you would wait for a webhook.
    // For this "Serverless" MVP, we will close the modal and tell the user 
    // to check their email or that the upgrade will apply on redirect.
    // (The App.tsx handles the ?payment=success logic if you set that up in Stripe redirect)
    onClose();
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
          <div className="p-8 relative">
             <div className="text-center mb-8">
               <div className="inline-block bg-zinc-900 p-4 rounded-full mb-4 border border-zinc-800">
                  <Lock size={32} className="text-emerald-500" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Secure Checkout</h3>
               <p className="text-sm text-zinc-400">
                 You will be redirected to Stripe to complete your purchase securely.
               </p>
             </div>

             <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mb-8">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-sm text-zinc-400">Subscription</span>
                   <span className="text-sm font-bold text-white">SneakPeak PRO</span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-800 pt-2 mt-2">
                   <span className="text-sm text-zinc-400">Total</span>
                   <span className="text-lg font-black text-white">$9.99<span className="text-xs font-normal text-zinc-500">/mo</span></span>
                </div>
             </div>

             <button 
               onClick={handlePayment}
               className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-xl text-base flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 transition-all"
             >
               Proceed to Stripe <ArrowRight size={18} />
             </button>
             
             <div className="mt-6 text-center">
               <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                 <ShieldCheck size={10} /> Payments processed securely by Stripe
               </p>
               <button 
                 onClick={() => setStep('benefits')}
                 className="text-xs text-zinc-500 font-bold hover:text-white mt-4"
               >
                 Cancel
               </button>
             </div>
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