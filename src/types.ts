/**
 * 할 일(Todo) 데이터 타입 정의 (Firebase Firestore 연동 지원)
 * 
 * 시니어 가이드:
 * Firestore 데이터베이스에서는 각 문서마다 고유한 문자열 ID(예: "d4F9xL...")를 자동 부여합니다.
 * 따라서 Todo의 `id` 필드를 문자열(string)로 정의합니다.
 */

// 개별 할 일 객체의 형태 정의
export interface Todo {
  id: string;                  // Firestore 문서의 고유 식별자 ID (Document ID)
  text: string;                // 할 일의 내용 (예: "장보기", "운동하기")
  completed: boolean;          // 완료 여부 (true: 완료, false: 진행 중)
  createdAt: string;           // 할 일을 추가한 생성 시간 문자열 (예: "09:30")
  dueDate: string;             // 일정이 지정된 목표 날짜 (형식: "YYYY-MM-DD")
  createdAtTimestamp?: number; // 정렬 및 시간 순서 보장을 위한 타임스탬프 (밀리초)
}

// 상태 필터 옵션 종류 (전체, 진행 중, 완료)
export type FilterType = 'all' | 'active' | 'completed';

// 날짜 조회 모드 (선택한 날짜만 보기 vs 모든 날짜 일정 한 번에 보기)
export type DateViewMode = 'selected' | 'all';
