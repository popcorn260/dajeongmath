"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { HallOfFameEntry } from '@/lib/types';
import Link from 'next/link';

export default function HallOfFamePage() {
  const [entries, setEntries] = useState<HallOfFameEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [gradeFilter, setGradeFilter] = useState<'all' | '2' | '3'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');

  useEffect(() => {
    fetchHallOfFame();
  }, []);

  const fetchHallOfFame = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hall_of_fame')
        .select('*')
        .order('grade', { ascending: true })
        .order('class_name', { ascending: true })
        .order('rank', { ascending: true });
        
      if (error) throw error;
      setEntries(data || []);
    } catch (e) {
      console.error(e);
      alert('명예의 전당 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEntries = entries.filter(e => {
    if (gradeFilter !== 'all' && e.grade !== Number(gradeFilter)) return false;
    if (classFilter !== 'all' && e.class_name !== classFilter) return false;
    return true;
  });

  const uniqueClasses = Array.from(new Set(entries.filter(e => gradeFilter === 'all' || e.grade === Number(gradeFilter)).map(e => e.class_name))).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a1830', color: '#f4efe2', fontFamily: '"Noto Sans KR", sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
           <Link href="/" style={{ color: '#e8b84b', textDecoration: 'none', fontWeight: 'bold' }}>← 메인으로 돌아가기</Link>
        </div>

        <h1 style={{ fontFamily: '"Black Han Sans", sans-serif', textAlign: 'center', fontSize: '3rem', color: '#ffd873', marginBottom: '10px' }}>
          🏆 명예의 전당 🏆
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '40px', color: '#ccc' }}>골든벨 퀴즈 최종 우승자들의 기록입니다.</p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
          <select 
            value={gradeFilter} 
            onChange={e => { setGradeFilter(e.target.value as any); setClassFilter('all'); }}
            style={{ padding: '10px', borderRadius: '8px', background: '#16305f', color: '#fff', border: '1px solid #e8b84b' }}
          >
            <option value="all">전체 학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </select>

          <select 
            value={classFilter} 
            onChange={e => setClassFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', background: '#16305f', color: '#fff', border: '1px solid #e8b84b' }}
          >
            <option value="all">전체 반</option>
            {uniqueClasses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* List */}
        {isLoading ? (
          <p style={{ textAlign: 'center' }}>데이터를 불러오는 중입니다...</p>
        ) : filteredEntries.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>해당 조건의 기록이 없습니다.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredEntries.map((entry, idx) => {
               let bg = '#16305f';
               let medal = `${entry.rank}위`;
               if (entry.rank === 1) { bg = 'linear-gradient(135deg, #e8b84b, #ffd873)'; medal = '🥇'; }
               else if (entry.rank === 2) { bg = 'linear-gradient(135deg, #ccc, #eee)'; medal = '🥈'; }
               else if (entry.rank === 3) { bg = 'linear-gradient(135deg, #cd7f32, #e6a873)'; medal = '🥉'; }

               return (
                 <div key={entry.id} style={{ 
                   background: bg, 
                   color: entry.rank <= 3 ? '#0a1830' : '#fff',
                   padding: '20px', 
                   borderRadius: '12px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'space-between',
                   boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                   fontWeight: entry.rank <= 3 ? 'bold' : 'normal'
                 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <span style={{ fontSize: '1.5rem', minWidth: '40px', textAlign: 'center' }}>{medal}</span>
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.2rem' }}>{entry.student_name}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{entry.grade}학년 {entry.class_name}</span>
                     </div>
                   </div>
                   <div style={{ fontSize: '1.4rem' }}>
                     {entry.score}점
                   </div>
                 </div>
               );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
