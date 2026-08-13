'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { supabase } from '@/lib/supabase';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hello! Welcome to Sabari Krishna. How can I help you find the best ghee or oils today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setSending(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, token: session?.access_token }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.reply || data.error || 'Sorry, I could not process that.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Connection error. Please try again or email support@sabarikrishna.in' },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => sendMessage(inputValue);

  const quickReplies = [
    'Check Ghee Stock',
    'FSSAI details',
    'Track my order',
    'Shipping info',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-container text-white hover:text-on-primary-container p-4 rounded-full shadow-elevation-2 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MessageSquare size={26} />
        </button>
      )}

      {isOpen && (
        <Card
          elevation={2}
          roundedSize="2xl"
          className="w-[360px] max-h-[500px] h-[500px] flex flex-col p-0 overflow-hidden border-2 border-primary"
        >
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#91f9a2] rounded-full animate-ping" />
              <span className="font-bold text-body-lg">SK Consumables AI Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-surface space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-body-sm ${
                  m.sender === 'user'
                    ? 'ml-auto bg-primary text-white rounded-br-none'
                    : 'bg-white text-on-surface border border-border-subtle rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-warm-gray text-sm">
                <Loader2 size={14} className="animate-spin" /> Thinking...
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-white border-t border-border-subtle flex gap-2 overflow-x-auto whitespace-nowrap">
            {quickReplies.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="text-xs bg-gray-100 hover:bg-primary-container hover:text-on-primary-container px-3 py-1.5 rounded-full border border-border-subtle text-on-surface-variant transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-border-subtle flex gap-2 items-center">
            <Input
              roundedSize="full"
              placeholder="Ask anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="py-2.5"
            />
            <Button
              onClick={handleSend}
              variant="primary"
              disabled={sending}
              className="p-3 rounded-full flex items-center justify-center min-w-[42px] min-h-[42px]"
            >
              <Send size={16} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
export default ChatbotWidget;
