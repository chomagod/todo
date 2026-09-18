import React from 'react';
import { Terminal, Cpu, Zap } from 'lucide-react';

interface TodoHeaderProps {
  totalCount: number;      // 전체 할 일 개수
  completedCount: number;  // 완료된 할 일 개수
}

/**
 * TodoHeader 컴포넌트 (Cyberpunk Neon Edition)
 * 
 * 시니어 개발자의 한마디:
 * 미래 SF 도시의 네온 전광판과 홀로그램 HUD 인터페이스 분위기를 연출했습니다.
 * 시안(Cyan) 블루, 네온 바이올렛(Purple), 마젠타(Pink) 색상의 빛을 발광 효과와 함께 구성하여
 * 영화 <블레이드 러너>나 <사이버펑크 2077> 같은 몰입감을 선사합니다.
 */
export const TodoHeader: React.FC<TodoHeaderProps> = ({
  totalCount,
  completedCount,
}) => {
  // 오늘 날짜를 사이버펑크 터미널 스타일로 표시
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).replace(/\./g, ' /');

  // 진행률 계산 (0으로 나누는 오류 방지)
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="mb-6 relative">
      {/* 상단 장식용 홀로그램 HUD 라인 */}
      <div className="flex items-center justify-between text-[11px] font-cyber tracking-widest text-cyan-400/80 mb-2 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
          SYSTEM STATUS: ONLINE
        </span>
        <span className="text-fuchsia-400 flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5" /> SEC-07 PROTOCOL
        </span>
      </div>

      {/* 헤더 메인 타이틀 영역 (전광판 스타일) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cyan-500/20 gap-3">
        <div className="flex items-center gap-3">
          {/* 네온 아이콘 박스 */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-pink-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 neon-box-blue shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            <Terminal className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-cyber tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 neon-text-blue">
                NEON TODO
              </h1>
              <span className="text-[10px] font-cyber px-1.5 py-0.5 rounded bg-pink-500/20 border border-pink-500/50 text-pink-300">
                v2.0
              </span>
            </div>
            <p className="text-xs font-tech tracking-wider text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>미래 도시 할 일 관리 터미널 // {dateString}</span>
            </p>
          </div>
        </div>

        {/* 완료 현황 네온 배지 */}
        <div className="self-start sm:self-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0e1022] border border-fuchsia-500/40 text-fuchsia-300 text-xs sm:text-sm font-cyber tracking-wider neon-box-pink">
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#ff007f]" />
            <span>
              {completedCount} / {totalCount} DONE
            </span>
          </div>
        </div>
      </div>

      {/* 미래형 네온 에너지 게이지 (프로그레스 바) */}
      <div className="mt-4 p-2 rounded-xl bg-[#0b0c19] border border-purple-500/30 neon-box-purple">
        <div className="flex justify-between items-center text-xs font-cyber tracking-wider mb-1.5">
          <span className="text-cyan-400 flex items-center gap-1">
            TASK COMPLETION RATE
          </span>
          <span className="text-fuchsia-400 font-bold tracking-widest text-sm neon-text-pink">
            {progressPercent}%
          </span>
        </div>
        
        {/* 네온 발광 프로그레스 트랙 */}
        <div className="w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-purple-500/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(0,240,255,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
