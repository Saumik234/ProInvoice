import React, { useEffect } from 'react';
import { Shield, Info, FileText, AlertCircle } from 'lucide-react';

interface PageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const PageLayout: React.FC<PageProps> = ({ title, lastUpdated, children, icon }) => (
  <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn">
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-6">
        {icon}
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-slate-500 text-sm">Last Updated: {lastUpdated}</p>
    </div>
    <div className="prose prose-slate prose-emerald max-w-none bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      {children}
    </div>
  </div>
);

export const AboutPage = () => (
  <PageLayout title="About Us" lastUpdated="October 2023" icon={<Info className="w-8 h-8" />}>
    <p className="lead text-lg text-slate-600 mb-6">
      ProInvoice AI is dedicated to simplifying the financial lives of freelancers, contractors, and small business owners worldwide through intelligent automation.
    </p>
    <h3>Our Mission</h3>
    <p>
      We believe that getting paid shouldn't be a hassle. Our mission is to provide a lightning-fast, professional, and intelligent invoicing tool that removes the friction from billing. By leveraging advanced AI, we turn rough notes into polished invoices in seconds.
    </p>
    <h3>Why Choose Us?</h3>
    <ul>
      <li><strong>Privacy First:</strong> We operate on a local-first architecture. Your client data stays in your browser.</li>
      <li><strong>Speed:</strong> Generate invoices 10x faster with our Smart Fill technology.</li>
      <li><strong>Professionalism:</strong> beautiful, industry-standard templates that make you look good.</li>
    </ul>
  </PageLayout>
);

export const TermsPage = () => (
  <PageLayout title="Terms of Service" lastUpdated="October 2023" icon={<FileText className="w-8 h-8" />}>
    <h3>1. Acceptance of Terms</h3>
    <p>By accessing and using ProInvoice AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
    
    <h3>2. Use of Service</h3>
    <p>ProInvoice AI provides an online invoice generation tool. You agree to use this service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>
    
    <h3>3. Data Handling</h3>
    <p>Our service operates primarily client-side. User input data is stored in your browser's local storage. We do not claim ownership of the data you enter into the invoice generator.</p>
    
    <h3>4. Disclaimer of Warranties</h3>
    <p>The service is provided "as is". ProInvoice AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.</p>
  </PageLayout>
);

export const PrivacyPage = () => (
  <PageLayout title="Privacy Policy" lastUpdated="October 2023" icon={<Shield className="w-8 h-8" />}>
    <h3>1. Information Collection</h3>
    <p>
      We prioritize your privacy. ProInvoice AI is designed as a client-side application. 
      The invoice data you enter (client names, amounts, items) is stored locally on your device via LocalStorage. 
    </p>
    
    <h3>2. AI Processing</h3>
    <p>
      When you use the "Smart Fill" AI feature, the text you explicitly submit is sent to our AI provider (Google Gemini) solely for the purpose of processing and extraction. This data is not used to train models and is not retained by us after processing.
    </p>
    
    <h3>3. Cookies & Local Storage</h3>
    <p>
      We use Local Storage to save your progress so you don't lose your work if you close the browser. We do not use tracking cookies for advertising purposes.
    </p>
    
    <h3>4. Third-Party Links</h3>
    <p>Our website may contain links to other websites. We are not responsible for the privacy practices of such other sites.</p>
  </PageLayout>
);

export const DisclaimerPage = () => (
  <PageLayout title="Disclaimer" lastUpdated="October 2023" icon={<AlertCircle className="w-8 h-8" />}>
    <h3>Not Financial Advice</h3>
    <p>
      The information provided by ProInvoice AI is for general informational and utility purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
    </p>
    <h3>Professional Assistance</h3>
    <p>
      ProInvoice AI is a tool to assist in the creation of documents. It does not constitute legal, accounting, or tax advice. You should consult with a professional accountant or lawyer to ensure your invoices meet specific legal requirements in your jurisdiction.
    </p>
    <h3>Limitation of Liability</h3>
    <p>
      Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
    </p>
  </PageLayout>
);