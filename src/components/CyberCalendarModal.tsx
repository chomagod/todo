import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { formatDateToISO, formatDateToKorean, calculateDDay } from '../utils/dateUtils';
import { Todo } from '../types';

interface CyberCalendarModalProps {
  isOpen: boolean;                                 // 모달 열림 여부
  onClose: () => void;                             // 모달 닫기 함수
  selectedDate: string;                            // 현재 선택된 날짜 ("YYYY-MM-DD")
  onSelectDate: (dateStr: string) => void;         // 날짜 선택 시 콜백
  todos?: Todo[];                                  // 날짜별 일정 개수/인디케이터 표시용
  title?: string;                                  // 모달 제목 (예: "CHRONO CALENDAR // 날짜 탐색")
}

/**
 * CyberCalendarModal 컴포넌트 (Cyberpunk Neon Custom Calendar)
 * 
 * 시니어 개발자의 가이드:
 * 브라우저 기본의 밋밋한 흰색 네이티브 달력 대신,
 * 사이버펑크 2077 및 SF 홀로그램 HUD 감성을 담은 전광판 네온 캘린더입니다.
 * - 월별 네비게이션 (<, >)
 * - 날짜별 일정(Todo) 인디케이터 도트 표시
 * - 오늘(NOW), 선택일(ACTIVE) 하이라이트
 * - D-Day 실시간 계산 및 퀵 버튼(오늘, 내일, 7일 뒤 등) 제공
 */
