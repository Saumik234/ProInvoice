import React, { useState } from 'react';
import { X, Sparkles, Loader2, Gem } from 'lucide-react';

interface SmartImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (text: string) => Promise<void>;
}

export const SmartImportModal: React.FC<SmartImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await onImport(text);
      setText(''); // Clear on success
      onClose();
    } catch (error) {
      console.error("Import failed", error);
      // Error handling could be improved here with a toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100 border border-emerald-100">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center">
          <h3 className="text-white text-xl font-bold flex items-center gap-2">
            <Gem className="w-6 h-6 text-emerald-200" />
            AI Smart Fill
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8">
          <div className="mb-6 flex gap-3 items-start">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
               <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>Paste anything!</strong> Chat logs, email snippets, or rough notes. 
              Our AI will intelligently extract the client, line items, prices, and dates for you.
            </p>
          </div>
          
          <textarea 
            className="w-full h-48 p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 outline-none resize-none text-sm text-slate-700 placeholder:text-slate-300 shadow-inner bg-slate-50"
            placeholder="e.g. 'Bill Bill Gates for 5 hours of consulting at $200/hr and a $50 software license fee. Address is 1 Microsoft Way. Due next week.'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-500 hover:bg-slate-200 rounded-xl text-sm font-bold transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            onClick={handleImport}
            disabled={loading || !text.trim()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Magic Fill"}
          </button>
        </div>
      </div>
    </div>
  );
};