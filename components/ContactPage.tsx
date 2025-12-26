import React, { useState } from 'react';
import { Send, Mail, MessageSquare, User } from 'lucide-react';

export const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 animate-fadeIn">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
          <p className="text-slate-600 mb-6">
            Thank you for reaching out. We'll get back to you as soon as possible.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-emerald-600 font-bold hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100/50">
        {/* Header */}
        <div className="bg-white p-8 pb-0 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Contact Us</h1>
          <p className="text-slate-500">Have questions, feedback, or need support? We'd love to hear from you.</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={e => setFormState({...formState, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={e => setFormState({...formState, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1" htmlFor="message">
                Message
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={e => setFormState({...formState, message: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-slate-800 placeholder:text-slate-400 resize-none"
                  placeholder="How can we help you?"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>

          </form>
        </div>
      </div>
      
      <div className="text-center mt-8 text-sm text-slate-400">
        <p>You can also email us directly at <a href="mailto:support@proinvoice.ai" className="text-emerald-600 hover:underline">support@proinvoice.ai</a></p>
      </div>
    </div>
  );
};