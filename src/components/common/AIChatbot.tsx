'use client';

import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse, ChatMessage } from '@/lib/aiClassifier';
import { sanitizeInput } from '@/lib/security';

export const AIChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: '👋 Vanakkam! I am your Avadi Connect AI assistant.\n\nHow can I help you today?\n• Book a service\n• Track your worker\n• Payment / fees\n• Emergency help',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages]);

  const sendMessage = () => {
    const text = sanitizeInput(input.trim());
    if (!text) return;

    const userMsg: ChatMessage = { role: 'user', text, timestamp: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    // Simulate response delay
    setTimeout(() => {
      const response = getChatbotResponse(text);
      const botMsg: ChatMessage = { role: 'assistant', text: response, timestamp: new Date() };
      setMessages((m) => [...m, botMsg]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j}>{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-2xl shadow-amber-500/40 flex items-center justify-center text-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Open AI Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 max-h-[75vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/40 border border-slate-200 bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">🤖</div>
            <div>
              <p className="text-white font-black text-sm">Avadi Connect AI</p>
              <p className="text-amber-100 text-xs font-medium">Always here to help • நம்ம சேவை</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-slate-50 scroll-smooth" style={{ minHeight: 200, maxHeight: 360 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-sm'
                  }`}
                >
                  {formatText(msg.text)}
                  <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-amber-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 border-t border-slate-100 bg-white flex gap-2 overflow-x-auto scrollbar-none">
            {['Book service', 'Track worker', 'Fees?', 'Emergency'].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); setTimeout(sendMessage, 50); }}
                className="shrink-0 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold rounded-full hover:bg-amber-100 transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-100 bg-white flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your question…"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm text-slate-800 font-medium transition"
              maxLength={200}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center text-lg disabled:opacity-40 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};
