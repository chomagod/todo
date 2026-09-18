import React from 'react';
import { Todo, FilterType, DateViewMode } from '../types';
import { TodoItem } from './TodoItem';
import { Radio, CheckCircle2, Flame, CalendarX } from 'lucide-react';
import { formatDateToKorean } from '../utils/dateUtils';

interface TodoListProps {
  todos: Todo[];
  currentFilter: FilterType;
  selectedDate: string;
  dateViewMode: DateViewMode;
  onToggleComplete: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

/**
 * TodoList 컴포넌트 (Cyberpunk Neon Edition)
 * 
 * 시니어 개발자의 한마디:
 * 선택된 날짜 및 필터 상태에 따라 할 일 목록을 렌더링합니다.
 * 목록이 비어있을 때는 날짜 모드('선택 날짜' vs '전체 날짜')에 맞는
 * 상황별 안내 메시지를 직관적으로 제공합니다.
 */
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  currentFilter,
  selectedDate,
  dateViewMode,
  onToggleComplete,
  onDeleteTodo,
}) => {
  if (todos.length === 0) {
    return (
      <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-cyan-500/20 bg-[#080918]/60 relative overflow-hidden">
        {/* 장식용 네온 원형 앰비언트 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 neon-box-blue relative">
          {currentFilter === 'completed' && <CheckCircle2 className="w-7 h-7 text-pink-400" />}
          {currentFilter === 'active' && <Flame className="w-7 h-7 text-cyan-400" />}
          {currentFilter === 'all' && (
            dateViewMode === 'selected' ? (
              <CalendarX className="w-7 h-7 text-cyan-400" />
            ) : (
              <Radio className="w-7 h-7 text-fuchsia-400 animate-pulse" />
            )
          )}
        </div>

        <h3 className="text-base sm:text-lg font-cyber tracking-wider text-slate-200 mb-1.5 neon-text-blue">
          {currentFilter === 'completed' && '[NO_DONE_TASKS] 완료된 작업 없음'}
          {currentFilter === 'active' && '[ALL_CLEAR] 모든 작업 완료됨'}
          {currentFilter === 'all' && (
            dateViewMode === 'selected'
              ? `[NO_SCHEDULE] ${selectedDate} 일정 없음`
              : '[NO_DATA] 등록된 할 일이 없습니다'
          )}
        </h3>
        <p className="text-xs sm:text-sm font-tech tracking-wide text-slate-400 max-w-sm mx-auto">
          {dateViewMode === 'selected' && currentFilter === 'all'
            ? `${formatDateToKorean(selectedDate)}에 예정된 일정이 없습니다. 상단 입력창에서 이 날짜의 새로운 임무를 등록해보세요.`
            : currentFilter === 'all'
            ? '상단 터미널 입력창에 새로운 임무를 등록하여 네온 시스템을 가동하십시오.'
            : '필터 모드를 전환하거나 새 작업을 입력하십시오.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleComplete={onToggleComplete}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
};
