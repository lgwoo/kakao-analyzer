import { Message } from "@/types";

// 카카오톡 내보내기 형식 두 가지를 모두 지원
// 형식 1 (단체방): "2024년 1월 1일 월요일\n오전 10:30, 홍길동 : 안녕"
// 형식 2 (그룹/1:1): "[홍길동] [오전 10:30] 안녕"
// 날짜 헤더: "2021년 12월 10일 금요일" 또는 "--- 2021년 12월 10일 금요일 ---"

const DATE_HEADER_RE = /(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일\s+\S+요일/;
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

  for (const line of lines) {
    // 날짜 헤더: ^ 없이 매칭해 "--- 2021년 12월 10일 금요일 ---" 형식도 처리
    const dateMatch = line.match(DATE_HEADER_RE);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      continue;
    }

    // 메시지 형식 1
    const m1 = line.match(MSG_FORMAT1_RE);
    if (m1) {
      const [, ampm, hour, minute, sender, content] = m1;
      const { h, m } = parseTime(ampm, hour, minute);
      const date = new Date(currentDate);
      date.setHours(h, m, 0, 0);
      const isMedia = MEDIA_KEYWORDS.some((kw) => content.includes(kw));
      const isDeleted = DELETED_KEYWORDS.some((kw) => content.includes(kw));
      messages.push({ date, sender, content, isMedia, isDeleted });
      continue;
    }

    // 메시지 형식 2
    const m2 = line.match(MSG_FORMAT2_RE);
    if (m2) {
      const [, sender, ampm, hour, minute, content] = m2;
      const { h, m } = parseTime(ampm, hour, minute);
      const date = new Date(currentDate);
      date.setHours(h, m, 0, 0);
      const isMedia = MEDIA_KEYWORDS.some((kw) => content.includes(kw));
      const isDeleted = DELETED_KEYWORDS.some((kw) => content.includes(kw));
      messages.push({ date, sender, content, isMedia, isDeleted });
      continue;
    }

    // 어느 패턴에도 안 맞으면 직전 메시지의 연속 줄 (멀티라인 메시지)
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      last.content += "\n" + line;
    }
  }

  return messages;
}
