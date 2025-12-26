import React, { useRef, useEffect, useState } from 'react';
import { InvoiceData, LineItem, InvoiceTemplate, SavedClient, SavedItem, Fee, CURRENCIES } from '../types';
import { Plus, Trash2, Calendar, DollarSign, Hash, User, Building, Mail, FileText, Palette, Image as ImageIcon, Layout, Percent } from 'lucide-react';
import { Autocomplete } from './Autocomplete';
import { getSavedClients, getSavedItems, saveClient, saveItem } from '../services/memoryService';

interface InvoiceEditorProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [savedClients, setSavedClients] = useState<SavedClient[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Load saved data on mount
  useEffect(() => {
    setSavedClients(getSavedClients());
    setSavedItems(getSavedItems());
  }, []);

  const handleChange = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    handleChange('items', newItems);
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      quantity: 1,
      price: 0
    };
    handleChange('items', [...data.items, newItem]);
  };

  const removeLineItem = (id: string) => {
    handleChange('items', data.items.filter(item => item.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    handleChange('logo', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Memory Handlers
  const handleClientSelect = (client: SavedClient) => {
    onChange({
      ...data,
      clientName: client.name,
      clientEmail: client.email,
      clientAddress: client.address
    });
  };

  const handleClientBlur = () => {
    if (data.clientName.trim()) {
      const clientToSave: SavedClient = {
        name: data.clientName,
        email: data.clientEmail,
        address: data.clientAddress
      };
      saveClient(clientToSave);
      setSavedClients(getSavedClients()); // Refresh list
    }
  };

  const handleItemSelect = (id: string, savedItem: SavedItem) => {
    handleLineItemChange(id, 'description', savedItem.description);
    handleLineItemChange(id, 'price', savedItem.price);
  };

  const handleItemBlur = (item: LineItem) => {
    if (item.description.trim()) {
      saveItem({ description: item.description, price: item.price });
      setSavedItems(getSavedItems()); // Refresh list
    }
  };
  
  // Fee Handlers
  const addFee = () => {
    const newFee: Fee = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      amount: 0,
      type: 'fixed'
    };
    handleChange('fees', [...(data.fees || []), newFee]);
  };

  const updateFee = (id: string, field: keyof Fee, value: any) => {
    const newFees = (data.fees || []).map(fee => 
      fee.id === id ? { ...fee, [field]: value } : fee
    );
    handleChange('fees', newFees);
  };

  const removeFee = (id: string) => {
    handleChange('fees', (data.fees || []).filter(fee => fee.id !== id));
  };

  const templates: { id: InvoiceTemplate; label: string }[] = [
    { id: 'modern', label: 'Modern' },
    { id: 'classic', label: 'Classic' },
    { id: 'minimal', label: 'Minimal' },
  ];

  // Common styles for input boxes in the green theme
  const inputClass = "w-full px-3 py-2 bg-white border border-emerald-100/50 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none text-sm transition-all shadow-sm text-slate-700 placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5 ml-0.5";
  const sectionClass = "bg-emerald-50/50 p-6 rounded-2xl shadow-sm border border-emerald-100/80 transition-all hover:shadow-md hover:bg-emerald-50";
  const iconClass = "w-4 h-4 text-emerald-600";

  return (
    <div className="space-y-6 p-1">
      
      {/* Design & Branding */}
      <section className={sectionClass} aria-label="Branding and Style">
        <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-emerald-200 pb-2">
           <Palette className={iconClass} /> Branding & Style
        </h3>
        
        <div className="space-y-5">
          {/* Template Selection */}
          <div>
            <label className={labelClass}>Template Style</label>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleChange('template', t.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                    data.template === t.id
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                      : 'bg-white border-emerald-100 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                  aria-pressed={data.template === t.id}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Color Picker */}
            <div>
              <label className={labelClass}>Accent Color</label>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-emerald-200 shadow-sm">
                  <input
                    type="color"
                    value={data.brandColor}
                    onChange={(e) => handleChange('brandColor', e.target.value)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                    aria-label="Choose brand color"
                  />
                </div>
                <input
                  type="text"
                  value={data.brandColor}
                  onChange={(e) => handleChange('brandColor', e.target.value)}
                  className={inputClass}
                  aria-label="Brand color hex code"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className={labelClass}>Company Logo</label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-3 py-2.5 bg-white border border-dashed border-emerald-300 rounded-lg text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                  aria-label={data.logo ? "Change logo" : "Upload logo"}
                >
                  <ImageIcon className="w-4 h-4" />
                  {data.logo ? "Change" : "Upload"}
                </button>
                {data.logo && (
                  <button
                    onClick={removeLogo}
                    className="p-2.5 text-red-500 bg-white border border-red-100 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Logo"
                    aria-label="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invoice Metadata */}
      <section className={sectionClass} aria-label="Invoice Metadata">
        <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-emerald-200 pb-2">
           <FileText className={iconClass} /> Invoice Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Invoice Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
              <input
                type="text"
                value={data.invoiceNumber}
                onChange={e => handleChange('invoiceNumber', e.target.value)}
                className={`${inputClass} pl-9 font-semibold`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Currency</label>
             <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
              <select 
                value={data.currency}
                onChange={e => handleChange('currency', e.target.value)}
                className={`${inputClass} pl-9`}
                aria-label="Select Currency"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name} ({c.symbol})</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Date Issued</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
              <input
                type="date"
                value={data.date}
                onChange={e => handleChange('date', e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
              <input
                type="date"
                value={data.dueDate}
                onChange={e => handleChange('dueDate', e.target.value)}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* From & To */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className={sectionClass} aria-label="Sender Details">
          <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-emerald-200 pb-2">
            <User className={iconClass} /> From (Sender)
          </h3>
          <div className="space-y-3">
            <input
              placeholder="Business Name"
              value={data.senderName}
              onChange={e => handleChange('senderName', e.target.value)}
              className={`${inputClass} font-semibold`}
              aria-label="Sender Business Name"
            />
             <input
              placeholder="Email Address"
              value={data.senderEmail}
              onChange={e => handleChange('senderEmail', e.target.value)}
              className={inputClass}
              aria-label="Sender Email Address"
            />
            <textarea
              placeholder="Address (Street, City, Zip, Country)"
              value={data.senderAddress}
              onChange={e => handleChange('senderAddress', e.target.value)}
              className={`${inputClass} resize-none h-20`}
              aria-label="Sender Address"
            />
          </div>
        </section>

        <section className={sectionClass} aria-label="Client Details">
          <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-emerald-200 pb-2">
            <Building className={iconClass} /> To (Client)
          </h3>
          <div className="space-y-3">
            <div className="relative">
               <Autocomplete<SavedClient>
                  value={data.clientName}
                  onChange={val => handleChange('clientName', val)}
                  onSelect={handleClientSelect}
                  onBlur={handleClientBlur}
                  options={savedClients}
                  getLabel={client => client.name}
                  getSubLabel={client => client.email}
                  placeholder="Client Name (Auto-saves)"
                  className={`${inputClass} font-semibold`}
               />
            </div>
            <input
              placeholder="Client Email"
              value={data.clientEmail}
              onChange={e => handleChange('clientEmail', e.target.value)}
              onBlur={handleClientBlur}
              className={inputClass}
              aria-label="Client Email Address"
            />
            <textarea
              placeholder="Client Address"
              value={data.clientAddress}
              onChange={e => handleChange('clientAddress', e.target.value)}
              onBlur={handleClientBlur}
              className={`${inputClass} resize-none h-20`}
              aria-label="Client Address"
            />
          </div>
        </section>
      </div>

      {/* Items */}
      <section className={sectionClass} aria-label="Line Items">
         <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-emerald-200 pb-2">
            <Layout className={iconClass} /> Line Items
        </h3>
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center group animate-fadeIn bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex-1 w-full sm:w-auto relative">
                 <Autocomplete<SavedItem>
                    value={item.description}
                    onChange={val => handleLineItemChange(item.id, 'description', val)}
                    onSelect={savedItem => handleItemSelect(item.id, savedItem)}
                    onBlur={() => handleItemBlur(item)}
                    options={savedItems}
                    getLabel={i => i.description}
                    getSubLabel={i => `${data.currency === 'USD' ? '$' : ''}${i.price}`}
                    placeholder="Item Description"
                    className="w-full px-3 py-2 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300"
                 />
              </div>
              <div className="flex gap-2 w-full sm:w-auto items-center border-t sm:border-t-0 border-emerald-50 pt-2 sm:pt-0">
                <div className="relative w-20">
                   <span className="absolute left-2 top-2 text-[10px] text-emerald-400 font-bold">QTY</span>
                   <input
                    type="number"
                    value={item.quantity}
                    onChange={e => handleLineItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full pl-2 pr-2 pt-4 pb-1 bg-emerald-50/50 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-center font-semibold text-emerald-900"
                    aria-label="Quantity"
                  />
                </div>
                
                <div className="relative w-24">
                   <span className="absolute left-2 top-2 text-[10px] text-emerald-400 font-bold">PRICE</span>
                   <input
                    type="number"
                    value={item.price}
                    onChange={e => handleLineItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                    onBlur={() => handleItemBlur(item)}
                    className="w-full pl-2 pr-2 pt-4 pb-1 bg-emerald-50/50 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-center font-semibold text-emerald-900"
                    aria-label="Price"
                  />
                </div>

                <button 
                  onClick={() => removeLineItem(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={addLineItem}
          className="mt-5 w-full py-3 flex items-center justify-center gap-2 text-sm font-bold text-emerald-700 border border-dashed border-emerald-300 rounded-xl hover:bg-emerald-50 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Line Item
        </button>
      </section>

      {/* Fees & Surcharges */}
      <section className={sectionClass} aria-label="Fees and Surcharges">
        <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-emerald-200 pb-2">
           <Percent className={iconClass} /> Surcharges & Fees
        </h3>
        <div className="space-y-3">
           {(data.fees || []).map((fee) => (
              <div key={fee.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-3 rounded-xl border border-emerald-100">
                 <input
                  type="text"
                  placeholder="Description (e.g. Late Fee)"
                  value={fee.description}
                  onChange={e => updateFee(fee.id, 'description', e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 px-2 w-full sm:w-auto"
                  aria-label="Fee Description"
                />
                 <div className="flex gap-2 w-full sm:w-auto items-center">
                    <select 
                      value={fee.type}
                      onChange={e => updateFee(fee.id, 'type', e.target.value)}
                      className="w-24 px-2 py-1.5 bg-emerald-50 rounded-lg text-xs font-bold text-emerald-800 outline-none"
                      aria-label="Fee Type"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percent">%</option>
                    </select>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={fee.amount}
                      onChange={e => updateFee(fee.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1.5 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none text-sm text-right font-semibold"
                      aria-label="Fee Amount"
                    />
                     <button 
                        onClick={() => removeFee(fee.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove Fee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                 </div>
              </div>
           ))}
           <button 
              onClick={addFee}
              className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline px-2 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Fee
            </button>
        </div>
      </section>

      {/* Totals & Notes */}
      <section className={sectionClass} aria-label="Totals and Notes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Notes / Terms</label>
              <textarea
                placeholder="Thank you for your business..."
                value={data.notes}
                onChange={e => handleChange('notes', e.target.value)}
                className={`${inputClass} resize-none h-32`}
                aria-label="Invoice Notes"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="font-medium">Tax Rate (%)</span>
              <input
                type="number"
                value={data.taxRate}
                onChange={e => handleChange('taxRate', parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none text-right font-bold text-emerald-800"
                aria-label="Tax Rate Percentage"
              />
            </div>
             <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="font-medium">Payment Terms</span>
               <input
                type="text"
                value={data.paymentTerms}
                onChange={e => handleChange('paymentTerms', e.target.value)}
                className="w-32 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none text-right font-medium text-emerald-800"
                aria-label="Payment Terms"
              />
            </div>
            <div className="mt-2 pt-4 border-t border-dashed border-emerald-100 text-center">
              <p className="text-xs text-emerald-500 font-medium">Totals are calculated automatically</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};