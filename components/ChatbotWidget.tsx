'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, ExternalLink } from 'lucide-react';
import { CORPORATE_INFO } from '@/lib/data';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { 
      sender: 'bot', 
      text: 'Namaste! Welcome to Sabari Krishna Consumables India Private Limited & GKS Mart (gksmart.in). How can we assist you with our pure ghee, cold-pressed oils, or grocery delivery today?' 
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const getAutomatedReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('fssai') || q.includes('licence') || q.includes('license') || q.includes('certif')) {
      return `Our Central FSSAI License is ${CORPORATE_INFO.fssai} (Sabari Krishna Consumables India Pvt Ltd), valid through ${CORPORATE_INFO.fssaiValidUntil}. All products are batch-tested and 100% food-grade compliant.`;
    }
    if (q.includes('gks') || q.includes('mart') || q.includes('grocery') || q.includes('gksmart')) {
      return `GKS Mart (gksmart.in) is our retail supermarket & delivery arm! You can visit our store in Tiruppur or place direct orders via WhatsApp at +91 98422 28484 for same-day delivery.`;
    }
    if (q.includes('ghee') || q.includes('bilona') || q.includes('cow') || q.includes('butter')) {
      return `Sabari GKS Desi Cow Ghee is made using the Vedic Bilona method: curd culturing followed by bi-directional wooden churning. Available from 100ml trial jars up to 15L commercial tins for sweet makers.`;
    }
    if (q.includes('wholesale') || q.includes('b2b') || q.includes('bulk') || q.includes('tin') || q.includes('sweet')) {
      return `For institutional bulk orders (15L tins & 200L drums) for sweet makers, restaurants, or distributors, please visit our Wholesale page or call +91 98422 28484 for factory-direct rates.`;
    }
    if (q.includes('contact') || q.includes('phone') || q.includes('address') || q.includes('office') || q.includes('tiruppur')) {
      return `Headquarters: ${CORPORATE_INFO.registeredOffice}. Phone: ${CORPORATE_INFO.phone}. Email: ${CORPORATE_INFO.email}. CIN: ${CORPORATE_INFO.cin}.`;
    }
    return `Thank you for your inquiry! Our team is available on WhatsApp at +91 98422 28484 or via email at ${CORPORATE_INFO.email}. Would you like to connect directly on WhatsApp?`;
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');

    setTimeout(() => {
      const reply = getAutomatedReply(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  const quickReplies = [
    'About GKS Mart (gksmart.in)',
    'Vedic Bilona Cow Ghee',
    'FSSAI & Lab Standards',
    'Wholesale 15L Tins',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
          aria-label="Open Assistant"
        >
          <MessageSquare size={18} />
          <span className="text-xs font-bold tracking-wide">Corporate Help Desk</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-border-subtle flex flex-col h-[500px] overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#192635] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
                SK
              </div>
              <div>
                <h4 className="font-bold text-xs font-serif leading-tight">Sabari Krishna Help Desk</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • GKS Mart & Sabari GKS
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface/40 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-on-surface border border-border-subtle rounded-bl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reply Chips */}
          <div className="p-2 bg-white border-t border-border-subtle flex gap-1.5 overflow-x-auto">
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qr)}
                className="whitespace-nowrap text-[10px] px-2.5 py-1 rounded-full bg-surface border border-border-subtle hover:border-primary text-on-surface transition-colors shrink-0"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* WhatsApp Direct Connect Bar */}
          <div className="px-3 py-1.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-900 font-medium">Need live assistance?</span>
            <a
              href="https://wa.me/919842228484?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>WhatsApp Us</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="p-3 bg-white border-t border-border-subtle flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about ghee, oils, GKS Mart, FSSAI..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-border-subtle focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
