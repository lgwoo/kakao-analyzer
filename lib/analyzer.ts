import { Message, AnalysisResult, ParticipantStats, WordFrequency, EmojiFrequency } from "@/types";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 한국어 불용어 (분석에서 제외할 단어)
const STOPWORDS = new Set([
  "이", "가", "을", "를", "은", "는", "의", "에", "에서", "로", "으로", "와", "과",
  "이야", "야", "아", "어", "도", "만", "이다", "다", "고", "하고", "라고", "라",
  "그", "그게", "그게", "저", "나", "너", "우리", "ㅋ", "ㅋㅋ", "ㅋㅋㅋ", "ㅎ", "ㅎㅎ",
  "ㅠ", "ㅜ", "ㅇㅇ", "ㅇㅋ", "ㄱㄱ", "ㄴ", "ㄹㄹ", "ㅏ", "ㅓ", "오", "아",
  "그리고", "그래서", "근데", "그런데", "하지만", "그냥", "진짜", "정말", "너무",
  "좀", "잠깐", "지금", "뭐", "왜", "어떻게", "어디", "언제", "누구", "것", "거",
  "수", "때", "말", "한", "더", "내", "네", "이거", "저거", "그거", "사진", "동영상",
  "파일", "이모티콘", "삭제된", "메시지", "보냄", "읽음",
]);

// 이모지 감지 정규식
const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

export function analyze(messages: Message[]): AnalysisResult {
  if (messages.length === 0) {
    throw new Error("메시지가 없습니다.");
  }

  const sorted = [...messages].sort((a, b) => a.date.getTime() - b.date.getTime());
  const startDate = sorted[0].date;
  const endDate = sorted[sorted.length - 1].date;
  const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000));

  // 참여자별 통계
  const senderMap = new Map<string, { msgs: Message[]; chars: number; media: number }>();
  for (const msg of sorted) {
    if (!senderMap.has(msg.sender)) {
      senderMap.set(msg.sender, { msgs: [], chars: 0, media: 0 });
    }
    const s = senderMap.get(msg.sender)!;
    s.msgs.push(msg);
    if (!msg.isMedia && !msg.isDeleted) s.chars += msg.content.length;
    if (msg.isMedia) s.media++;
  }

  const participants: ParticipantStats[] = [];
  for (const [name, data] of senderMap) {
    participants.push({
      name,
      messageCount: data.msgs.length,
      charCount: data.chars,
      mediaCount: data.media,
      avgResponseTime: calcAvgResponseTime(sorted, name),
    });
  }
  participants.sort((a, b) => b.messageCount - a.messageCount);

  // 시간대별 활동
  const hourCounts = new Array(24).fill(0);
  for (const msg of sorted) hourCounts[msg.date.getHours()]++;
  const hourlyActivity = hourCounts.map((count, hour) => ({ hour, count }));

  // 요일별 활동
  const dayCounts = new Array(7).fill(0);
  for (const msg of sorted) dayCounts[msg.date.getDay()]++;
  const dailyActivity = DAYS.map((day, i) => ({ day, count: dayCounts[i] }));

  // 월별 활동
  const monthMap = new Map<string, number>();
  for (const msg of sorted) {
    const key = `${msg.date.getFullYear()}-${String(msg.date.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  }
  const monthlyActivity = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  // 단어 빈도
  const wordFrequency = calcWordFrequency(sorted);

  // 이모지 빈도
  const emojiFrequency = calcEmojiFrequency(sorted);

  // 가장 활발한 시간/요일
  const mostActiveHour = hourCounts.indexOf(Math.max(...hourCounts));
  const mostActiveDay = DAYS[dayCounts.indexOf(Math.max(...dayCounts))];

  // 연속 대화 최장 기록
  const longestStreak = calcLongestStreak(sorted);

  return {
    participants,
    totalMessages: sorted.length,
    totalDays,
    startDate,
    endDate,
    hourlyActivity,
    dailyActivity,
    monthlyActivity,
    wordFrequency,
    emojiFrequency,
    mostActiveHour,
    mostActiveDay,
    longestStreak,
  };
}

function calcAvgResponseTime(messages: Message[], targetSender: string): number | null {
  const times: number[] = [];
  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const curr = messages[i];
    if (curr.sender === targetSender && prev.sender !== targetSender) {
      const diff = (curr.date.getTime() - prev.date.getTime()) / 60000; // minutes
      if (diff < 1440) times.push(diff); // 하루 이상 차이는 제외
    }
  }
  if (times.length === 0) return null;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

function calcWordFrequency(messages: Message[]): WordFrequency[] {
  const freq = new Map<string, number>();
  for (const msg of messages) {
    if (msg.isMedia || msg.isDeleted) continue;
    const words = msg.content.split(/[\s,!?\.。、]+/).filter((w) => {
      const cleaned = w.replace(/[^\wㄱ-ㅎ가-힣]/g, "");
      return cleaned.length >= 2 && !STOPWORDS.has(cleaned) && !/^\d+$/.test(cleaned);
    });
    for (const word of words) {
      const cleaned = word.replace(/[^\wㄱ-ㅎ가-힣]/g, "");
      if (cleaned.length >= 2) freq.set(cleaned, (freq.get(cleaned) ?? 0) + 1);
    }
  }
  return Array.from(freq.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 80)
    .map(([text, value]) => ({ text, value }));
}

function calcEmojiFrequency(messages: Message[]): EmojiFrequency[] {
  const freq = new Map<string, number>();
  for (const msg of messages) {
    if (msg.isDeleted) continue;
    const emojis = msg.content.match(EMOJI_RE) ?? [];
    for (const emoji of emojis) {
      freq.set(emoji, (freq.get(emoji) ?? 0) + 1);
    }
  }
  return Array.from(freq.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([emoji, count]) => ({ emoji, count }));
}

function calcLongestStreak(messages: Message[]): number {
  if (messages.length === 0) return 0;
  const days = new Set(
    messages.map((m) => {
      const d = m.date;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })
  );
  const sorted = Array.from(days).sort(); // YYYY-MM-DD 형식은 문자열 정렬 = 날짜 정렬

  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}
