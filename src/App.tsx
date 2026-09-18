/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Todo, FilterType, DateViewMode } from './types';
import { TodoHeader } from './components/TodoHeader';
import { DateNavigator } from './components/DateNavigator';
import { TodoInput } from './components/TodoInput';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { formatDateToISO, getNextDate } from './utils/dateUtils';
import { db } from './firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { CloudCheck, Activity, Database, Loader2 } from 'lucide-react';

/**
 * App 컴포넌트 (Cyberpunk Neon Edition with Firebase Firestore)
 * 
 * 시니어 프론트엔드 개발자의 친절한 가이드:
 * 
 * 1. Firebase Firestore 연동 구조:
 *    - 컬렉션명: 'todos'
 *    - 각 문서(Document) 구조: { text, completed, createdAt, dueDate, createdAtTimestamp }
 *    - `onSnapshot`: 데이터베이스의 실시간 변경 사항을 실시간으로 감지(Listen)하여,
 *      데이터가 추가/수정/삭제될 때마다 자동으로 컴포넌트의 `todos` 상태를 최신으로 동기화합니다.
 *    - 따라서 새로고침하거나 브라우저를 닫았다가 다시 열어도 데이터가 영구적으로 보존됩니다.
 * 
 * 2. 기존 UI/UX 및 테마 완벽 보존:
 *    - 기존의 사이버펑크 네온 비주얼, 날짜별 탐색(Chrono Navigator), 필터링, 완료 상태 토글 등
 *      모든 기능과 디자인을 온전히 유지하면서 데이터 계층(Data Layer)만 클라우드 DB로 업그레이드했습니다.
 */
