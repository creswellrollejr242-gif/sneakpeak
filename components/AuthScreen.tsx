
import React, { useState } from 'react';
import { ArrowRight, Sparkles, User, Lock, Mail, Shield, ArrowLeft, CheckCircle } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (username: string, isAdmin?: boolean, isSignup?: boolean) => void;
  onGuest: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onGuest }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  // identifier stores email for signup/forgot, or email/username for signin
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Separate username field for signup
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'forgot') {
      // Simulate Password Reset API call
      setTimeout(() => {
        setIsLoading(false);
        setResetSent(true);
      }, 1500);
      return;
    }

    // Simulate Login/Signup API delay
    setTimeout(() => {
      // Hardcoded Admin Check for demonstration
      if (identifier === 'crollejr2' && password === 'Sh@v@z2015') {
        onLogin('SneakPeak_Admin', true, false);
      } else {
        // Regular login
        let finalUsername = 'User';
        
        if (mode === 'signup') {
            finalUsername = username;
        } else {
            // Signin mode: identifier is either username or email
            // If it contains @, assume email and extract name, otherwise use as username
            finalUsername = identifier.includes('@') ? identifier.split('@')[0] : identifier;
        }
        
        // Pass 'mode === signup' as true/false
        onLogin(finalUsername || 'User', false, mode === 'signup');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleModeSwitch = (newMode: 'signin' | 'signup' | 'forgot') => {
    setMode(newMode);
    setIdentifier('');
    setPassword('');
    setUsername('');
    setResetSent(false);
  };

  // RENDER FORGOT PASSWORD VIEW
  if (mode === 'forgot') {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-sm relative z-10 animate-[fadeIn_0.3s_ease-out]">
           <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
              <button 
                onClick={() => handleModeSwitch('signin')}
                className="mb-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>

              <div className="text-center mb-6">
                 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 mb-4 border border-zinc-700">
                    <Lock size={20} className="text-violet-500" />
                 </div>
                 <h2 className="text-2xl font-black italic text-white tracking-tight">RECOVER <span className="text-violet-500">ACCOUNT</span></h2>
                 <p className="text-zinc-500 text-sm mt-2">Enter your email to receive a password reset link.</p>
              </div>

              {resetSent ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center animate-[scaleIn_0.3s_ease-out]">
                   <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                   <h3 className="text-white font-bold mb-2">Check your Email</h3>
                   <p className="text-zinc-400 text-sm mb-6">We've sent a recovery link to <span className="text-white font-bold">{identifier}</span></p>
                   <button 
                     onClick={() => handleModeSwitch('signin')}
                     className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                   >
                     Return to Sign In
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <Mail size={18} className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-violet-500 transition-colors"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-violet-600/20"
                  >
                    {isLoading ? <span className="animate-pulse">Sending...</span> : 'Send Reset Link'}
                  </button>
                </form>
              )}
           </div>
        </div>
      </div>
    );
  }

  // RENDER LOGIN/SIGNUP VIEW
  return (
    <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-2xl bg-zinc-900 border border-zinc-800 mb-4 shadow-xl shadow-violet-500/10">
             <img src="https://cdn-icons-png.flaticon.com/512/2589/2589903.png" className="w-12 h-12 invert" alt="Logo" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">
            SNEAK<span className="text-violet-500">PEAK</span>
          </h1>
          <p className="text-zinc-500 text-sm font-medium">The Bloomberg Terminal for Hypebeasts</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex bg-zinc-950/50 rounded-lg p-1 mb-6 border border-zinc-800/50">
            <button 
              onClick={() => handleModeSwitch('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === 'signin' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              SIGN IN
            </button>
            <button 
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === 'signup' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              SIGN UP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative group">
                <User size={18} className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-violet-500 transition-colors"
                  required
                />
              </div>
            )}
            
            <div className="relative group">
              {mode === 'signup' ? (
                <Mail size={18} className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
              ) : (
                <User size={18} className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
              )}
              
              <input 
                type={mode === 'signup' ? "email" : "text"} 
                placeholder={mode === 'signup' ? "Email Address" : "Email or Username"} 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-3 top-3.5 text-zinc-500 group-focus-within:text-violet-500 transition-colors" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            {mode === 'signin' && (
               <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => handleModeSwitch('forgot')}
                    className="text-[10px] font-bold text-violet-500 hover:text-violet-400"
                  >
                    Forgot Password?
                  </button>
               </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-violet-600/20"
            >
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  {mode === 'signin' ? 'Secure Login' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
             <div className="h-[1px] bg-zinc-800 flex-1"></div>
             <span className="px-3 text-[10px] font-bold text-zinc-600 uppercase">Or continue as</span>
             <div className="h-[1px] bg-zinc-800 flex-1"></div>
          </div>

          <button 
            onClick={onGuest}
            className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded-xl text-sm transition-colors border border-zinc-700"
          >
            Guest User
          </button>
        </div>

        <div className="mt-8 text-center">
           <p className="text-[10px] text-zinc-600">
             By continuing, you agree to our Terms of Service and Privacy Policy.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
