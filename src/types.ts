export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export type TrackId = 'astronomy' | 'aerospace' | 'astrophotography';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'apple' | 'linkedin' | 'email';
  level: UserLevel;
  streaks: number;
  lastActiveDate: string; // ISO date string (YYYY-MM-DD)
  coins: number;
  xp: number;
  completedLessons: string[];
  currentCheckpointId: string;
  unlockedGifts: string[];
  savedPosts: string[];
  savedPhotos: string[];
  dailyLessonsCompleted?: number;
  dailyLessonsGoal?: number;
  dailyMinutesGoal?: number;
  preferredTrack?: TrackId | 'all';
  discoverySource?: string;
  roleBackground?: string;
}

export interface ResearchPaper {
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi: string;
  summary: string;
  keyEquation?: string;
  citation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonSlide {
  title: string;
  content: string;
  bulletPoints?: string[];
  formula?: string;
  formulaExplainer?: string;
  diagramType?: 'exposure-triangle' | 'orbit-transfer' | 'stellar-spectrum' | 'none';
  tip?: string;
}

export interface Lesson {
  id: string;
  trackId: TrackId;
  trackName: string;
  title: string;
  subtitle: string;
  level: UserLevel;
  estimatedMinutes: number;
  xpReward: number;
  coinsReward: number;
  checkpointId: string;
  slides: LessonSlide[];
  quiz: QuizQuestion[];
  researchPapers?: ResearchPaper[]; // For advanced level
}

export interface Checkpoint {
  id: string;
  name: string;
  type: 'planet' | 'moon' | 'station' | 'star' | 'deep-space';
  description: string;
  distanceKm: string;
  icon: string;
  color: string;
  order: number;
  xPercent: number; // For trajectory mapping (0 - 100)
  yPercent: number; // For trajectory mapping (0 - 100)
  requiredLessons: string[];
}

export interface RewardGift {
  id: string;
  name: string;
  category: 'badge' | 'equipment' | 'booster' | 'trophy';
  description: string;
  costCoins: number;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AstrophotographyPhoto {
  id: string;
  title: string;
  photographerName: string;
  photographerAvatar: string;
  photographerLevel: UserLevel;
  imageUrl: string;
  category: 'nebulae' | 'galaxies' | 'planets' | 'milkyway' | 'lunar' | 'solar';
  description: string;
  likes: number;
  isLiked?: boolean;
  date: string;
  exif: {
    telescopeOrLens: string;
    camera: string;
    mountOrTracker: string;
    exposureTotal: string;
    singleExposure: string;
    isoOrGain: string;
    bortleScale: number;
    filters?: string;
    software: string;
    location: string;
  };
  comments: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    time: string;
  }[];
}

export interface CommunityPost {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: UserLevel;
  authorBadge?: string;
  trackTag: TrackId | 'gear' | 'general';
  content: string;
  tags: string[];
  upvotes: number;
  isUpvoted?: boolean;
  createdAt: string;
  isPinned?: boolean;
  commentsCount: number;
  commentsList: {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorLevel: UserLevel;
    text: string;
    createdAt: string;
  }[];
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardCoins: number;
  completed: boolean;
}

export interface WeeklyTest {
  id: string;
  title: string;
  weekNumber: number;
  description: string;
  questionsCount: number;
  timeLimitMinutes: number;
  status: 'available' | 'completed' | 'locked';
  score?: number;
  badgeAwarded?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  level: UserLevel;
  xp: number;
  streak: number;
  title: string;
  isCurrentUser?: boolean;
}

