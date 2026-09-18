import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw, Layers } from 'lucide-react';
import { formatDateToISO, formatDateToKorean, getPrevDate, getNextDate } from '../utils/dateUtils';
import { DateViewMode } from '../types';

interface DateNavigatorProps {
  selectedDate: string;                            // 현재 선택된 날짜 ("YYYY-MM-DD")
  onDateChange: (newDate: string) => void;         // 날짜 변경 함수
  dateViewMode: DateViewMode;                      // 'selected' | 'all'
  onViewModeToggle: () => void;                    // 날짜 모드 토글 함수
  taskCountForSelectedDate: number;                // 선택한 날짜에 예정된 할 일 수
}

/**
 * DateNavigator 컴포넌트 (Chrono Navigator)
 * 
 * 시니어 개발자의 한마디:
 * 다른 날의 일정도 자유롭게 설정하고 탐색할 수 있는 미래형 시간 제어기(Time Navigator)입니다.
 * - 이전 날(<), 다음 날(>) 원클릭 이동
 * - 달력 팝업(HTML5 native date picker)을 통한 미래/과거 임의 날짜 선택
 * - 오늘 날짜로의 즉시 복귀(TODAY 버튼)
 * - '선택한 날짜만 보기'와 '모든 날짜 전체 일정 모아보기' 전환 기능을 제공합니다.
 */
export const DateNavigator: React.FC<DateNavigatorProps> = ({
  selectedDate,
  onDateChange,
  dateViewMode,
  onViewModeToggle,
  taskCountForSelectedDate,
}) => {
  const todayStr = formatDateToISO(new Date());
  const isToday = selectedDate === todayStr;

  // 이전 날짜로 이동 핸들러
  const handlePrevDay = () => {
    onDateChange(getPrevDate(selectedDate));
  };

  // 다음 날짜로 이동 핸들러
  const handleNextDay = () => {
    onDateChange(getNextDate(selectedDate));
  };

  // 오늘 날짜로 즉시 이동
  const handleGoToday = () => {
    onDateChange(todayStr);
  };

  // 달력 input에서 직접 날짜를 선택했을 때
  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onDateChange(e.target.value);
    }
  };

  return (
    <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-[#0a0b1c] border border-cyan-500/30 neon-box-blue">
      {/* 상단: 레이블 & 모드 토글 스위치 */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-cyan-500/15 text-xs font-cyber">
        <span className="text-cyan-400 flex items-center gap-1.5 tracking-wider">
          <CalendarIcon className="w-3.5 h-3.5 text-cyan-300" />
          CHRONO NAVIGATOR // 날짜 설정
        </span>

        {/* '선택 날짜만' vs '전체 날짜' 보기 토글 버튼 */}
        <button
          type="button"
          onClick={onViewModeToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-tech tracking-wider transition-all duration-200 cursor-pointer border ${
            dateViewMode === 'all'
              ? 'bg-fuchsia-950/80 border-fuchsia-400 text-fuchsia-300 shadow-[0_0_8px_rgba(255,0,127,0.4)]'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50'
          }`}
          title="날짜 필터 전환"
        >
          <Layers className="w-3 h-3" />
          <span>{dateViewMode === 'all' ? '모든 날짜 보기 [ON]' : '선택 날짜만 보기'}</span>
        </button>
      </div>

      {/* 메인 날짜 컨트롤러 영역 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* 날짜 좌우 이동 및 오늘 버튼 */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
          {/* 이전 날 버튼 */}
          <button
            type="button"
            onClick={handlePrevDay}
            className="flex items-center justify-center p-2 rounded-lg bg-[#0e1127] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            aria-label="이전 날짜로 이동"
            title="하루 전으로 이동"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 오늘 바로가기 버튼 */}
          <button
            type="button"
            onClick={handleGoToday}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-cyber tracking-wider transition-all cursor-pointer border ${
              isToday
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'bg-[#0e1127] border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
            title="오늘 날짜로 이동"
          >
            <RotateCcw className="w-3 h-3" />
            <span>TODAY</span>
          </button>

          {/* 다음 날 버튼 */}
          <button
            type="button"
            onClick={handleNextDay}
            className="flex items-center justify-center p-2 rounded-lg bg-[#0e1127] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
            aria-label="다음 날짜로 이동"
            title="하루 뒤로 이동"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 중앙: 현재 날짜 텍스트 & 네온 달력 피커 (input type="date") */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-end">
          <div className="text-right">
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <span className="text-sm sm:text-base font-bold font-tech text-white tracking-wide">
                {formatDateToKorean(selectedDate)}
              </span>
              {isToday && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-cyber bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
                  NOW
                </span>
              )}
            </div>
            <div className="text-[11px] font-cyber text-slate-400 mt-0.5">
              TARGET DATE: <span className="text-cyan-300">{selectedDate}</span>
              <span className="mx-1.5 text-slate-600">|</span>
              <span className="text-fuchsia-400 font-bold">{taskCountForSelectedDate}개 일정</span>
            </div>
          </div>

          {/* 네온 달력 피커 버튼 (클릭 시 브라우저 날짜 선택창 호출) */}
          <div className="relative group shrink-0">
            <input
              type="date"
              value={selectedDate}
              onChange={handleCustomDateChange}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-20"
              title="원하는 특정 날짜 선택하기"
            />
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-900/60 to-pink-900/60 border border-fuchsia-400/50 text-pink-300 group-hover:shadow-[0_0_12px_rgba(255,0,127,0.6)] group-hover:border-pink-300 transition-all cursor-pointer flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
