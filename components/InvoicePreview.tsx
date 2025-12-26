
import React from 'react';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: data.currency || 'USD',
      }).format(amount);
    } catch (e) {
      return `${amount}`;
    }
  };

  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = subtotal * ((data.taxRate || 0) / 100);
  
  // Calculate Fees
  const feesAmount = (data.fees || []).reduce((sum, fee) => {
    if (fee.type === 'percent') {
      return sum + (subtotal * (fee.amount / 100));
    }
    return sum + fee.amount;
  }, 0);

  const total = subtotal + taxAmount + feesAmount;

  // Helper to render fee rows
  const renderFees = () => (
    <>
      {(data.fees || []).map(fee => (
        <div key={fee.id} className="flex justify-between text-sm text-slate-600">
           <span>
             {fee.description || 'Fee'} {fee.type === 'percent' ? `(${fee.amount}%)` : ''}
           </span>
           <span className="font-medium">
             {formatCurrency(fee.type === 'percent' ? subtotal * (fee.amount/100) : fee.amount)}
           </span>
        </div>
      ))}
    </>
  );

  const renderClassicFees = () => (
    <>
       {(data.fees || []).map(fee => (
         <tr key={fee.id}>
            <td className="py-2 px-4 text-right text-sm font-bold text-slate-600">
              {fee.description || 'Fee'} {fee.type === 'percent' ? `(${fee.amount}%)` : ''}:
            </td>
            <td className="py-2 px-4 text-right text-sm text-slate-800">
               {formatCurrency(fee.type === 'percent' ? subtotal * (fee.amount/100) : fee.amount)}
            </td>
         </tr>
       ))}
    </>
  );

  // Container wraps the preview to ensure correct print dimensions
  const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white shadow-lg w-full max-w-[21cm] min-h-[29.7cm] mx-auto p-[1.5cm] md:p-[2cm] relative text-slate-800 print:shadow-none print:w-full print:max-w-none print:mx-0 print:p-[1.5cm] ${className}`}>
      {children}
      {/* Watermark */}
      <div className="absolute bottom-8 left-0 w-full text-center print:hidden">
         <div className="text-[10px] text-slate-300 uppercase tracking-widest">Generated with SwiftInvoice</div>
      </div>
    </div>
  );

  // ---------------- TEMPLATE: MODERN ----------------
  if (data.template === 'modern') {
    return (
      <Container>
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
              {data.logo && (
                <img src={data.logo} alt="Logo" className="h-16 w-auto object-contain max-w-[200px]" />
              )}
              {!data.logo && (
                 <h1 className="text-4xl font-bold tracking-tight" style={{ color: data.brandColor }}>INVOICE</h1>
              )}
            </div>
            <p className="text-slate-500 font-medium">#{data.invoiceNumber}</p>
          </div>
          <div className="text-right">
            {data.senderName ? (
              <h2 className="text-lg font-bold text-slate-900">{data.senderName}</h2>
            ) : (
              <div className="text-slate-300 italic">[Your Business Name]</div>
            )}
            <div className="text-sm text-slate-600 mt-2 whitespace-pre-line">
              {data.senderAddress || "[Your Address]"}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              {data.senderEmail}
            </div>
          </div>
        </div>

        {/* Client & Dates */}
        <div className="flex flex-wrap justify-between gap-8 mb-12 border-t border-slate-100 pt-8">
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
            {data.clientName ? (
               <div className="font-semibold text-slate-900">{data.clientName}</div>
            ) : (
               <div className="text-slate-300 italic">[Client Name]</div>
            )}
           
            <div className="text-sm text-slate-600 mt-1 whitespace-pre-line">
              {data.clientAddress || "[Client Address]"}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              {data.clientEmail}
            </div>
          </div>

          <div className="flex gap-12 text-right">
            <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date Issue</h3>
               <div className="text-sm font-medium text-slate-900">{data.date}</div>
            </div>
             <div>
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</h3>
               <div className="text-sm font-medium text-slate-900">{data.dueDate}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: data.brandColor }}>
                <th className="text-left py-3 text-xs font-bold uppercase tracking-wider text-slate-900">Description</th>
                <th className="text-right py-3 text-xs font-bold uppercase tracking-wider text-slate-900 w-24">Qty</th>
                <th className="text-right py-3 text-xs font-bold uppercase tracking-wider text-slate-900 w-32">Price</th>
                <th className="text-right py-3 text-xs font-bold uppercase tracking-wider text-slate-900 w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-4 pr-4 text-slate-700">
                    <div className="font-medium">{item.description || "Item description"}</div>
                  </td>
                  <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                  <td className="py-4 text-right text-slate-600">{formatCurrency(item.price)}</td>
                  <td className="py-4 text-right font-medium text-slate-900">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 italic bg-slate-50 mt-2 rounded">
                    No items added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {data.taxRate > 0 && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Tax ({data.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
              </div>
            )}
            
            {/* Additional Fees */}
            {renderFees()}

            <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t-2" style={{ borderColor: data.brandColor }}>
              <span>Total</span>
              <span style={{ color: data.brandColor }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        {(data.notes || data.paymentTerms) && (
          <div className="border-t border-slate-100 pt-6 bg-slate-50 p-4 rounded-lg">
             {data.paymentTerms && (
              <div className="mb-4">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Terms</h4>
                 <p className="text-sm text-slate-600">{data.paymentTerms}</p>
              </div>
            )}
            {data.notes && (
              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</h4>
                 <p className="text-sm text-slate-600 whitespace-pre-line">{data.notes}</p>
              </div>
            )}
          </div>
        )}
      </Container>
    );
  }

  // ---------------- TEMPLATE: CLASSIC ----------------
  if (data.template === 'classic') {
    return (
      <Container className="font-serif">
        {/* Header Center */}
        <div className="text-center mb-12">
          {data.logo && (
             <img src={data.logo} alt="Logo" className="h-20 w-auto object-contain mx-auto mb-6" />
          )}
          <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-widest mb-2" style={{ color: data.brandColor }}>Invoice</h1>
          <p className="text-slate-500 text-lg">#{data.invoiceNumber}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-slate-300">
           <div>
             <h3 className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1" style={{ color: data.brandColor }}>From:</h3>
             <div className="text-sm text-slate-700">
               <div className="font-bold">{data.senderName}</div>
               <div className="whitespace-pre-line">{data.senderAddress}</div>
               <div>{data.senderEmail}</div>
             </div>
           </div>
           <div className="text-right">
              <h3 className="font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1" style={{ color: data.brandColor }}>To:</h3>
               <div className="text-sm text-slate-700">
               <div className="font-bold">{data.clientName}</div>
               <div className="whitespace-pre-line">{data.clientAddress}</div>
               <div>{data.clientEmail}</div>
             </div>
           </div>
        </div>

        <div className="flex justify-between mb-8 px-4 py-3 bg-slate-50 border border-slate-200">
           <div>
             <span className="font-bold text-slate-600 mr-2">Date:</span>
             <span>{data.date}</span>
           </div>
           <div>
             <span className="font-bold text-slate-600 mr-2">Due Date:</span>
             <span>{data.dueDate}</span>
           </div>
        </div>

        {/* Classic Table */}
        <table className="w-full mb-8 border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 py-2 px-3 text-left text-sm font-bold text-slate-800">Item</th>
              <th className="border border-slate-300 py-2 px-3 text-right text-sm font-bold text-slate-800 w-20">Qty</th>
              <th className="border border-slate-300 py-2 px-3 text-right text-sm font-bold text-slate-800 w-32">Rate</th>
              <th className="border border-slate-300 py-2 px-3 text-right text-sm font-bold text-slate-800 w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-slate-300 py-3 px-3 text-sm text-slate-700">{item.description}</td>
                <td className="border border-slate-300 py-3 px-3 text-sm text-right text-slate-700">{item.quantity}</td>
                <td className="border border-slate-300 py-3 px-3 text-sm text-right text-slate-700">{formatCurrency(item.price)}</td>
                <td className="border border-slate-300 py-3 px-3 text-sm text-right text-slate-700">{formatCurrency(item.quantity * item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-12">
          <table className="w-1/2 border-collapse">
             <tbody>
               <tr>
                 <td className="py-2 px-4 text-right text-sm font-bold text-slate-600">Subtotal:</td>
                 <td className="py-2 px-4 text-right text-sm text-slate-800">{formatCurrency(subtotal)}</td>
               </tr>
               {data.taxRate > 0 && (
                 <tr>
                   <td className="py-2 px-4 text-right text-sm font-bold text-slate-600">Tax ({data.taxRate}%):</td>
                   <td className="py-2 px-4 text-right text-sm text-slate-800">{formatCurrency(taxAmount)}</td>
                 </tr>
               )}
               
               {/* Classic Fees */}
               {renderClassicFees()}

               <tr className="border-t-2 border-slate-800">
                 <td className="py-3 px-4 text-right text-lg font-bold text-slate-900">Total:</td>
                 <td className="py-3 px-4 text-right text-lg font-bold" style={{ color: data.brandColor }}>{formatCurrency(total)}</td>
               </tr>
             </tbody>
          </table>
        </div>

        {/* Classic Footer */}
        <div className="text-center text-sm text-slate-600 italic border-t border-slate-300 pt-8">
           <p className="mb-2 font-semibold">{data.notes}</p>
           {data.paymentTerms && <p>Terms: {data.paymentTerms}</p>}
        </div>
      </Container>
    );
  }

  // ---------------- TEMPLATE: MINIMAL ----------------
  // Default fallback to minimal if something goes wrong, but usually 'minimal'
  return (
      <Container className="font-sans">
        <div className="flex justify-between items-start mb-20">
          <div className="flex flex-col">
             {data.logo ? (
               <img src={data.logo} alt="Logo" className="h-12 w-auto object-contain mb-6 self-start" />
             ) : (
               <div className="text-2xl font-bold mb-6" style={{ color: data.brandColor }}>{data.senderName || 'INVOICE'}</div>
             )}
             <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Issued By</div>
             <div className="text-sm font-medium">{data.senderName}</div>
             <div className="text-sm text-slate-500">{data.senderAddress}</div>
          </div>
          <div className="text-right">
             <h1 className="text-6xl font-black text-slate-100 -mt-4 mb-4">INVOICE</h1>
             <div className="text-sm font-bold text-slate-900">#{data.invoiceNumber}</div>
             <div className="text-sm text-slate-500">{data.date}</div>
          </div>
        </div>

        <div className="mb-16">
           <div className="text-xs uppercase tracking-widest text-slate-400 mb-1">Billed To</div>
           <div className="text-xl font-bold text-slate-900 mb-1">{data.clientName}</div>
           <div className="text-sm text-slate-500">{data.clientAddress}</div>
        </div>

        <div className="mb-12">
           {data.items.map((item) => (
             <div key={item.id} className="flex justify-between items-baseline border-b border-slate-100 py-4 hover:bg-slate-50 transition-colors px-2">
                <div className="flex-1">
                  <div className="font-bold text-slate-900">{item.description}</div>
                  <div className="text-xs text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</div>
                </div>
                <div className="font-bold text-slate-900">
                  {formatCurrency(item.quantity * item.price)}
                </div>
             </div>
           ))}
        </div>

        <div className="flex justify-end">
           <div className="w-64">
              <div className="flex justify-between py-2 text-sm">
                 <span className="text-slate-500">Subtotal</span>
                 <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {data.taxRate > 0 && (
                <div className="flex justify-between py-2 text-sm">
                   <span className="text-slate-500">Tax</span>
                   <span className="font-medium">{formatCurrency(taxAmount)}</span>
                </div>
              )}
              {/* Minimal Fees */}
              {renderFees()}

              <div className="flex justify-between py-4 text-xl font-bold border-t border-slate-200 mt-2" style={{ color: data.brandColor }}>
                 <span>Total</span>
                 <span>{formatCurrency(total)}</span>
              </div>
           </div>
        </div>
        
        <div className="fixed bottom-0 left-0 w-full p-[2cm] pointer-events-none">
           <div className="flex justify-between text-xs text-slate-400 uppercase tracking-widest">
              <div>{data.senderEmail}</div>
              <div>Due: {data.dueDate}</div>
           </div>
        </div>
      </Container>
  );
};
