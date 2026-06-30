'use client';

import { useState, useEffect, useRef } from 'react';
import type { Conversation } from '@/src/types';
import { sendMessage, getConversation, resetSession } from '@/src/lib/api-client';

export default function ChatPage() {
  const [messages, setMessages] = useState<Conversation[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getConversation()
      .then(setMessages)
      .catch(() => {})
      .finally(() => setInitLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError('');
    setLoading(true);
    setIsTyping(true);

    const userMsg: Conversation = {
      id: crypto.randomUUID(),
      user_id: '',
      session_id: '',
      message: text,
      sender: 'user',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const reply = await sendMessage(text);
      setIsTyping(false);

      const agentMsg: Conversation = {
        id: crypto.randomUUID(),
        user_id: '',
        session_id: '',
        message: reply.reply,
        sender: 'agent',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      setIsTyping(false);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function handleNewChat() {
    resetSession();
    setMessages([]);
    setError('');
  }

  return (
    <div className="flex flex-col h-dvh max-w-3xl mx-auto bg-[#efeae2]">
      {/* Header */}
      <header className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-lg shrink-0">
          O
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold truncate">Order Status Bot</h1>
          <p className="text-xs text-[#8caba6]">
            {isTyping ? 'typing...' : 'online'}
          </p>
        </div>
        <button
          onClick={handleNewChat}
          className="text-white/80 hover:text-white text-sm px-2 py-1 rounded transition-colors"
          title="New conversation"
        >
          ✕
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-[#e5ddd5] bg-opacity-90">
        {initLoading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#075e54] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!initLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
            <div className="w-16 h-16 rounded-full bg-[#25d366]/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#25d366]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Ask me about your order status. Just send your order number like ORD-1001.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#d9fdd3] rounded-br-sm text-gray-900'
                  : 'bg-white rounded-bl-sm text-gray-900'
              }`}
            >
              <span className="whitespace-pre-wrap">{msg.message}</span>
              <div className={`text-[0.65rem] mt-1 ${msg.sender === 'user' ? 'text-[#667781] text-right' : 'text-[#667781]'}`}>
                {formatTime(msg.created_at)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="bg-red-100 border border-red-200 text-red-700 text-xs px-4 py-2 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="bg-[#f0f2f5] px-4 py-2 flex items-center gap-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
          className="flex-1 bg-white rounded-lg px-4 py-2.5 text-sm outline-none border border-transparent focus:border-[#25d366] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-11 h-11 rounded-full bg-[#25d366] flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0 hover:bg-[#20b85a]"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