export default function App() {
  const todayStr = formatDateToISO(new Date());
  const tomorrowStr = getNextDate(todayStr);
  const dayAfterTomorrowStr = getNextDate(tomorrowStr);

  // 1. 할 일 목록 배열 상태 (Firestore에서 실시간으로 채워짐)
  const [todos, setTodos] = useState<Todo[]>([]);

  // 2. 데이터베이스 초기 연결 로딩 상태
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. 현재 선택된 기준 날짜 상태 (기본값: 오늘 YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // 4. 날짜 조회 모드 ('selected': 선택한 날짜만 보기 | 'all': 모든 날짜 모아보기)
  const [dateViewMode, setDateViewMode] = useState<DateViewMode>('selected');

  // 5. 완료 상태 필터 ('all' | 'active' | 'completed')
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  /**
   * [Firestore 연동 1] 앱 시작 시 데이터 실시간 구독(Listen) 및 초기 데이터 동기화
   */
  useEffect(() => {
    // 'todos' 컬렉션을 시간순(createdAtTimestamp 내림차순)으로 정렬하는 쿼리 생성
    const todosCollection = collection(db, 'todos');
    const todosQuery = query(todosCollection, orderBy('createdAtTimestamp', 'desc'));

    // Firestore에 기존 데이터가 없을 경우를 대비한 초기 샘플 데이터 시딩(Seeding) 함수
    const checkAndSeedInitialData = async () => {
      try {
        const snapshot = await getDocs(todosCollection);
        if (snapshot.empty) {
          // 데이터베이스가 처음 만들어져서 비어있다면 체험용 네온 샘플 데이터 4개 등록
          const initialSamples = [
            {
              text: '사이버펑크 네온 UI 테마 시스템 점검하기',
              completed: true,
              createdAt: '09:30',
              dueDate: todayStr,
              createdAtTimestamp: Date.now() - 3000,
            },
            {
              text: 'Firebase Firestore 클라우드 데이터베이스 연동 완료',
              completed: true,
              createdAt: '10:15',
              dueDate: todayStr,
              createdAtTimestamp: Date.now() - 2000,
            },
            {
              text: '네오 서울 데이터 센터 방문 및 보안 키 갱신',
              completed: false,
              createdAt: '14:00',
              dueDate: tomorrowStr,
              createdAtTimestamp: Date.now() - 1000,
            },
            {
              text: '궤도 엘리베이터 정기 점검 프로토콜 실행',
              completed: false,
              createdAt: '16:30',
              dueDate: dayAfterTomorrowStr,
              createdAtTimestamp: Date.now(),
            },
          ];

          for (const item of initialSamples) {
            await addDoc(todosCollection, item);
          }
        }
      } catch (err) {
        console.warn('초기 샘플 데이터 확인 중 안내:', err);
      }
    };

    checkAndSeedInitialData();

    // onSnapshot: Firestore의 실시간 리스너를 등록합니다.
    // 서버에서 데이터가 바뀌면 이 콜백이 자동으로 실행되어 화면이 즉시 업데이트됩니다.
    const unsubscribe = onSnapshot(
      todosQuery,
      (querySnapshot) => {
        const fetchedTodos: Todo[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedTodos.push({
            id: docSnap.id,
            text: data.text || '',
            completed: Boolean(data.completed),
            createdAt: data.createdAt || '',
            dueDate: data.dueDate || todayStr,
            createdAtTimestamp: data.createdAtTimestamp || 0,
          });
        });

        setTodos(fetchedTodos);
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore 데이터 수신 오류:', error);
        setIsLoading(false);
      }
    );

    // 컴포넌트가 언마운트될 때 구독(Listener)을 안전하게 해제합니다 (메모리 누수 방지)
    return () => unsubscribe();
  }, [todayStr, tomorrowStr, dayAfterTomorrowStr]);

  /**
   * [Firestore 연동 2] 새 할 일을 Firestore에 추가
   */
  const handleAddTodo = async (text: string, targetDate: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    try {
      // Firestore의 'todos' 컬렉션에 새 문서를 삽입합니다.
      await addDoc(collection(db, 'todos'), {
        text: text,
        completed: false,
        createdAt: timeString,
        dueDate: targetDate,
        createdAtTimestamp: Date.now(),
      });
      // 성공 시 onSnapshot 리스너가 자동으로 감지하여 `todos` state를 갱신합니다.
    } catch (error) {
      console.error('할 일 추가 중 Firestore 오류 발생:', error);
    }
  };

  /**
   * [Firestore 연동 3] 할 일 완료 여부를 Firestore에서 업데이트
   */
  const handleToggleComplete = async (id: string) => {
    const targetTodo = todos.find((t) => t.id === id);
    if (!targetTodo) return;

    try {
      // 해당 문서의 ID를 찾아 'completed' 필드 값을 반전시켜 업데이트합니다.
      const todoDocRef = doc(db, 'todos', id);
      await updateDoc(todoDocRef, {
        completed: !targetTodo.completed,
      });
    } catch (error) {
      console.error('완료 상태 변경 중 Firestore 오류 발생:', error);
    }
  };

  /**
   * [Firestore 연동 4] 할 일을 Firestore에서 영구 삭제
   */
  const handleDeleteTodo = async (id: string) => {
    try {
      // 해당 문서의 ID를 찾아 데이터베이스에서 삭제합니다.
      const todoDocRef = doc(db, 'todos', id);
      await deleteDoc(todoDocRef);
    } catch (error) {
      console.error('할 일 삭제 중 Firestore 오류 발생:', error);
    }
  };

  /**
   * 날짜 모드 토글 함수 ('selected' <-> 'all')
   */
  const handleViewModeToggle = () => {
    setDateViewMode((prev) => (prev === 'selected' ? 'all' : 'selected'));
  };

  // 선택된 날짜에 등록된 총 할 일 개수
  const taskCountForSelectedDate = todos.filter((todo) => todo.dueDate === selectedDate).length;

  // 1차 날짜 필터링
  const dateFilteredTodos = todos.filter((todo) => {
    if (dateViewMode === 'selected') {
      return todo.dueDate === selectedDate;
    }
    return true; // 'all' 모드인 경우 전체 날짜 포함
  });

  // 2차 상태 필터링 ('all' | 'active' | 'completed')
  const finalFilteredTodos = dateFilteredTodos.filter((todo) => {
    if (currentFilter === 'active') {
      return !todo.completed;
    }
    if (currentFilter === 'completed') {
      return todo.completed;
    }
    return true;
  });

  // 현재 화면에 표시되는 대상 기준 통계 계산
  const totalCount = dateFilteredTodos.length;
  const completedCount = dateFilteredTodos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <main className="min-h-screen bg-[#070711] text-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden cyber-grid-bg">
      {/* 배경 장식용 앰비언트 네온 블러 글로우 */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* 중앙 메인 HUD 패널 */}
      <div className="max-w-xl mx-auto relative z-10">
        <div className="relative bg-[#090a19]/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-5 sm:p-8 neon-box-cyber shadow-2xl">
          
          {/* 패널 네 모서리 HUD 코너 장식 */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm pointer-events-none shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-pink-500 rounded-tr-sm pointer-events-none shadow-[0_0_8px_rgba(255,0,127,0.8)]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-500 rounded-bl-sm pointer-events-none shadow-[0_0_8px_rgba(176,38,255,0.8)]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-sm pointer-events-none shadow-[0_0_8px_rgba(0,240,255,0.8)]" />

          {/* 1. 상단 전광판 헤더 */}
          <TodoHeader
            totalCount={totalCount}
            completedCount={completedCount}
          />

          {/* 2. 날짜 탐색 및 설정 컨트롤러 (Chrono Navigator) */}
          <DateNavigator
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            dateViewMode={dateViewMode}
            onViewModeToggle={handleViewModeToggle}
            taskCountForSelectedDate={taskCountForSelectedDate}
            todos={todos}
          />

          {/* 3. 할 일 입력 폼 (목표 날짜 지정 가능) */}
          <TodoInput
            selectedDate={selectedDate}
            onAddTodo={handleAddTodo}
            todos={todos}
          />

          {/* 4. 상태 필터 탭 (전체 / 진행 중 / 완료) */}
          <TodoFilter
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            totalCount={totalCount}
            activeCount={activeCount}
            completedCount={completedCount}
          />

          {/* 5. 로딩 인디케이터 또는 할 일 목록 리스트 */}
          {isLoading ? (
            <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-cyan-500/20 bg-[#080918]/60 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs font-cyber tracking-widest text-cyan-300 neon-text-blue">
                CONNECTING TO FIRESTORE CLOUD DB...
              </p>
            </div>
          ) : (
            <TodoList
              todos={finalFilteredTodos}
              currentFilter={currentFilter}
              selectedDate={selectedDate}
              dateViewMode={dateViewMode}
              onToggleComplete={handleToggleComplete}
              onDeleteTodo={handleDeleteTodo}
            />
          )}

          {/* 하단 시스템 정보 푸터 (클라우드 DB 동기화 안내) */}
          <footer className="mt-8 pt-4 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-cyber tracking-wider text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <CloudCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>FIRESTORE CLOUD DB // REALTIME SYNCED</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-fuchsia-400" />
              <span className="text-slate-400">
                저장된 총 문서: <strong className="text-fuchsia-400">{todos.length}개</strong>
              </span>
              <Activity className="w-3.5 h-3.5 text-pink-400 animate-pulse ml-1" />
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
