import React from 'react';
import { FilterType } from '../types';

interface TodoFilterProps {
  currentFilter: FilterType;                  // 현재 선택된 필터 ('all' | 'active' | 'completed')
  onFilterChange: (filter: FilterType) => void; // 필터 변경 시 호출되는 함수
  totalCount: number;                          // 전체 개수
  activeCount: number;                         // 진행 중 개수
  completedCount: number;                      // 완료 개수
}

/**
 * TodoFilter 컴포넌트 (Cyberpunk Neon Edition)
 * 
 * 시니어 개발자의 한마디:
 * SF 우주선 조종 패널 및 사이버펑크 HUD의 모드 전환 스위치처럼 디자인했습니다.
 * 각 탭 버튼을 클릭하면 파란색, 보라색, 분홍색 네온 라이트가 켜지며
 * 미래형 인터페이스 조작의 즐거움을 줍니다.
 */
export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
  totalCount,
  activeCount,
  completedCount,
}) => {
  const filterOptions: { type: FilterType; label: string; code: string; count: number }[] = [
    { type: 'all', label: '전체', code: 'ALL', count: totalCount },
    { type: 'active', label: '진행 중', code: 'ACTIVE', count: activeCount },
    { type: 'completed', label: '완료', code: 'DONE', count: completedCount },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-[#0a0b16] rounded-xl border border-purple-500/20 mb-5">
      {filterOptions.map((option) => {
        const isActive = currentFilter === option.type;

        return (
          <button
            key={option.type}
            type="button"
            onClick={() => onFilterChange(option.type)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-cyber tracking-wider transition-all duration-300 cursor-pointer relative overflow-hidden ${
              isActive
                ? 'bg-gradient-to-r from-cyan-950/80 via-purple-950/80 to-pink-950/80 text-cyan-300 border border-cyan-400/80 shadow-[0_0_15px_rgba(0,240,255,0.4)] font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
            }`}
          >
            {/* 활성 탭 상단 네온 광선 라인 */}
            {isActive && (
              <span className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            )}

            <span>{option.label}</span>
            <span className="text-[10px] opacity-70 hidden sm:inline">[{option.code}]</span>

            {/* 네온 개수 카운터 뱃지 */}
            <span
              className={`px-1.5 py-0.5 text-[11px] font-tech font-bold rounded ${
                isActive
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
