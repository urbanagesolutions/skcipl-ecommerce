'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hello! Welcome to Sabari Krishna. How can I help you find the best ghee or oils today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Append user message
    const newMessages = [...messages, { sender: 'user' as const, text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thanks for asking about "${inputValue}"! I can confirm our Sabari GKS Ghee is hand-churned and FSSAI certified. I'm currently running in test mode.`
        }
      ]);
    }, 1000);
  };

  const quickReplies = [
    'Check Ghee Stock',
    'Is cow ghee available?',
    'FSSAI details',
    'Track my order'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Circle Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary-container text-white hover:text-on-primary-container p-4 rounded-full shadow-elevation-2 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-bounce"
        >
          <MessageSquare size={26} />
        </button>
      )}

      {/* Chat Window Container */}
      {isOpen && (
        <Card
          elevation={2}
          roundedSize="2xl"
          className="w-[360px] max-h-[500px] h-[500px] flex flex-col p-0 overflow-hidden border-2 border-primary"
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#91f9a2] rounded-full animate-ping" />
              <span className="font-bold text-body-lg">SK Consumables AI Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages list */}
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
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-white border-t border-border-subtle flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {quickReplies.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(q);
                }}
                className="text-xs bg-gray-100 hover:bg-primary-container hover:text-on-primary-container px-3 py-1.5 rounded-full border border-border-subtle text-on-surface-variant transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Panel */}
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
              className="p-3 rounded-full flex items-center justify-center min-w-[42px] min-h-[42px] max-w-[42px] max-h-[42px]"
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
