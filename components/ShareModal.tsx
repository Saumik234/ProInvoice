import React, { useState } from 'react';
import { Copy, Mail, Download, Check, Link as LinkIcon, X, AlertTriangle } from 'lucide-react';
import { InvoiceData } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoiceData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Share Link
  const generateLink = () => {
    try {
      const json = JSON.stringify(data);
      // unicode safe base64 encoding
      const encoded = btoa(unescape(encodeURIComponent(json)));
      
      // Warning for very long URLs (browser limits vary, ~2000 is safe, ~30k max for Chrome)
      // If the logo is huge, this will likely fail or create an invalid link
      if (encoded.length > 12000) {
         return "Error: The invoice data is too large to create a link. Try removing the logo image.";
      }
      return `${window.location.origin}?share=${encoded}`;
    } catch (e) {
      return "Error generating link";
    }
  };

  const shareUrl = generateLink();
  const isError = shareUrl.startsWith("Error");

  const handleCopy = () => {
    if (isError) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    const subject = `Invoice ${data.invoiceNumber} from ${data.senderName}`;
    const body = `Hi ${data.clientName || 'there'},\n\nPlease find attached invoice #${data.invoiceNumber}.\n\nYou can view and print it online here:\n${shareUrl}\n\nBest regards,\n${data.senderName}`;
    window.open(`mailto:${data.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn transform transition-all">
        <div className="bg-slate-900 p-6 flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Share & Export
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          
          {/* Copy Link Section */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Online Viewing Link
            </label>
            <div className="flex gap-2">
              <input 
                readOnly
                value={isError ? "Link unavailable" : shareUrl}
                className={`flex-1 bg-slate-50 border rounded-lg px-3 py-2 text-sm text-slate-600 outline-none ${isError ? 'border-red-300 text-red-500 bg-red-50' : 'border-slate-200'}`}
              />
              <button 
                onClick={handleCopy}
                disabled={isError}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg border border-slate-200 transition-colors flex items-center justify-center min-w-[44px]"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {isError ? (
              <div className="flex items-center gap-2 mt-2 text-xs text-red-500">
                <AlertTriangle className="w-3 h-3" />
                <span>Image too large. Remove logo to share via link.</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-2">Send this link to your client for a read-only view.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleEmail}
              disabled={isError}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Email Client</span>
            </button>

            <button 
              onClick={() => {
                window.print();
              }}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all group"
            >
               <div className="bg-slate-100 p-2 rounded-full text-slate-600 group-hover:bg-slate-200 transition-colors">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Download PDF</span>
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] text-slate-400">
              PDF download is handled by your browser's print dialog. <br/>Select "Save as PDF" as the destination.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};