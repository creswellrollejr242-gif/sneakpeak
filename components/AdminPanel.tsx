import React, { useState, useRef, useEffect } from 'react';
import { Sneaker, Retailer } from '../types';
import { Trash2, Plus, ArrowLeft, Upload, Edit2, Database, Shield, LayoutGrid, Terminal, FileJson, Save, Server, Code, RefreshCw, FileText, ChevronRight, Search, FileCode } from 'lucide-react';
import { compressImage } from '../utils/imageUtils';
import { supabase } from '../supabaseClient';

interface AdminPanelProps {
  sneakers: Sneaker[];
  // Fix: updated prop types to match App.tsx usage
  onAddSneaker: (sneaker: Sneaker) => void;
  onEditSneaker: (id: string, updates: Partial<Sneaker>) => void;
  onDeleteSneaker: (id: string) => void;
  onExit: () => void;
  retailers: Retailer[];
  onAddRetailer: (retailer: Retailer) => void;
  onDeleteRetailer: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  sneakers, 
  onAddSneaker, 
  onEditSneaker,
  onDeleteSneaker, 
  onExit, 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sneakerForm, setSneakerForm] = useState<Partial<Sneaker>>({
    name: '',
    brand: '',
    price: 0,
    hypeScore: 50,
    isRaffle: false,
    image: '',
    description: '',
    dropDate: new Date().toISOString().split('T')[0]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSneakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sneakerForm.name || !sneakerForm.brand || !sneakerForm.image) return;

    setIsProcessing(true);
    try {
      if (editingId) {
        const updates = {
          name: sneakerForm.name,
          brand: sneakerForm.brand,
          price: Number(sneakerForm.price),
          hypeScore: Number(sneakerForm.hypeScore),
          image: sneakerForm.image,
          description: sneakerForm.description,
          dropDate: new Date(sneakerForm.dropDate!).toISOString(),
          isRaffle: !!sneakerForm.isRaffle
        };
        const { error } = await supabase
          .from('sneakers')
          .update(updates)
          .eq('id', editingId);
        
        if (!error) {
          // Fix: Pass arguments to onEditSneaker
          onEditSneaker(editingId, updates as Partial<Sneaker>);
          setEditingId(null);
        } else {
          alert("Database Update Error: " + error.message);
        }
      } else {
        const newSneaker = {
          id: Date.now().toString(),
          name: sneakerForm.name,
          brand: sneakerForm.brand,
          price: Number(sneakerForm.price),
          image: sneakerForm.image,
          dropDate: new Date(sneakerForm.dropDate!).toISOString(),
          hypeScore: Number(sneakerForm.hypeScore),
          description: sneakerForm.description || '',
          isRaffle: !!sneakerForm.isRaffle
        };
        const { error } = await supabase
          .from('sneakers')
          .insert([newSneaker]);
        
        if (!error) {
          // Fix: Pass arguments to onAddSneaker
          onAddSneaker(newSneaker as Sneaker);
        } else {
          alert("Database Insert Error: " + error.message);
        }
      }
      setSneakerForm({ name: '', brand: '', price: 0, hypeScore: 50, isRaffle: false, image: '', description: '', dropDate: new Date().toISOString().split('T')[0] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete record permanently?")) return;
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('sneakers').delete().eq('id', id);
      // Fix: Pass id to onDeleteSneaker
      if (!error) onDeleteSneaker(id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessing(true);
        const compressed = await compressImage(file, 800, 0.7);
        setSneakerForm(prev => ({ ...prev, image: compressed }));
      } catch (error) {
        alert("Upload failed.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="h-full flex bg-[#1e1e1e] font-mono text-[#d4d4d4] selection:bg-[#264f78]">
      {/* Sidebar Explorer */}
      <div className="w-16 sm:w-64 flex-none border-r border-[#333] flex flex-col bg-[#252526]">
        <div className="p-4 flex items-center justify-between border-b border-[#333]">
           <span className="text-[10px] font-black text-[#858585] hidden sm:block uppercase tracking-widest">EXPLORER</span>
           <button onClick={onExit} className="p-1 hover:bg-[#333] rounded text-emerald-500"><Terminal size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
           <div className="p-2 sm:p-4">
              <div className="flex items-center gap-2 text-zinc-500 mb-4 cursor-pointer hover:text-zinc-300">
                 <ChevronRight size={14} />
                 <span className="text-xs font-bold hidden sm:block">DATABASE_RECORDS</span>
              </div>
              <div className="space-y-1">
                 {sneakers.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => { setEditingId(s.id); setSneakerForm(s); }}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${editingId === s.id ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e]'}`}
                    >
                       <FileJson size={14} className="text-[#f1d011]" />
                       <span className="text-[10px] truncate hidden sm:block">{s.name.replace(/\s+/g, '_')}.json</span>
                    </div>
                 ))}
                 <div onClick={() => { setEditingId(null); setSneakerForm({ name: '', brand: '', price: 0, image: '', dropDate: new Date().toISOString().split('T')[0] }); }} className="flex items-center gap-2 p-1.5 rounded cursor-pointer text-emerald-500 hover:bg-[#2a2d2e]">
                    <Plus size={14} />
                    <span className="text-[10px] font-bold hidden sm:block">NEW_RECORD.json</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-10 bg-[#252526] flex items-center px-4 gap-2 border-b border-[#333]">
           <FileCode size={14} className="text-[#519aba]" />
           <span className="text-xs">{editingId ? `editing: ${editingId}.json` : 'new_file.json'}</span>
           <div className="ml-auto flex items-center gap-4">
              <span className="text-[10px] text-zinc-500 hidden sm:block">UTF-8</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
           <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSneakerSubmit} className="space-y-6">
                <div className="bg-[#2d2d2d] rounded-xl p-6 border border-[#444] shadow-2xl">
                   <p className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">// RAW_IMAGE_BUFFER</p>
                   <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#444] rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-[#333] overflow-hidden transition-all group">
                     {sneakerForm.image ? (
                       <img src={sneakerForm.image} className="w-full h-full object-cover" alt="preview" />
                     ) : (
                       <div className="text-center text-zinc-600 group-hover:text-zinc-400">
                         <Upload size={48} className="mx-auto mb-4 opacity-30" />
                         <span className="text-[11px] uppercase font-black">Upload_Binary_Data</span>
                       </div>
                     )}
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">"name"</label>
                      <input type="text" value={sneakerForm.name} onChange={e => setSneakerForm({...sneakerForm, name: e.target.value})} className="w-full bg-[#3c3c3c] border border-[#555] rounded p-3 text-white outline-none focus:border-emerald-500 text-sm" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">"brand"</label>
                      <input type="text" value={sneakerForm.brand} onChange={e => setSneakerForm({...sneakerForm, brand: e.target.value})} className="w-full bg-[#3c3c3c] border border-[#555] rounded p-3 text-white outline-none focus:border-emerald-500 text-sm" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">"price"</label>
                      <input type="number" value={sneakerForm.price} onChange={e => setSneakerForm({...sneakerForm, price: Number(e.target.value)})} className="w-full bg-[#3c3c3c] border border-[#555] rounded p-3 text-white outline-none focus:border-emerald-500 text-sm font-mono" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">"release_date"</label>
                      <input type="date" value={sneakerForm.dropDate} onChange={e => setSneakerForm({...sneakerForm, dropDate: e.target.value})} className="w-full bg-[#3c3c3c] border border-[#555] rounded p-3 text-white outline-none focus:border-emerald-500 text-sm" />
                   </div>
                </div>

                <div className="pt-8 flex gap-3">
                   <button type="submit" disabled={isProcessing} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black font-black py-4 rounded-xl transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                     {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />} 
                     COMMIT_CHANGES
                   </button>
                   {editingId && (
                     <button type="button" onClick={() => handleDelete(editingId)} className="p-4 bg-red-900/20 text-red-500 rounded-xl border border-red-900/30 hover:bg-red-900/40 transition-all">
                       <Trash2 size={20} />
                     </button>
                   )}
                </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
