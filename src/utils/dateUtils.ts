/**
 * 날짜 계산 및 서식 변환 유틸리티 함수 모음
 * 
 * 시니어 개발자의 팁:
 * 날짜 처리는 화면에 표시하는 로직과 데이터 계산 로직을 분리해 두면
 * 버그가 발생하지 않고 코드를 훨씬 깔끔하게 유지할 수 있습니다.
 */

/**
 * Date 객체를 "YYYY-MM-DD" 문자열로 변환합니다.
 * @param date 변환할 Date 객체 (기본값: 오늘)
 */
export const formatDateToISO = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * "YYYY-MM-DD" 문자열을 사용자가 읽기 좋은 한국어 형태("2026년 09월 17일 (목)")로 포맷합니다.
 */
export const formatDateToKorean = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  return targetDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

/**
 * 특정 날짜에서 하루 전 날짜를 "YYYY-MM-DD"로 구합니다.
 */
export const getPrevDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return formatDateToISO(date);
};

/**
 * 특정 날짜에서 다음 날 날짜를 "YYYY-MM-DD"로 구합니다.
 */
export const getNextDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + 1);
  return formatDateToISO(date);
};

/**
 * 오늘 날짜를 기준으로 D-Day(디데이)를 계산합니다.
 * 예: 오늘 -> "D-DAY", 내일 -> "D-1", 어제 -> "D+1"
 */
export const calculateDDay = (targetDateStr: string): { text: string; isPast: boolean; isToday: boolean } => {
  const todayStr = formatDateToISO(new Date());
  
  if (targetDateStr === todayStr) {
    return { text: 'TODAY (D-DAY)', isPast: false, isToday: true };
  }

  const [tYear, tMonth, tDay] = targetDateStr.split('-').map(Number);
  const [cYear, cMonth, cDay] = todayStr.split('-').map(Number);

  const target = new Date(tYear, tMonth - 1, tDay).getTime();
  const current = new Date(cYear, cMonth - 1, cDay).getTime();

  const diffDays = Math.round((target - current) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return { text: `D-${diffDays}`, isPast: false, isToday: false };
  } else {
    return { text: `D+${Math.abs(diffDays)}`, isPast: true, isToday: false };
  }
};
