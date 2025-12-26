
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export type InvoiceTemplate = 'modern' | 'classic' | 'minimal';

export type FeeType = 'fixed' | 'percent';

export interface Fee {
  id: string;
  description: string;
  amount: number;
  type: FeeType;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  senderName: string;
  senderAddress: string;
  senderEmail: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  items: LineItem[];
  taxRate: number;
  fees: Fee[]; // Additional surcharges or fees
  notes: string;
  currency: string;
  
  // Branding & Design
  logo?: string; // Base64 data URL
  brandColor: string;
  template: InvoiceTemplate;
}

export interface SavedClient {
  name: string;
  email: string;
  address: string;
}

export interface SavedItem {
  description: string;
  price: number;
}

export const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: "INV-001",
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +7 days
  paymentTerms: "Net 7",
  senderName: "",
  senderAddress: "",
  senderEmail: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  items: [
    { id: '1', description: "Consulting Services", quantity: 1, price: 100 },
  ],
  taxRate: 0,
  fees: [],
  notes: "Thank you for your business!",
  currency: "USD",
  
  // Default Branding
  brandColor: "#059669", // emerald-600
  template: "modern"
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'United States Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
  { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
];