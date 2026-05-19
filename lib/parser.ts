import { Message } from "@/types";

// 카카오톡 내보내기 형식 두 가지를 모두 지원
// 형식 1 (단체방): "2024년 1월 1일 월요일\n오전 10:30, 홍길동 : 안녕"
// 형식 2 (1:1): "[홍길동] [오전 10:30] 안녕"

const DATE_HEADER_RE = /^(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일\s+\S+요일/;
const MSG_FORMAT1_RE = /^(오전|오후)\s+(\d{1,2}):(\d{2}),\s+(.+?)\s+:\s+([\s\S]*)/;
const MSG_FORMAT2_RE = /^\[(.+?)\]\s+\[(오전|오후)\s+(\d{1,2}):(\d{2})\]\s+([\s\S]*)/;

const MEDIA_KEYWORDS = ["사진", "동영상", "파일", "연락처", "지도", "음성메시지", "스티커", "이모티콘"];
const DELETED_KEYWORDS = ["삭제된 메시지입니다", "메시지를 삭제했습니다"];

function parseTime(ampm: string, hour: string, minute: string): { h: number; m: number } {
  let h = parseInt(hour);
  const m = parseInt(minute);
  if (ampm === "오후" && h !== 12) h += 12;
  if (ampm === "오전" && h === 12) h = 0;
  return { h, m };
}

export function parseKakaoTxt(text: string): Message[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const messages: Message[] = [];

  let currentDate = new Date();
  let format: 1 | 2 | null = null;

  for (const line of lines) {
    // 날짜 헤더 (형식 1)
    const dateMatch = line.match(DATE_HEADER_RE);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      continue;
    }

    // 메시지 형식 1 감지
    const m1 = line.match(MSG_FORMAT1_RE);
    if (m1) {
      format = 1;
      const [, ampm, hour, minute, sender, content] = m1;
      const { h, m } = parseTime(ampm, hour, minute);
      const date = new Date(currentDate);
      date.setHours(h, m, 0, 0);

      const isMedia = MEDIA_KEYWORDS.some((kw) => content.includes(kw));
      const isDeleted = DELETED_KEYWORDS.some((kw) => content.includes(kw));

      messages.push({ date, sender, content, isMedia, isDeleted });
      continue;
    }

    // 메시지 형식 2 감지
    const m2 = line.match(MSG_FORMAT2_RE);
    if (m2) {
      format = 2;
      const [, sender, ampm, hour, minute, content] = m2;
      const { h, m } = parseTime(ampm, hour, minute);

      // 형식 2는 날짜 헤더가 없으니 날짜를 메시지 순서로 추정
      // "YYYY. M. D. 오전/오후 HH:MM" 패턴이 있으면 날짜 갱신
      const dateLine = line.match(/^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./);
      if (dateLine) {
        currentDate = new Date(parseInt(dateLine[1]), parseInt(dateLine[2]) - 1, parseInt(dateLine[3]));
        continue;
      }

      const date = new Date(currentDate);
      date.setHours(h, m, 0, 0);

      const isMedia = MEDIA_KEYWORDS.some((kw) => content.includes(kw));
      const isDeleted = DELETED_KEYWORDS.some((kw) => content.includes(kw));

      messages.push({ date, sender, content, isMedia, isDeleted });
    }
  }

  return messages;
}
