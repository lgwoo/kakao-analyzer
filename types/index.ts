export interface Message {
  date: Date;
  sender: string;
  content: string;
  isMedia: boolean;
  isDeleted: boolean;
}

export interface ParticipantStats {
  name: string;
  messageCount: number;
  charCount: number;
  mediaCount: number;
  avgResponseTime: number | null; // minutes
}

export interface HourlyActivity {
  hour: number;
  count: number;
}

export interface DailyActivity {
  day: string; // 월~일
  count: number;
}

export interface MonthlyActivity {
  month: string; // "2024-01"
  count: number;
}

export interface WordFrequency {
  text: string;
  value: number;
}

export interface EmojiFrequency {
  emoji: string;
  count: number;
}

export interface AnalysisResult {
  participants: ParticipantStats[];
  totalMessages: number;
  totalDays: number;
  startDate: Date;
  endDate: Date;
  hourlyActivity: HourlyActivity[];
  dailyActivity: DailyActivity[];
  monthlyActivity: MonthlyActivity[];
  wordFrequency: WordFrequency[];
  emojiFrequency: EmojiFrequency[];
  mostActiveHour: number;
  mostActiveDay: string;
  longestStreak: number; // 연속 대화 일수
}
