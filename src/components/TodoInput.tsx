import React, { useState, useEffect } from 'react';
import { Plus, Terminal, AlertCircle, Calendar } from 'lucide-react';
import { formatDateToKorean } from '../utils/dateUtils';

interface TodoInputProps {
  selectedDate: string;                                          // 현재 탐색 중인 기준 날짜
  onAddTodo: (text: string, targetDate: string) => void;         // 날짜와 함께 할 일을 등록하는 함수
}

/**
 * TodoInput 컴포넌트 (Cyberpunk Neon Edition with Target Date)
 * 
 * 시니어 개발자의 한마디:
 * 할 일을 등록할 때 목표 날짜(dueDate)를 함께 지정할 수 있습니다.
 * 기본적으로 현재 화면에서 보고 있는 날짜(selectedDate)로 자동 세팅되며,
 * 필요하다면 날짜 선택 버튼을 눌러 다른 날짜(내일, 다음 주 등)로 변경하여 등록할 수도 있습니다.
 */
export const TodoInput: React.FC<TodoInputProps> = ({ selectedDate, onAddTodo }) => {
  const [inputText, setInputText] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(selectedDate);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 사용자가 상단 날짜 탐색기(DateNavigator)에서 다른 날짜를 선택하면, 입력 대상 날짜도 연동해줍니다.
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

    // 부모 컴포넌트에 할 일 내용과 지정된 날짜를 함께 전달
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

          {/* 등록 날짜 지정 버튼 & 날짜 피커 */}
          <div className="relative group shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-[#0e1026] border border-purple-500/40 text-purple-300 text-xs font-cyber tracking-wider hover:border-purple-400 transition-all">
              <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>{targetDate}</span>
            </div>
            {/* 보이지 않는 날짜 인풋을 덮어씌워 네이티브 달력 팝업 유도 */}
            <input
              type="date"
              value={targetDate}
              onChange={(e) => {
                if (e.target.value) setTargetDate(e.target.value);
              }}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
              title="등록할 일정의 날짜 변경"
            />
          </div>

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
    </form>
  );
};
