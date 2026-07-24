"use client";

import React, { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: '안녕! 나는 너의 수학 고민을 들어줄 AI 다정쌤이야 🎈\n수학 숙제나 어려운 개념이 있다면 언제든 물어봐 줘!'
      }
    ]
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf0f4] to-[#fff5f8] flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-2 font-bold text-gray-800 text-lg" style={{ fontFamily: '"Jua", sans-serif' }}>
            <Bot className="w-6 h-6 text-pink-400" />
            AI 다정쌤
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col gap-4 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-blue-100 text-blue-500' : 'bg-pink-100 text-pink-500'}`}>
              {m.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[75%] px-5 py-3 rounded-3xl shadow-sm whitespace-pre-wrap leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-500 text-white rounded-tr-sm' 
                : 'bg-white text-gray-700 rounded-tl-sm border border-pink-50'
            }`}>
              {m.content}
            </div>
            
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-6 h-6 animate-pulse" />
             </div>
             <div className="bg-white text-gray-400 px-5 py-3 rounded-3xl rounded-tl-sm border border-pink-50 shadow-sm flex items-center gap-2">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white p-4 shadow-[0_-4px_20px_-4px_rgba(255,182,193,0.1)]">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="수학 질문을 입력해보세요!"
              disabled={isLoading}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-6 py-4 text-gray-700 outline-none focus:border-pink-300 focus:bg-white transition-all shadow-inner"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-md active:translate-y-1"
            >
              <Send className="w-6 h-6 -ml-1" />
            </button>
          </form>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
      `}} />
    </div>
  );
}
