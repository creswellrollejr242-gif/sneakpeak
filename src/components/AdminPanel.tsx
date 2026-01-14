import React, { useState, useRef } from 'react';
import { Sneaker, Retailer } from '../types';
import { Trash2, Plus, ArrowLeft, Upload, Edit2, Save, RefreshCw, ShoppingBag, List, Package } from 'lucide-react';
import { compressImage } from '../utils/imageUtils';

interface AdminPanelProps {
  sneakers: Sneaker[];
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

  const handleSneakerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sneakerForm.name || !sneakerForm.brand || !sneakerForm.image) return;

    if (editingId) {
      onEditSneaker(editingId, sneakerForm);
      setEditingId(null);
    } else {
      const newS: Sneaker = {
        id: Date.now().toString(),
        name: sneakerForm.name!,
        brand: sneakerForm.brand!,
        price: Number(sneakerForm.price),
        image: sneakerForm.image!,
        dropDate: new Date(sneakerForm.dropDate!).toISOString(),
        hypeScore: Number(sneakerForm.hypeScore),
        description: sneakerForm.description || '',
        isRaffle: !!sneakerForm.isRaffle
      };
      onAddSneaker(newS);
    }
    setSneakerForm({ name: '', brand: '', price: 0, hypeScore: 50, isRaffle: false, image: '', description: '', dropDate: new Date().toISOString().split('T')[0] });
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
    <div className="h-full flex bg-zinc-950 font-sans text-white">
      {/* Sidebar - Clean List */}
      <div className="w-16 sm:w-64 flex-none border-r border-zinc-800 flex flex-col bg-zinc-900">
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
           <span className="text-[10px] font-black text-zinc-500 hidden sm:block uppercase tracking-widest">Inventory List</span>
           <button onClick={onExit} className="p-1 hover:bg-zinc-800 rounded text-violet-500"><ArrowLeft size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
           <div className="p-2 sm:p-4 space-y-1">
              {sneakers.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => { setEditingId(s.id); setSneakerForm(s); }}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${editingId === s.id ? 'bg-violet-600 text-white shadow-lg' : 'hover:bg-zinc-800 text-zinc-500'}`}
                >
                   <Package size={16} />
                   <span className="text-xs truncate hidden sm:block font-bold">{s.name}</span>
                </div>
              ))}
              <button 
                onClick={() => { setEditingId(null); setSneakerForm({ name: '', brand: '', price: 0, image: '', dropDate: new Date().toISOString().split('T')[0] }); }} 
                className="w-full flex items-center gap-3 p-2 rounded-xl text-emerald-500 hover:bg-emerald-500/10 mt-4 border border-dashed border-emerald-500/30"
              >
                 <Plus size={16} />
                 <span className="text-xs font-black uppercase hidden sm:block">New Product</span>
              </button>
           </div>
        </div>
      </div>

      {/* Main Editor - Clean Form */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <div className="h-12 bg-zinc-900 flex items-center px-6 gap-3 border-b border-zinc-800">
           <Edit2 size={16} className="text-violet-500" />
           <span className="text-xs font-black uppercase tracking-tight">{editingId ? `Editing: ${sneakers.find(s=>s.id===editingId)?.name}` : 'Create New Product Record'}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-12">
           <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSneakerSubmit} className="space-y-8">
                <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
                   <p className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">Product Photography</p>
                   <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-zinc-800 rounded-3xl h-80 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 transition-all group overflow-hidden relative">
                     {sneakerForm.image ? (
                       <img src={sneakerForm.image} className="w-full h-full object-cover" alt="preview" />
                     ) : (
                       <div className="text-center text-zinc-600 group-hover:text-zinc-400">
                         <Upload size={64} className="mx-auto mb-4 opacity-20" />
                         <span className="text-sm font-black uppercase">Choose Product Image</span>
                       </div>
                     )}
                   </div>
                   <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Product Name</label>
                      <input type="text" value={sneakerForm.name} onChange={e => setSneakerForm({...sneakerForm, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-violet-500 text-sm font-bold shadow-sm" placeholder="e.g. Air Jordan 1 Low" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Brand</label>
                      <input type="text" value={sneakerForm.brand} onChange={e => setSneakerForm({...sneakerForm, brand: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-violet-500 text-sm font-bold shadow-sm" placeholder="e.g. Nike" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Retail Price ($)</label>
                      <input type="number" value={sneakerForm.price} onChange={e => setSneakerForm({...sneakerForm, price: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-violet-500 text-sm font-bold shadow-sm" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Release Date</label>
                      <input type="date" value={sneakerForm.dropDate} onChange={e => setSneakerForm({...sneakerForm, dropDate: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-violet-500 text-sm font-bold shadow-sm" />
                   </div>
                </div>

                <div className="pt-10 flex gap-4">
                   <button type="submit" disabled={isProcessing} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-black py-5 rounded-2xl transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-violet-600/20">
                     {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />} 
                     {editingId ? 'Save Product' : 'Publish Product'}
                   </button>
                   {editingId && (
                     <button type="button" onClick={() => onDeleteSneaker(editingId)} className="p-5 bg-red-900/20 text-red-500 rounded-2xl border border-red-900/30 hover:bg-red-900/40 transition-all">
                       <Trash2 size={24} />
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