import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getRankTitle,
  calculateNewStreak,
  completeLessonProgress,
  purchaseReward,
  isCheckpointUnlocked,
} from './gameLogic';
import { UserProfile, Checkpoint, RewardGift } from '../types';

const mockCheckpoints: Checkpoint[] = [
  {
    id: 'earth-orbit',
    name: 'Earth Low Orbit',
    type: 'planet',
    description: 'Starting departure station',
    distanceKm: '400 km',
    icon: '🌍',
    color: '#3b82f6',
    order: 1,
    xPercent: 10,
    yPercent: 70,
    requiredLessons: [],
  },
  {
    id: 'lunar-gateway',
    name: 'Lunar Gateway',
    type: 'moon',
    description: 'Orbital outpost around the Moon',
    distanceKm: '384,400 km',
    icon: '🌕',
    color: '#94a3b8',
    order: 2,
    xPercent: 28,
    yPercent: 35,
    requiredLessons: ['astro-b1'],
  },
  {
    id: 'mars-transit',
    name: 'Mars Transit Checkpoint',
    type: 'planet',
    description: 'Red planet orbital insertion',
    distanceKm: '225,000,000 km',
    icon: '🔴',
    color: '#ef4444',
    order: 3,
    xPercent: 50,
    yPercent: 60,
    requiredLessons: ['astro-b1', 'aero-b1'],
  },
];

const mockUser: UserProfile = {
  id: 'user-1',
  name: 'Astronaut Alex',
  email: 'alex@lambdalearn.space',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  provider: 'google',
  level: 'beginner',
  streaks: 4,
  lastActiveDate: '2026-11-05',
  coins: 200,
  xp: 450,
  completedLessons: [],
  currentCheckpointId: 'earth-orbit',
  unlockedGifts: ['gift-badge-pioneer'],
  savedPosts: [],
  savedPhotos: [],
};

test('rank title scales with user level and XP', () => {
  assert.equal(getRankTitle(200, 'beginner'), 'Cosmic Explorer');
  assert.equal(getRankTitle(900, 'beginner'), 'Junior Skywatcher');
  assert.equal(getRankTitle(2100, 'beginner'), 'Star Voyager');
  assert.equal(getRankTitle(500, 'advanced'), 'Research Fellow');
  assert.equal(getRankTitle(3500, 'advanced'), 'Principal Astrophysicist');
});

test('calculateNewStreak correctly adds 1 on consecutive day and resets on break', () => {
  // Consecutive day: last active yesterday
  const res1 = calculateNewStreak(4, '2026-11-05', '2026-11-06');
  assert.equal(res1.newStreak, 5);
  assert.equal(res1.streakIncremented, true);

  // Same day: should not increment
  const res2 = calculateNewStreak(5, '2026-11-06', '2026-11-06');
  assert.equal(res2.newStreak, 5);
  assert.equal(res2.streakIncremented, false);

  // Skipped 2 days: broken streak resets to 1
  const res3 = calculateNewStreak(5, '2026-11-01', '2026-11-06');
  assert.equal(res3.newStreak, 1);
  assert.equal(res3.streakIncremented, true);
});

test('completeLessonProgress adds XP, coins, and unlocks next checkpoint', () => {
  const result = completeLessonProgress(mockUser, 'astro-b1', 100, 50, mockCheckpoints);

  assert.equal(result.isFirstCompletion, true);
  assert.equal(result.updatedUser.completedLessons.includes('astro-b1'), true);
  assert.equal(result.updatedUser.xp, 550);
  assert.equal(result.updatedUser.coins, 250);
  assert.equal(result.unlockedNewCheckpoint, true);
  assert.equal(result.updatedUser.currentCheckpointId, 'lunar-gateway');
  assert.equal(result.newCheckpointName, 'Lunar Gateway');
});

test('isCheckpointUnlocked correctly validates prerequisites', () => {
  const cp1 = mockCheckpoints[0]; // Earth orbit, order 1
  assert.equal(isCheckpointUnlocked(cp1, []), true);

  const cp2 = mockCheckpoints[1]; // Lunar gateway, requires astro-b1
  assert.equal(isCheckpointUnlocked(cp2, []), false);
  assert.equal(isCheckpointUnlocked(cp2, ['astro-b1']), true);

  const cp3 = mockCheckpoints[2]; // Mars, requires astro-b1 and aero-b1
  assert.equal(isCheckpointUnlocked(cp3, ['astro-b1']), false);
  assert.equal(isCheckpointUnlocked(cp3, ['astro-b1', 'aero-b1']), true);
});

test('purchaseReward verifies coin balance and deducts coins properly', () => {
  const gift: RewardGift = {
    id: 'gift-telescope-filter',
    name: 'OIII Narrowband Filter',
    category: 'equipment',
    description: 'Increases contrast on emission nebulae',
    costCoins: 150,
    icon: '🔭',
    rarity: 'rare',
  };

  const expensiveGift: RewardGift = {
    id: 'gift-hubble-mirror',
    name: 'Hubble Primary Mirror Shard',
    category: 'trophy',
    description: 'Legendary space artifact',
    costCoins: 1000,
    icon: '✨',
    rarity: 'legendary',
  };

  // User has 200 coins
  const resSuccess = purchaseReward(mockUser, gift);
  assert.equal(resSuccess.success, true);
  assert.equal(resSuccess.updatedUser.coins, 50);
  assert.equal(resSuccess.updatedUser.unlockedGifts.includes('gift-telescope-filter'), true);

  // Too expensive
  const resFail = purchaseReward(mockUser, expensiveGift);
  assert.equal(resFail.success, false);
  assert.equal(resFail.updatedUser.coins, 200);
});
