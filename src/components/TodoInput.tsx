import React, { useState, useEffect } from 'react';
import { Plus, Terminal, AlertCircle, Calendar } from 'lucide-react';
import { formatDateToKorean } from '../utils/dateUtils';
import { CyberCalendarModal } from './CyberCalendarModal';
import { Todo } from '../types';

interface TodoInputProps {
  selectedDate: string;                                          // 현재 탐색 중인 기준 날짜
  onAddTodo: (text: string, targetDate: string) => void;         // 날짜와 함께 할 일을 등록하는 함수
  todos?: Todo[];                                                // 달력 모달에 표시할 할 일 목록
}

/**
 * TodoInput 컴포넌트 (Cyberpunk Neon Edition with Custom Calendar Modal)
 * 
 * 시니어 개발자의 한마디:
 * 브라우저 기본의 밋밋한 날짜 인풋 대신,
 * 날짜 배지를 클릭하면 아름다운 네온 사이버 달력 모달이 열리도록 개선했습니다.
 */
export const TodoInput: React.FC<TodoInputProps> = ({ selectedDate, onAddTodo, todos = [] }) => {
  const [inputText, setInputText] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(selectedDate);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  useEffect(() => {
    setTargetDate(selectedDate);
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = inputText.trim();

    if (!trimmedText) {
      setErrorMessage('[ALERT] 명령(할 일) 내용을 한 글자 이상 입력해야 합니다.');
      return;
    }

    onAddTodo(trimmedText, targetDate);
    setInputText('');
    setErrorMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-2">
        {/* 상단 입력 바 */}
        <div className="relative flex flex-col sm:flex-row gap-2.5">
          {/* 네온 터미널 입력 필드 */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
              <Terminal className="w-4 h-4 opacity-70 group-focus-within:opacity-100 group-focus-within:text-cyan-300 transition-all" />
            </div>

            <input
              type="text"
              value={inputText}
              onChange={handleChange}
              placeholder="할 일(TASK) 프로토콜을 입력하십시오..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#0c0d1e] text-cyan-100 placeholder-slate-500 text-sm sm:text-base outline-none transition-all duration-300 font-tech tracking-wide ${
                errorMessage
                  ? 'border border-pink-500 neon-box-pink focus:ring-2 focus:ring-pink-500/40'
                  : 'border border-cyan-500/30 hover:border-cyan-400/60 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.35)] focus:ring-1 focus:ring-cyan-400'
              }`}
            />

            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400 pointer-events-none rounded-tr-sm opacity-60" />
          </div>

          {/* 등록 날짜 지정 버튼 (클릭 시 커스텀 네온 달력 모달 오픈) */}
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-[#0e1026] border border-purple-500/40 text-purple-300 text-xs font-cyber tracking-wider hover:border-purple-300 hover:shadow-[0_0_12px_rgba(176,38,255,0.4)] transition-all cursor-pointer shrink-0"
            title="등록할 일정의 날짜 변경 (네온 달력 열기)"
          >
            <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>{targetDate}</span>
          </button>

          {/* 네온 전광판 스타일 추가 버튼 */}
          <button
            type="submit"
            className="relative group overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 text-white font-cyber text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.7)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 border border-fuchsia-400/50"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
            <span>EXECUTE</span>
          </button>
        </div>

        {/* 선택된 등록 일정 날짜 안내 */}
        <div className="flex items-center justify-between px-1 text-[11px] font-tech text-slate-400">
          <span>
            지정된 일정 일자: <strong className="text-cyan-300">{formatDateToKorean(targetDate)}</strong>
          </span>
          {targetDate !== selectedDate && (
            <button
              type="button"
              onClick={() => setTargetDate(selectedDate)}
              className="text-fuchsia-400 hover:underline cursor-pointer font-cyber text-[10px]"
            >
              [탐색 중인 날짜로 되돌리기]
            </button>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-pink-400 pl-1 font-tech tracking-wider animate-pulse">
          <AlertCircle className="w-3.5 h-3.5 text-pink-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 할 일 등록용 커스텀 사이버 달력 모달 */}
      <CyberCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={targetDate}
        onSelectDate={(newDate) => setTargetDate(newDate)}
        todos={todos}
        title="TASK SCHEDULER // 등록 목표 일자 지정"
      />
    </form>
  );
};
