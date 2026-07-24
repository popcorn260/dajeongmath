"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { Trophy, ArrowLeft, Swords, Clock, Target, Medal } from 'lucide-react';

type PracticeRecord = {
  id: string;
  player_name: string;
  correct_count: number;
  elapsed_time_sec: number;
  created_at: string;
};

type BattleRecord = {
  id: string;
  player1_name: string;
  player2_name: string;
  player1_time_sec: number;
  player2_time_sec: number;
  winner: string;
  created_at: string;
};

export default function LeaderboardPage() {
  const [practiceRecords, setPracticeRecords] = useState<PracticeRecord[]>([]);
  const [battleRecords, setBattleRecords] = useState<BattleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    setLoading(true);
    try {
      // 1. 연습 모드 최고 기록 TOP 10 가져오기 (정답 많은 순, 시간이 짧은 순)
      const { data: practiceData, error: practiceError } = await supabase
        .from('practice_records')
        .select('*')
        .order('correct_count', { ascending: false })
        .order('elapsed_time_sec', { ascending: true })
        .limit(10);

      if (practiceError) throw practiceError;
      if (practiceData) setPracticeRecords(practiceData);

      // 2. 대결 모드 최근 기록 가져오기 (최신순 TOP 10)
      const { data: battleData, error: battleError } = await supabase
        .from('battle_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (battleError) throw battleError;
      if (battleData) setBattleRecords(battleData);
    } catch (err) {
      console.error('Failed to fetch leaderboards:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toFixed(1);
    const mm = m < 10 ? '0' + m : '' + m;
    const ss = Number(s) < 10 ? '0' + s : s;
    return `${mm}:${ss}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] text-[#343a40] p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/linear-function" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-lg">게임으로 돌아가기</span>
          </Link>
          <h1 className="text-4xl font-black text-[#212529] tracking-tight flex items-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            명예의 전당
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium text-xl animate-pulse">
            기록을 불러오는 중입니다...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Practice Mode Leaderboard */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white text-center">
                <Target className="w-10 h-10 mx-auto mb-2 opacity-90" />
                <h2 className="text-2xl font-bold">연습 모드 TOP 10</h2>
                <p className="text-blue-100 text-sm mt-1">많이, 그리고 빨리 맞힌 순위입니다</p>
              </div>
              <div className="p-4">
                {practiceRecords.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">아직 등록된 기록이 없습니다.</div>
                ) : (
                  <ul className="space-y-3">
                    {practiceRecords.map((record, index) => (
                      <li key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-400 text-yellow-900' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-amber-600 text-white' : 'bg-white text-gray-500 border'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-bold text-lg text-gray-800">{record.player_name}</div>
                            <div className="text-xs text-gray-400">{formatDate(record.created_at)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-blue-600 text-lg">{record.correct_count}점</div>
                          <div className="text-xs font-medium text-gray-500 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {formatTime(record.elapsed_time_sec)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Battle Mode Leaderboard */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 text-white text-center">
                <Swords className="w-10 h-10 mx-auto mb-2 opacity-90" />
                <h2 className="text-2xl font-bold">최근 대진 기록</h2>
                <p className="text-rose-100 text-sm mt-1">최근에 벌어진 치열한 승부들입니다</p>
              </div>
              <div className="p-4">
                {battleRecords.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">아직 등록된 대결 기록이 없습니다.</div>
                ) : (
                  <ul className="space-y-4">
                    {battleRecords.map((record) => (
                      <li key={record.id} className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md border">{formatDate(record.created_at)}</span>
                          <span className="text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md flex items-center gap-1">
                            <Medal className="w-4 h-4" />
                            {record.winner === '무승부' ? '무승부' : `${record.winner} 승리!`}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                          <div className={`flex-1 text-center p-2 rounded-xl ${record.winner === record.player1_name ? 'bg-white shadow-sm border border-rose-100 ring-2 ring-rose-400 ring-opacity-50' : ''}`}>
                            <div className="font-bold text-gray-800 truncate">{record.player1_name}</div>
                            <div className="text-sm text-gray-500 font-mono mt-1">{formatTime(record.player1_time_sec)}</div>
                          </div>
                          
                          <div className="text-gray-300 font-black italic px-2">VS</div>
                          
                          <div className={`flex-1 text-center p-2 rounded-xl ${record.winner === record.player2_name ? 'bg-white shadow-sm border border-rose-100 ring-2 ring-rose-400 ring-opacity-50' : ''}`}>
                            <div className="font-bold text-gray-800 truncate">{record.player2_name}</div>
                            <div className="text-sm text-gray-500 font-mono mt-1">{formatTime(record.player2_time_sec)}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
