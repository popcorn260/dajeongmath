import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* 
        [상단 헤더] 
        화면 상단에 고정되며 스크롤 시 부드러운 그림자가 보입니다.
      */}
      <header className="sticky top-0 z-50 bg-[#fff5f8]/80 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(255,182,193,0.3)]">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-500 cursor-pointer hover:scale-105 transition-transform duration-200">
            <Heart className="w-7 h-7 fill-pink-400 text-pink-400" />
            <span className="text-2xl tracking-wide text-pink-500 font-bold drop-shadow-sm">
              다정한 수학
            </span>
          </div>
          
          <nav className="hidden sm:flex gap-6">
            <button className="text-gray-500 hover:text-pink-500 hover:bg-pink-100 px-4 py-2 rounded-full transition-all duration-200 text-lg">
              학습하기
            </button>
            <button className="text-gray-500 hover:text-pink-500 hover:bg-pink-100 px-4 py-2 rounded-full transition-all duration-200 text-lg">
              만들기
            </button>
            <button className="text-gray-500 hover:text-pink-500 hover:bg-pink-100 px-4 py-2 rounded-full transition-all duration-200 text-lg">
              소개
            </button>
          </nav>
        </div>
      </header>

      {/* 
        [메인 화면(Hero Section)] 
        사용자를 반겨주는 중심 화면입니다.
      */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#fff5f8] via-[#fdf0f4] to-[#e0f7fa]">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">
          
          <div className="space-y-6">
            {/* 귀여운 뱃지 */}
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white text-mint-500 text-sm font-medium text-[#40c057] shadow-sm">
              <Sparkles className="w-4 h-4" />
              환영합니다!
            </div>
            
            {/* 메인 타이틀 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-[#ff8da1] leading-tight drop-shadow-sm">
              나만의 교육용 웹앱 만들기
            </h1>
            
            {/* 서브 타이틀 */}
            <p className="text-lg sm:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
              초보자도 쉽게 따라 할 수 있는 솜사탕처럼 부드러운 템플릿입니다. 원하는 기능을 자유롭게 추가해 보세요!
            </p>
          </div>

          {/* 
            [기능 추가를 위한 가짜 버튼]
            젤리처럼 통통 튀는 hover 애니메이션이 적용되어 있습니다. 
          */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <button className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-[#b2dfdb] hover:bg-[#a1cdc9] text-gray-700 text-xl rounded-full shadow-[0_8px_0_0_#80cbc4] hover:shadow-[0_4px_0_0_#80cbc4] hover:translate-y-1 transition-all duration-200 active:shadow-none active:translate-y-2">
              시작하기
              <ArrowRight className="w-6 h-6 text-gray-600 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/quiz" className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-[#ffd873] hover:bg-[#e8b84b] text-gray-700 text-xl rounded-full shadow-[0_8px_0_0_#d4a238] hover:shadow-[0_4px_0_0_#d4a238] hover:translate-y-1 transition-all duration-200 active:shadow-none active:translate-y-2">
              2학년 골든벨 퀴즈
              <ArrowRight className="w-6 h-6 text-gray-600 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/quiz3" className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-[#ffb3c6] hover:bg-[#e698ab] text-gray-700 text-xl rounded-full shadow-[0_8px_0_0_#c77d8f] hover:shadow-[0_4px_0_0_#c77d8f] hover:translate-y-1 transition-all duration-200 active:shadow-none active:translate-y-2">
              3학년 골든벨 퀴즈
              <ArrowRight className="w-6 h-6 text-gray-600 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/gugudan" className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-[#8FD3FF] hover:bg-[#6cbceb] text-gray-700 text-xl rounded-full shadow-[0_8px_0_0_#4FADE6] hover:shadow-[0_4px_0_0_#4FADE6] hover:translate-y-1 transition-all duration-200 active:shadow-none active:translate-y-2">
              구구단 콩콩 게임
              <ArrowRight className="w-6 h-6 text-gray-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
        </div>
      </main>

      {/* 
        [하단 푸터] 
        카피라이트 공간
      */}
      <footer className="py-10 bg-white/60 text-center text-gray-400 text-sm backdrop-blur-sm">
        <p>© {new Date().getFullYear()} 다정한 수학. All rights reserved.</p>
        <p className="mt-2 text-gray-400">선생님과 아이들을 위한 따뜻한 공간 🧸</p>
      </footer>
    </>
  );
}
