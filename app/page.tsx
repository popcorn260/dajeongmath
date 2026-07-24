"use client";

import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, Heart, X, Trophy, Gamepad2, GraduationCap, Play } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [showIntroModal, setShowIntroModal] = useState(false);
  const learningSectionRef = useRef<HTMLElement>(null);

  const scrollToLearning = () => {
    learningSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMakeClick = () => {
    alert("다정쌤이 새로운 수학 웹앱을 제작 중입니다! 🛠️");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 
        [상단 헤더] 
      */}
      <header className="sticky top-0 z-40 bg-[#fff5f8]/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(255,182,193,0.3)]">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 text-pink-500 cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Heart className="w-7 h-7 fill-pink-400 text-pink-400" />
            <span className="text-2xl tracking-wide text-pink-500 font-bold drop-shadow-sm" style={{ fontFamily: '"Jua", sans-serif' }}>
              다정한 수학
            </span>
          </div>
          
          <nav className="hidden sm:flex gap-6">
            <button 
              onClick={scrollToLearning}
              className="text-gray-500 hover:text-pink-500 hover:bg-pink-100 px-4 py-2 rounded-full transition-all duration-200 text-lg font-medium"
            >
              학습하기
            </button>
            <button 
              onClick={handleMakeClick}
              className="text-gray-500 hover:text-pink-500 hover:bg-pink-100 px-4 py-2 rounded-full transition-all duration-200 text-lg font-medium"
            >
              만들기
            </button>
            <button 
              onClick={() => setShowIntroModal(true)}
              className="text-gray-500 hover:text-pink-500 hover:bg-pink-100 px-4 py-2 rounded-full transition-all duration-200 text-lg font-medium"
            >
              소개
            </button>
          </nav>
        </div>
      </header>

      {/* 
        [메인 화면(Hero Section)] 
      */}
      <main className="flex-1 flex flex-col items-center bg-gradient-to-b from-[#fff5f8] via-[#fdf0f4] to-[#e0f7fa]">
        
        <section className="w-full py-20 px-6 text-center flex flex-col items-center justify-center">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* 귀여운 뱃지 */}
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white text-[#40c057] text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4" />
              환영합니다!
            </div>
            
            {/* 메인 타이틀 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#ff8da1] leading-tight drop-shadow-sm font-bold" style={{ fontFamily: '"Jua", sans-serif' }}>
              다정쌤과 함께하는<br/>재미있는 수학 교실 🎈
            </h1>
            
            {/* 서브 타이틀 */}
            <p className="text-lg sm:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
              원하는 수학 게임을 선택하고 즐겁게 문제를 풀어보세요!
            </p>
          </div>
        </section>

        {/* 
          [콘텐츠 카테고리화 및 카드 UI 레이아웃]
        */}
        <section ref={learningSectionRef} className="w-full max-w-5xl mx-auto px-6 pb-24">
          
          {/* 섹션 A: 🎮 즐거운 수학 게임 */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#5c8b87] mb-8 flex items-center gap-3 drop-shadow-sm" style={{ fontFamily: '"Jua", sans-serif' }}>
              <div className="p-3 bg-[#b2dfdb] rounded-2xl">
                <Gamepad2 className="w-8 h-8 text-[#00796b]" />
              </div>
              즐거운 수학 게임
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: 구구단 콩콩 게임 */}
              <div className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(143,211,255,0.2)] border-2 border-[#e1f3ff] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="w-16 h-16 bg-[#e1f3ff] rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  🐰
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: '"Jua", sans-serif' }}>구구단 콩콩 게임</h3>
                <p className="text-gray-500 mb-6 flex-1">귀여운 토끼와 함께 콩콩 뛰며 구구단을 빠르고 정확하게 외워보세요!</p>
                <Link href="/gugudan" className="flex items-center justify-center gap-2 w-full py-4 bg-[#8FD3FF] hover:bg-[#6cbceb] text-white text-lg font-bold rounded-2xl shadow-[0_6px_0_0_#4FADE6] hover:shadow-[0_2px_0_0_#4FADE6] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2">
                  <Play className="w-5 h-5 fill-current" /> 게임 시작
                </Link>
              </div>

              {/* Card 2: 일차방정식 연습 */}
              <div className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(253,238,221,0.5)] border-2 border-[#faebd7] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="w-16 h-16 bg-[#faebd7] rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  🧮
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: '"Jua", sans-serif' }}>일차방정식 연습</h3>
                <p className="text-gray-500 mb-6 flex-1">다양한 난이도의 일차방정식을 풀며 방정식 마스터가 되어보세요!</p>
                <Link href="/equation" className="flex items-center justify-center gap-2 w-full py-4 bg-[#fdeedd] hover:bg-[#ebd5bd] text-[#c96f2a] text-lg font-bold rounded-2xl shadow-[0_6px_0_0_#c96f2a] hover:shadow-[0_2px_0_0_#c96f2a] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2">
                  <Play className="w-5 h-5 fill-current" /> 연습 시작
                </Link>
              </div>

              {/* Card 3: 일차함수 대입 게임 (With Leaderboard) */}
              <div className="group bg-[#fffdf8] rounded-3xl p-6 shadow-[0_8px_30px_rgba(230,196,145,0.3)] border-2 border-[#e6c491] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-50"></div>
                <div className="w-16 h-16 bg-[#fffaf1] border border-[#e6c491] rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-110 transition-transform relative z-10">
                  🐻
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 relative z-10" style={{ fontFamily: '"Jua", sans-serif' }}>일차함수 대입 게임</h3>
                <p className="text-gray-500 mb-6 flex-1 relative z-10">x값을 대입해 y값을 빠르게 구해볼까요? 친구와 대결도 가능해요!</p>
                
                <div className="flex flex-col gap-3 mt-auto relative z-10">
                  <Link href="/linear-function" className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#ffe9c7] to-[#f6cf98] text-[#8a5a35] text-lg font-bold rounded-2xl shadow-[0_6px_0_0_#c98a4b] hover:shadow-[0_2px_0_0_#c98a4b] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2 border border-[#d9a35f]">
                    <Gamepad2 className="w-6 h-6" /> 게임 시작
                  </Link>
                  <Link href="/leaderboard" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-500 text-md font-bold rounded-2xl shadow-[0_4px_0_0_#c7d2fe] hover:bg-indigo-50 hover:shadow-[0_2px_0_0_#c7d2fe] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2 border-2 border-indigo-100">
                    <Trophy className="w-5 h-5" /> 명예의 전당
                  </Link>
                </div>
              </div>

              {/* Card 4: AI 다정쌤에게 질문하기 */}
              <div className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,182,193,0.3)] border-2 border-[#ffe0e8] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full lg:col-span-3 xl:col-span-1">
                <div className="w-16 h-16 bg-[#ffe0e8] rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  🤖
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: '"Jua", sans-serif' }}>AI 다정쌤에게 질문하기</h3>
                <p className="text-gray-500 mb-6 flex-1">모르는 문제가 있나요? 인공지능 다정쌤이 언제든 친절하게 알려줄게요!</p>
                <Link href="/chat" className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white text-lg font-bold rounded-2xl shadow-[0_6px_0_0_#d81b60] hover:shadow-[0_2px_0_0_#d81b60] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2">
                  <Sparkles className="w-5 h-5" /> 대화 시작하기
                </Link>
              </div>

            </div>
          </div>

          {/* 섹션 B: 🔔 학년별 골든벨 퀴즈 */}
          <div>
            <h2 className="text-3xl font-bold text-[#b86177] mb-8 flex items-center gap-3 drop-shadow-sm" style={{ fontFamily: '"Jua", sans-serif' }}>
              <div className="p-3 bg-[#ffb3c6] rounded-2xl">
                <GraduationCap className="w-8 h-8 text-[#903049]" />
              </div>
              학년별 골든벨 퀴즈
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              
              {/* Card 1: 2학년 골든벨 퀴즈 */}
              <div className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,216,115,0.2)] border-2 border-[#fff3cc] flex flex-col h-full hover:shadow-[0_12px_40px_rgba(255,216,115,0.4)] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-[#fff3cc] rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:rotate-12 transition-transform">
                    🔔
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full">2학년</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: '"Jua", sans-serif' }}>2학년 골든벨 퀴즈</h3>
                <p className="text-gray-500 mb-6 flex-1">2학년 친구들을 위한 재미있는 퀴즈 대회! 과연 최후의 1인이 될 수 있을까요?</p>
                <Link href="/quiz" className="flex items-center justify-center gap-2 w-full py-4 bg-[#ffd873] hover:bg-[#e8b84b] text-yellow-900 text-lg font-bold rounded-2xl shadow-[0_6px_0_0_#d4a238] hover:shadow-[0_2px_0_0_#d4a238] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2">
                  퀴즈 풀기 <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Card 2: 3학년 골든벨 퀴즈 */}
              <div className="group bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(255,179,198,0.2)] border-2 border-[#ffe0e8] flex flex-col h-full hover:shadow-[0_12px_40px_rgba(255,179,198,0.4)] transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-[#ffe0e8] rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:rotate-12 transition-transform">
                    🎓
                  </div>
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm font-bold rounded-full">3학년</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: '"Jua", sans-serif' }}>3학년 골든벨 퀴즈</h3>
                <p className="text-gray-500 mb-6 flex-1">3학년 선배들을 위한 심화 퀴즈! 어려운 문제도 척척 풀어보세요.</p>
                <Link href="/quiz3" className="flex items-center justify-center gap-2 w-full py-4 bg-[#ffb3c6] hover:bg-[#e698ab] text-pink-900 text-lg font-bold rounded-2xl shadow-[0_6px_0_0_#c77d8f] hover:shadow-[0_2px_0_0_#c77d8f] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2">
                  도전하기 <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

            </div>
          </div>

        </section>
      </main>

      {/* 
        [하단 푸터] 
      */}
      <footer className="py-10 bg-white/60 text-center text-gray-400 text-sm backdrop-blur-sm mt-auto">
        <p>© {new Date().getFullYear()} 다정한 수학. All rights reserved.</p>
        <p className="mt-2 text-gray-400">선생님과 아이들을 위한 따뜻한 공간 🧸</p>
      </footer>

      {/* 
        [소개 모달 팝업] 
      */}
      {showIntroModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowIntroModal(false)}></div>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setShowIntroModal(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center mt-4">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Heart className="w-10 h-10 text-pink-400 fill-pink-400 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: '"Jua", sans-serif' }}>다정한 수학</h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  선생님과 아이들이 함께 즐겁게<br/>수학을 배울 수 있는 따뜻한 공간입니다.
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  재미있는 게임과 퀴즈를 통해<br/>수학과 훌쩍 친해져 보세요! 🧸
                </p>
                <button 
                  onClick={() => setShowIntroModal(false)} 
                  className="mt-8 w-full py-4 bg-pink-100 text-pink-600 font-bold text-lg rounded-2xl hover:bg-pink-200 hover:shadow-md transition-all"
                >
                  확인했어요
                </button>
              </div>
            </div>
         </div>
       )}
       
       <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
       `}} />
    </div>
  );
}
