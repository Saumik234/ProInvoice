import React from 'react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const linkClass = "text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer text-sm font-medium";

  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-8 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              Pro<span className="text-emerald-600">Invoice</span>
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Professional invoicing made simple. Intelligent, fast, and secure invoice generation for freelancers and small businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('home')} className={linkClass}>Invoice Generator</button></li>
              <li><button onClick={() => onNavigate('home')} className={linkClass}>Templates</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('about')} className={linkClass}>About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className={linkClass}>Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate('privacy')} className={linkClass}>Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('terms')} className={linkClass}>Terms of Service</button></li>
              <li><button onClick={() => onNavigate('disclaimer')} className={linkClass}>Disclaimer</button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © {currentYear} ProInvoice AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('privacy')} className="text-slate-400 hover:text-emerald-600 text-xs transition-colors">Privacy</button>
            <button onClick={() => onNavigate('terms')} className="text-slate-400 hover:text-emerald-600 text-xs transition-colors">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};