export const CyberCalendarModal: React.FC<CyberCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  todos = [],
  title = 'CHRONO CALENDAR // 네온 달력',
}) => {
  // 모달 내부에서 탐색 중인 연/월 상태 (초기값: 선택된 날짜 기준)
  const initialYear = selectedDate ? parseInt(selectedDate.split('-')[0], 10) : new Date().getFullYear();
  const initialMonth = selectedDate ? parseInt(selectedDate.split('-')[1], 10) - 1 : new Date().getMonth();

  const [viewYear, setViewYear] = useState<number>(initialYear);
  const [viewMonth, setViewMonth] = useState<number>(initialMonth); // 0 ~ 11
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  if (!isOpen) return null;

  const todayISO = formatDateToISO(new Date());

  // 이전 달로 이동
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // 다음 달로 이동
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // 오늘이 속한 달로 바로가기
  const handleJumpToToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onSelectDate(todayISO);
  };

  // 특정 날짜 선택 시
  const handleDateClick = (dateStr: string) => {
    onSelectDate(dateStr);
    onClose();
  };

  // 퀵 버튼용 날짜 계산 함수
  const getOffsetDate = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return formatDateToISO(d);
  };

  // 달력 그리드 계산 (해당 월의 날짜들 + 이전/다음 달 패딩 날짜)
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0(일) ~ 6(토)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // 날짜 셀 데이터 생성
  interface DayCell {
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    taskCount: number;
    hasActiveTask: boolean;
    hasCompletedTask: boolean;
  }

  const calendarDays: DayCell[] = [];

  // 1. 이전 달 날짜 패딩
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(viewYear, viewMonth - 1, dayNum);
    const dateStr = formatDateToISO(prevMonthDate);
    const dayTodos = todos.filter((t) => t.dueDate === dateStr);
    calendarDays.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayISO,
      isSelected: dateStr === selectedDate,
      taskCount: dayTodos.length,
      hasActiveTask: dayTodos.some((t) => !t.completed),
      hasCompletedTask: dayTodos.some((t) => t.completed),
    });
  }

  // 2. 이번 달 날짜
  for (let d = 1; d <= daysInMonth; d++) {
    const currDate = new Date(viewYear, viewMonth, d);
    const dateStr = formatDateToISO(currDate);
    const dayTodos = todos.filter((t) => t.dueDate === dateStr);
    calendarDays.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayISO,
      isSelected: dateStr === selectedDate,
      taskCount: dayTodos.length,
      hasActiveTask: dayTodos.some((t) => !t.completed),
      hasCompletedTask: dayTodos.some((t) => t.completed),
    });
  }

  // 3. 다음 달 날짜 패딩 (총 35일 또는 42일로 맞춤)
  const remainingCells = 42 - calendarDays.length;
  // 단, 35개로 충분할 경우 35개까지만 채움
  const targetTotal = calendarDays.length <= 35 ? 35 : 42;
  const needToAdd = targetTotal - calendarDays.length;

  for (let d = 1; d <= needToAdd; d++) {
    const nextMonthDate = new Date(viewYear, viewMonth + 1, d);
    const dateStr = formatDateToISO(nextMonthDate);
    const dayTodos = todos.filter((t) => t.dueDate === dateStr);
    calendarDays.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayISO,
      isSelected: dateStr === selectedDate,
      taskCount: dayTodos.length,
      hasActiveTask: dayTodos.some((t) => !t.completed),
      hasCompletedTask: dayTodos.some((t) => t.completed),
    });
  }

  // 요일 이름 배열
  const weekDayLabels = [
    { name: 'SUN', color: 'text-pink-400' },
    { name: 'MON', color: 'text-slate-300' },
    { name: 'TUE', color: 'text-slate-300' },
    { name: 'WED', color: 'text-slate-300' },
    { name: 'THU', color: 'text-slate-300' },
    { name: 'FRI', color: 'text-slate-300' },
    { name: 'SAT', color: 'text-cyan-400' },
  ];

  // 현재 호버 또는 선택된 날짜의 D-Day 정보
  const activeDateForPreview = hoveredDate || selectedDate;
  const dDayData = calculateDDay(activeDateForPreview);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* 캘린더 메인 컨테이너 (사이버펑크 HUD 스타일) */}
      <div
        className="relative w-full max-w-md bg-[#090b1c]/95 border-2 border-purple-500/40 rounded-2xl p-4 sm:p-6 shadow-[0_0_40px_rgba(176,38,255,0.35)] neon-box-cyber overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 네온 모서리 HUD 포인트 */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl pointer-events-none shadow-[0_0_8px_#00f0ff]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-pink-500 rounded-tr pointer-events-none shadow-[0_0_8px_#ff007f]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500 rounded-bl pointer-events-none shadow-[0_0_8px_#b026ff]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br pointer-events-none shadow-[0_0_8px_#00f0ff]" />

        {/* 1. 상단 HUD 타이틀 바 */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-300">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-cyber tracking-widest text-cyan-300 neon-text-blue">
                {title}
              </h2>
              <p className="text-[10px] font-tech text-slate-400">
                DATE MATRIX PROTOCOL // CYBER CALENDAR
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg border border-transparent hover:border-pink-500/40 transition-all cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. 연도 및 월 컨트롤러 (Month Navigator) */}
        <div className="flex items-center justify-between px-1 py-2 mb-3 bg-[#0d0f26] rounded-xl border border-cyan-500/30">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 rounded-lg border border-transparent transition-all cursor-pointer"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black font-cyber tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-300 to-pink-400">
              {viewYear} // {String(viewMonth + 1).padStart(2, '0')}
            </span>
            <span className="text-xs font-tech text-slate-400 hidden sm:inline">
              ({viewMonth + 1}월)
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleJumpToToday}
              className="px-2 py-1 text-[11px] font-cyber text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-500/20 rounded-md transition-all cursor-pointer flex items-center gap-1"
              title="오늘 달력으로 복귀"
            >
              <RotateCcw className="w-3 h-3" />
              <span>TODAY</span>
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 rounded-lg border border-transparent transition-all cursor-pointer"
              title="다음 달"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-1.5 text-center font-cyber text-[11px] tracking-wider py-1 border-b border-purple-500/15">
          {weekDayLabels.map((day) => (
            <div key={day.name} className={`${day.color} py-0.5`}>
              {day.name}
            </div>
          ))}
        </div>

        {/* 4. 달력 날짜 매트릭스 그리드 */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-4">
          {calendarDays.map((cell) => {
            const isHovered = hoveredDate === cell.dateStr;

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => handleDateClick(cell.dateStr)}
                onMouseEnter={() => setHoveredDate(cell.dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl transition-all duration-200 cursor-pointer min-h-[44px] sm:min-h-[50px] border ${
                  cell.isSelected
                    ? 'bg-gradient-to-br from-pink-600/90 via-purple-700/90 to-cyan-600/90 border-fuchsia-300 text-white shadow-[0_0_16px_rgba(255,0,127,0.7)] scale-105 z-10'
                    : cell.isToday
                    ? 'bg-[#0f1230] border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : cell.isCurrentMonth
                    ? 'bg-[#0d0e22]/80 border-slate-800/80 text-slate-200 hover:border-cyan-400/60 hover:bg-[#121435] hover:shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                    : 'bg-[#080914]/40 border-transparent text-slate-600 hover:text-slate-400 hover:border-slate-800'
                }`}
              >
                {/* 오늘 표시 텍스트 */}
                {cell.isToday && !cell.isSelected && (
                  <span className="absolute top-1 right-1 text-[8px] font-cyber text-cyan-300 leading-none">
                    NOW
                  </span>
                )}

                {/* 날짜 숫자 */}
                <span
                  className={`text-xs sm:text-sm font-tech font-bold leading-none ${
                    cell.isSelected
                      ? 'text-white'
                      : cell.isToday
                      ? 'text-cyan-300 font-extrabold'
                      : cell.isCurrentMonth
                      ? 'text-slate-200'
                      : 'text-slate-600'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {/* 할 일 인디케이터 도트 / 카운트 뱃지 */}
                {cell.taskCount > 0 && (
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {cell.hasActiveTask && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff] animate-pulse" />
                    )}
                    {cell.hasCompletedTask && (
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_#ff007f]" />
                    )}
                    {cell.taskCount > 2 && (
                      <span className="text-[8px] font-cyber text-fuchsia-300 ml-0.5 leading-none">
                        +{cell.taskCount}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* 5. 하단 프리뷰 및 퀵 선택 툴바 */}
        <div className="pt-3 border-t border-purple-500/20 flex flex-col gap-2.5 text-xs font-tech">
          {/* 선택/호버된 날짜 안내 */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">선택 날짜:</span>
              <strong className="text-cyan-300 font-bold">
                {formatDateToKorean(activeDateForPreview)}
              </strong>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-cyber border ${
                dDayData.isToday
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                  : dDayData.isPast
                  ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                  : 'bg-purple-500/20 text-purple-300 border-purple-400/50'
              }`}
            >
              {dDayData.text}
            </span>
          </div>

          {/* 퀵 점프 버튼들 */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleDateClick(getOffsetDate(0))}
              className="py-1.5 px-2 rounded-lg bg-[#0e1127] border border-cyan-500/30 text-cyan-300 text-[11px] font-cyber hover:bg-cyan-500/20 hover:border-cyan-400 transition-all cursor-pointer text-center"
            >
              오늘 (TODAY)
            </button>
            <button
              type="button"
              onClick={() => handleDateClick(getOffsetDate(1))}
              className="py-1.5 px-2 rounded-lg bg-[#0e1127] border border-purple-500/30 text-purple-300 text-[11px] font-cyber hover:bg-purple-500/20 hover:border-purple-400 transition-all cursor-pointer text-center"
            >
              내일 (+1D)
            </button>
            <button
              type="button"
              onClick={() => handleDateClick(getOffsetDate(2))}
              className="py-1.5 px-2 rounded-lg bg-[#0e1127] border border-fuchsia-500/30 text-fuchsia-300 text-[11px] font-cyber hover:bg-fuchsia-500/20 hover:border-fuchsia-400 transition-all cursor-pointer text-center"
            >
              모레 (+2D)
            </button>
            <button
              type="button"
              onClick={() => handleDateClick(getOffsetDate(7))}
              className="py-1.5 px-2 rounded-lg bg-[#0e1127] border border-pink-500/30 text-pink-300 text-[11px] font-cyber hover:bg-pink-500/20 hover:border-pink-400 transition-all cursor-pointer text-center"
            >
              다음 주 (+7D)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
