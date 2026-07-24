import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
});

export const metadata: Metadata = {
  title: "다정한 수학 - 교육용 웹앱 뼈대",
  description: "선생님들이 만드는 귀여운 교육용 웹앱을 위한 기본 뼈대 코드입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jua.variable} antialiased`}>
      {/* 
        부드러운 파스텔 핑크 배경색과 귀여운 Jua 폰트를 기본으로 적용합니다. 
        selection:bg-pink-200 클래스는 텍스트를 드래그할 때의 배경색을 핑크색으로 만들어줍니다.
      */}
      <body className="flex flex-col min-h-screen bg-[#fff5f8] text-gray-800 font-jua selection:bg-pink-200">
        {children}
      </body>
    </html>
  );
}
