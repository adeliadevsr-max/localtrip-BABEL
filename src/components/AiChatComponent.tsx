/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Compass, Send, Sparkles, MessageSquareHeart, User, HelpCircle, AlertCircle, Loader } from 'lucide-react';
import { ChatMessage } from '../types';

interface AiChatComponentProps {
  token: string;
  username: string;
}

export default function AiChatComponent({ token, username }: AiChatComponentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `Halo Kak ${username}! Selamat datang di gerbang cerdas Tanya AI LocalTrip Babel. 🌴

Saya adalah pemandu lokal pribadi Anda yang siap 24 jam menjawab ragam informasi seputar pantai granit terbaik, kelayakan kuliner terasi lokal, tips sewa keliling kendaraan, hingga perkiraan cuaca di Bangka dan Belitung.

Harap konsultasikan rencana bepergian Anda kelak! Ada yang bisa saya bantu hari ini?`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Di mana spot sunset terindah di Belitung?",
    "Rekomendasi Lempah Kuning halal di Bangka?",
    "Berapa estimasi biaya sewa motor per hari?",
    "Beri saya ide liburan romantis di Pantai Parai"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pertanyaan: textToSend,
          nama_user: username,
          wilayah: 'Belitung', // defaults
          budget: '300000'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server mengalami overload rute, harap coba lagi.');
      }

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: data.jawaban,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'error_' + Date.now(),
        sender: 'ai',
        text: `Maaf Kak ${username}, jaringan asisten AI sedang terhambat: "${err.message}". Namun secara umum, silakan pertimbangkan menjelajah Pantai Tanjung Tinggi di Belitung Barat yang air lautnya sangat tenang.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[550px]" id="ai-chat-component">
      
      {/* Header info */}
      <div className="border-b border-slate-150 pb-4 mb-4 flex justify-between items-center">
        <div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">24/7 LIVE AI</span>
          <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight mt-1">Tanya Pemandu Wisata Babel</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Asisten virtual yang memahami seputar kultur daerah, transport, penginapan & biaya lokal.</p>
        </div>

        <div className="flex items-center gap-1.5 p-2 bg-emerald-50 rounded-2xl border border-emerald-100/50">
          <MessageSquareHeart className="w-5 h-5 text-emerald-600 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-950">Active Guide</span>
        </div>
      </div>

      {/* Messages list bubble */}
      <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[380px] p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            {/* Avatar icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
            </div>

            {/* Bubble body */}
            <div className={`p-4 rounded-3xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200/60 shadow-xs text-slate-800 rounded-tl-none'}`}>
              <p className="whitespace-pre-line font-medium">{msg.text}</p>
              <span className={`text-[9px] block text-right mt-2 ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold p-4 mr-auto bg-white border border-slate-200 rounded-3xl rounded-tl-none max-w-[200px]">
            <Loader className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>AI sedang mengetik...</span>
          </div>
        )}

        <div ref={chatBottomRef}></div>
      </div>

      {/* Suggested prompts starting row */}
      <div className="my-3">
        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5 flex items-center gap-0.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-300" /> Pilih Pertanyaan Cepat:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[9px] font-bold bg-white text-slate-600 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Message input footer */}
      <div className="mt-2">
        <div className="flex gap-2">
          <input
            id="chat-input-field"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Ketik pertanyaan seputar Babel di sini..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
          />
          <button
            id="btn-send-chat"
            onClick={() => handleSendMessage(inputText)}
            className="p-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl transition-all flex items-center justify-center shrink-0"
            title="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
