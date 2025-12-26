import React, { useState, useEffect } from 'react';
import { InvoiceData, DEFAULT_INVOICE } from './types';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoicePreview } from './components/InvoicePreview';
import { SmartImportModal } from './components/SmartImportModal';
import { ShareModal } from './components/ShareModal';
import { Footer } from './components/Footer';
import { AboutPage, TermsPage, PrivacyPage, DisclaimerPage } from './components/StaticPages';
import { ContactPage } from './components/ContactPage';
import { parseInvoiceFromText } from './services/geminiService';
import { Printer, Sparkles, RefreshCw, Save, Share2, Pencil, Eye, Layers, Gem, ChevronLeft } from 'lucide-react';

const STORAGE_KEY = 'swift_invoice_data';
type PageView = 'home' | 'about' | 'contact' | 'terms' | 'privacy' | 'disclaimer';

const App: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // Initialize on mount (check URL param OR local storage)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('share');

    if (shareData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(shareData))));
        setInvoiceData(decoded);
        setIsSharedView(true);
      } catch (e) {
        console.error("Failed to decode share data", e);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
  }, []);

  // SEO Title Updater
  useEffect(() => {
    const titles = {
      home: 'ProInvoice AI - Free Professional Invoice Generator',
      about: 'About Us - ProInvoice AI',
      contact: 'Contact Us - ProInvoice AI',
      terms: 'Terms of Service - ProInvoice AI',
      privacy: 'Privacy Policy - ProInvoice AI',
      disclaimer: 'Disclaimer - ProInvoice AI'
    };
    document.title = titles[currentPage];
    
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, [currentPage]);

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setInvoiceData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
        setInvoiceData(DEFAULT_INVOICE);
      }
    }
  };

  // Persist to localStorage ONLY if we are NOT in shared view
  useEffect(() => {
    if (!isSharedView) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceData));
    }
  }, [invoiceData, isSharedView]);

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the invoice? This will clear your current changes.")) {
      setInvoiceData(DEFAULT_INVOICE);
      if (isSharedView) {
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsSharedView(false);
      }
    }
  };

  const handleClone = () => {
    setIsSharedView(false);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleAIImport = async (text: string) => {
    setIsProcessing(true);
    try {
      const parsedData = await parseInvoiceFromText(text, invoiceData);
      setInvoiceData(prev => ({
        ...prev,
        ...parsedData,
        items: parsedData.items || prev.items
      }));
    } catch (e) {
      alert("Failed to parse text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageView);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'terms': return <TermsPage />;
      case 'privacy': return <PrivacyPage />;
      case 'disclaimer': return <DisclaimerPage />;
      default:
        // Home Page (Invoice Generator)
        return (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Panel: Editor - Hidden in Shared View */}
            {!isSharedView && (
              <div className="w-full lg:w-5/12 xl:w-1/3 no-print flex flex-col gap-6 order-2 lg:order-1">
                 <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 text-emerald-900 text-sm flex items-start gap-3 shadow-sm">
                   <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" />
                   <p>
                     <strong>Pro Tip:</strong> Paste chat logs or emails into 
                     <button onClick={() => setIsModalOpen(true)} className="mx-1 font-bold underline decoration-emerald-300 hover:text-emerald-700">AI Smart Fill</button> 
                     to instantly draft your invoice.
                   </p>
                 </div>
                 <InvoiceEditor data={invoiceData} onChange={setInvoiceData} />
              </div>
            )}
  
            {/* Right Panel: Preview - Centered in Shared View */}
            <div className={`w-full ${isSharedView ? 'lg:max-w-4xl mx-auto' : 'lg:w-7/12 xl:w-2/3'} order-1 ${isSharedView ? '' : 'lg:order-2'}`}>
              <div className={isSharedView ? "" : "sticky top-24"}>
                <div className={`rounded-xl overflow-hidden shadow-2xl border border-slate-200/60 ring-4 ring-slate-200/50 bg-slate-500/5 backdrop-blur-sm p-1 sm:p-2 lg:p-4 print:p-0 print:shadow-none print:ring-0 print:bg-transparent ${isSharedView ? 'bg-white ring-0 border-0 shadow-xl' : ''}`}>
                  <InvoicePreview data={invoiceData} />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-30 no-print shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button onClick={() => setCurrentPage('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-xl text-slate-800 tracking-tight leading-none block">Pro<span className="text-emerald-600">Invoice</span></h1>
              <span className="text-[10px] text-emerald-600 font-medium tracking-wider uppercase">AI Powered</span>
            </div>
            {isSharedView && (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full ml-2 flex items-center gap-1">
                <Eye className="w-3 h-3" /> View Only
              </span>
            )}
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Navigation Actions (Only show on Home) */}
            {currentPage === 'home' && (
              <>
                {!isSharedView && (
                  <>
                    <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-600/70 mr-2 bg-emerald-50 px-2 py-1 rounded-md">
                      <Save className="w-3.5 h-3.5" />
                      <span>Auto-saved</span>
                    </div>

                    <button 
                      onClick={handleReset}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors hidden sm:block"
                      title="Reset Invoice"
                      aria-label="Reset Invoice"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                    
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-200 shadow-sm hover:shadow"
                      aria-label="Open AI Smart Fill"
                    >
                      <Gem className="w-4 h-4" />
                      <span className="hidden sm:inline">AI Smart Fill</span>
                      <span className="inline sm:hidden">AI</span>
                    </button>

                    <button 
                      onClick={() => setIsShareModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 shadow-sm hover:shadow"
                      aria-label="Share Invoice"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </>
                )}

                {isSharedView && (
                  <button 
                    onClick={handleClone}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
                    aria-label="Edit a copy of this invoice"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit a Copy</span>
                  </button>
                )}

                <button 
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
                  aria-label="Print or Download PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print / PDF</span>
                  <span className="inline sm:hidden">Print</span>
                </button>
              </>
            )}
            
            {/* Back Button for non-home pages */}
            {currentPage !== 'home' && (
              <button 
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Editor
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {isSharedView && currentPage === 'home' && (
           <div className="mb-6 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center justify-between no-print">
             <div className="flex items-center gap-4">
               <div className="bg-white/20 p-3 rounded-xl">
                 <Share2 className="w-6 h-6" />
               </div>
               <div>
                 <p className="font-bold text-base">You are viewing a shared invoice</p>
                 <p className="text-sm text-emerald-100 opacity-90">Create your own account-free invoice in seconds.</p>
               </div>
             </div>
             <button 
               onClick={handleClone} 
               className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm"
             >
               Create My Own
             </button>
           </div>
        )}

        {renderContent()}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Modals */}
      <SmartImportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onImport={handleAIImport} 
      />

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        data={invoiceData}
      />

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="animate-spin text-emerald-600 mb-4">
            <RefreshCw className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Analyzing Text...</h3>
          <p className="text-slate-500">Our AI is extracting invoice details for you.</p>
        </div>
      )}

    </div>
  );
};

export default App;