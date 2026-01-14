import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, XCircle, Loader2, Save } from 'lucide-react';
import { checkLegitimacy } from '../services/geminiService';
import { LegitCheckResult } from '../types';

interface LegitCheckProps {
  onSaveScan?: (result: LegitCheckResult) => void;
}

const LegitCheck: React.FC<LegitCheckProps> = ({ onSaveScan }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    // Strip prefix for API
    const base64Data = image.split(',')[1];
    const data = await checkLegitimacy(base64Data);
    setResult(data);
    setAnalyzing(false);
  };

  const handleSave = () => {
    if (result && image && onSaveScan) {
      const scanResult: LegitCheckResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        imageUrl: image,
        verdict: result.verdict,
        confidence: result.confidence,
        reasoning: result.reasoning
      };
      onSaveScan(scanResult);
      setSaved(true);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-24">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-black italic text-white mb-2 tracking-tighter">VISION <span className="text-violet-500">AUTHENTICATOR</span></h2>
        <p className="text-zinc-400 text-sm mb-6">
          Upload a clear macro photo (stitching, tag, or material profile) for deep-node AI authentication.
        </p>

        {!image ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-700 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-zinc-800/50 transition-all"
          >
            <Camera size={48} className="text-zinc-500 mb-4" />
            <span className="text-zinc-300 font-medium">Initialize Scan Sequence</span>
            <span className="text-zinc-600 text-xs mt-2">Executive Access Required</span>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden h-64 border border-zinc-700">
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                 <Loader2 className="animate-spin text-violet-400 mb-2" size={32} />
                 <span className="text-violet-400 font-mono animate-pulse">ANALYZING SPECIMEN...</span>
              </div>
            )}
            {!analyzing && !result && (
               <button 
                 onClick={() => { setImage(null); setResult(null); }}
                 className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white"
               >
                 <XCircle size={20} />
               </button>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />

        {image && !result && !analyzing && (
          <button 
            onClick={handleAnalyze}
            className="w-full mt-4 bg-violet-600 hover:bg-violet-500 text-white font-black py-3 rounded-lg text-lg uppercase tracking-wide transition-colors shadow-lg shadow-violet-600/20"
          >
            Execute Legit Check
          </button>
        )}
      </div>

      {result && (
        <div className={`rounded-xl p-6 border-l-4 ${
          result.verdict === 'PASS' ? 'bg-emerald-900/20 border-emerald-500' : 
          result.verdict === 'FAIL' ? 'bg-red-900/20 border-red-500' : 'bg-amber-900/20 border-amber-500'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            {result.verdict === 'PASS' ? <CheckCircle size={32} className="text-emerald-500" /> :
             result.verdict === 'FAIL' ? <XCircle size={32} className="text-red-500" /> :
             <AlertTriangle size={32} className="text-amber-500" />}
            <div>
              <h3 className="text-xl font-bold text-white">VERDICT: {result.verdict}</h3>
              <p className="text-sm text-zinc-400">Intelligence Confidence: <span className="text-white font-mono">{result.confidence}%</span></p>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-4 mb-4">
             <h4 className="text-xs font-bold text-zinc-500 uppercase mb-1">Technical Intelligence</h4>
             <p className="text-zinc-200 text-sm leading-relaxed">{result.reasoning}</p>
          </div>

          {result.details && result.details.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-zinc-300 space-y-1">
              {result.details.map((detail: string, i: number) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
          
          <div className="flex gap-2 mt-6">
            <button 
              onClick={() => { setImage(null); setResult(null); setSaved(false); }}
              className="flex-1 bg-zinc-800 text-white py-2 rounded-lg font-medium text-sm hover:bg-zinc-700"
            >
              Analyze New Specimen
            </button>
            {!saved && (
              <button 
                onClick={handleSave}
                className="flex-1 bg-zinc-800 text-emerald-400 border border-emerald-500/20 py-2 rounded-lg font-bold text-sm hover:bg-zinc-700 flex items-center justify-center gap-2"
              >
                <Save size={16} /> Log Result
              </button>
            )}
            {saved && (
              <button disabled className="flex-1 bg-emerald-500/10 text-emerald-500 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-default">
                <CheckCircle size={16} /> Specimen Logged
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LegitCheck;