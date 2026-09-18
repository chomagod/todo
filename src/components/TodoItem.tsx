import React from 'react';
import { Check, Trash2, Hash, Calendar } from 'lucide-react';
import { Todo } from '../types';
import { calculateDDay } from '../utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

/**
 * TodoItem 컴포넌트 (Cyberpunk Neon Edition with Due Date & D-Day)
 * 
 * 시니어 개발자의 한마디:
 * 개별 할 일 목록 카드에 해당 일정의 목표 날짜와 D-Day(디데이) 카운트다운 배지를 표시합니다.
 * - 오늘 할 일: `TODAY (D-DAY)` 네온 시안 배지
 * - 미래 일정: `D-1`, `D-2` 등 보라색 네온 배지
 * - 지난 일정: `D+1` 분홍색 경고 배지
 * - 완료 시 네온 핑크 취소선이 시각적으로 처리됩니다.
 */
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onDeleteTodo,
}) => {
  const dDayInfo = calculateDDay(todo.dueDate);

  return (
    <li
      className={`group relative flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all duration-300 ${
        todo.completed
          ? 'bg-[#080916]/70 border-slate-800/80 text-slate-500'
          : 'bg-[#0d0e22]/90 border-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_18px_rgba(0,240,255,0.25)] text-slate-100'
      }`}
    >
      {/* 카드 좌측 사이버 데코 인디케이터 바 */}
      <div
        className={`absolute left-0 top-2 bottom-2 w-1 rounded-r transition-all duration-300 ${
          todo.completed
            ? 'bg-slate-700/50'
            : 'bg-gradient-to-b from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(0,240,255,0.8)]'
        }`}
      />

      {/* 왼쪽: 네온 체크박스 + 할 일 텍스트 */}
      <div
        className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0 cursor-pointer select-none pl-1"
        onClick={() => onToggleComplete(todo.id)}
      >
        {/* 커스텀 네온 체크박스 */}
        <button
          type="button"
          aria-label={todo.completed ? '미완료로 변경' : '완료로 변경'}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 sm:mt-0 ${
            todo.completed
              ? 'bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-[0_0_12px_rgba(255,0,127,0.7)]'
              : 'border-cyan-500/40 bg-[#090a18] hover:border-cyan-300 hover:shadow-[0_0_8px_rgba(0,240,255,0.5)]'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(todo.id);
          }}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* 할 일 텍스트 내용 및 날짜/메타 정보 */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {/* D-Day 네온 배지 */}
            <span
              className={`text-[10px] font-cyber px-1.5 py-0.5 rounded border ${
                todo.completed
                  ? 'bg-slate-800 text-slate-500 border-slate-700'
                  : dDayInfo.isToday
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_8px_rgba(0,240,255,0.3)]'
                  : dDayInfo.isPast
                  ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                  : 'bg-purple-500/20 text-purple-300 border-purple-400/50'
              }`}
            >
              {dDayInfo.text}
            </span>

            {/* 일정 날짜 (YYYY-MM-DD) */}
            <span className="flex items-center gap-1 text-[11px] font-cyber text-slate-400">
              <Calendar className="w-3 h-3 text-cyan-400/70" />
              {todo.dueDate}
            </span>
          </div>

          <span
            className={`text-sm sm:text-base break-words leading-relaxed font-tech tracking-wide transition-all duration-300 ${
              todo.completed
                ? 'line-through decoration-pink-500/80 decoration-2 text-slate-500'
                : 'text-slate-100 group-hover:text-cyan-200'
            }`}
          >
            {todo.text}
          </span>

          <div className="flex items-center gap-2 text-[11px] font-cyber text-slate-500 mt-1">
            <span className="flex items-center gap-0.5 text-purple-400/80">
              <Hash className="w-2.5 h-2.5" />
              {todo.id.toString().slice(-4)}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400/70">생성: {todo.createdAt}</span>
          </div>
        </div>
      </div>

      {/* 오른쪽: 삭제 버튼 (네온 핑크 파괴 효과) */}
      <button
        type="button"
        onClick={() => onDeleteTodo(todo.id)}
        aria-label="할 일 삭제"
        className="p-2 text-slate-500 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg border border-transparent hover:border-pink-500/40 hover:shadow-[0_0_12px_rgba(255,0,127,0.4)] transition-all duration-200 cursor-pointer shrink-0"
        title="삭제하기"
      >
        <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>
    </li>
  );
};
