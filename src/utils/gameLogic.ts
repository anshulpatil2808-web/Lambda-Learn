import { UserProfile, UserLevel, RewardGift, Checkpoint } from '../types';

export function getRankTitle(xp: number, level: UserLevel): string {
  if (level === 'advanced') {
    if (xp > 3000) return 'Principal Astrophysicist';
    if (xp > 1500) return 'Senior Orbital Specialist';
    return 'Research Fellow';
  }
  if (level === 'intermediate') {
    if (xp > 2500) return 'Lead Flight Controller';
    if (xp > 1200) return 'Payload Specialist';
    return 'Flight Cadet';
  }
  // beginner
  if (xp > 2000) return 'Star Voyager';
  if (xp > 800) return 'Junior Skywatcher';
  return 'Cosmic Explorer';
}

export function calculateNewStreak(
  currentStreak: number,
  lastActiveDateStr: string,
  todayDateStr: string
): { newStreak: number; streakIncremented: boolean } {
  if (!lastActiveDateStr) {
    return { newStreak: 1, streakIncremented: true };
  }

  if (lastActiveDateStr === todayDateStr) {
    // Already logged in today
    return { newStreak: Math.max(1, currentStreak), streakIncremented: false };
  }

  const lastDate = new Date(lastActiveDateStr);
  const todayDate = new Date(todayDateStr);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return { newStreak: currentStreak + 1, streakIncremented: true };
  } else if (diffDays > 1) {
    // Broken streak, reset to 1
    return { newStreak: 1, streakIncremented: true };
  }

  return { newStreak: currentStreak, streakIncremented: false };
}

export function completeLessonProgress(
  user: UserProfile,
  lessonId: string,
  xpEarned: number,
  coinsEarned: number,
  checkpoints: Checkpoint[]
): {
  updatedUser: UserProfile;
  isFirstCompletion: boolean;
  unlockedNewCheckpoint: boolean;
  newCheckpointName?: string;
} {
  const isFirstCompletion = !user.completedLessons.includes(lessonId);
  const newCompleted = isFirstCompletion
    ? [...user.completedLessons, lessonId]
    : user.completedLessons;

  const actualXp = isFirstCompletion ? xpEarned : Math.floor(xpEarned * 0.2); // review gives 20%
  const actualCoins = isFirstCompletion ? coinsEarned : Math.floor(coinsEarned * 0.2);

  // Check which checkpoint the user should be at now
  let updatedCheckpointId = user.currentCheckpointId;
  let unlockedNewCheckpoint = false;
  let newCheckpointName: string | undefined;

  for (const cp of checkpoints) {
    const isUnlocked = cp.requiredLessons.every(id => newCompleted.includes(id));
    if (isUnlocked && cp.id !== user.currentCheckpointId) {
      // Find order
      const currentCp = checkpoints.find(c => c.id === user.currentCheckpointId);
      const currentOrder = currentCp ? currentCp.order : 0;
      if (cp.order > currentOrder) {
        updatedCheckpointId = cp.id;
        unlockedNewCheckpoint = true;
        newCheckpointName = cp.name;
      }
    }
  }

  const updatedUser: UserProfile = {
    ...user,
    completedLessons: newCompleted,
    xp: user.xp + actualXp,
    coins: user.coins + actualCoins,
    currentCheckpointId: updatedCheckpointId,
  };

  return {
    updatedUser,
    isFirstCompletion,
    unlockedNewCheckpoint,
    newCheckpointName,
  };
}

export function canPurchaseReward(coins: number, cost: number): boolean {
  return coins >= cost && cost > 0;
}

export function purchaseReward(
  user: UserProfile,
  gift: RewardGift
): { success: boolean; updatedUser: UserProfile; message: string } {
  if (user.unlockedGifts.includes(gift.id)) {
    return { success: false, updatedUser: user, message: 'Already unlocked!' };
  }

  if (!canPurchaseReward(user.coins, gift.costCoins)) {
    return {
      success: false,
      updatedUser: user,
      message: `Need ${gift.costCoins - user.coins} more Lambda Coins!`,
    };
  }

  const updatedUser: UserProfile = {
    ...user,
    coins: user.coins - gift.costCoins,
    unlockedGifts: [...user.unlockedGifts, gift.id],
  };

  return {
    success: true,
    updatedUser,
    message: `Unlocked ${gift.name}!`,
  };
}

export function isCheckpointUnlocked(
  checkpoint: Checkpoint,
  completedLessons: string[]
): boolean {
  if (checkpoint.order === 1) return true; // Earth starting point is always unlocked
  if (checkpoint.requiredLessons.length === 0) return true;
  return checkpoint.requiredLessons.every(reqId => completedLessons.includes(reqId));
}
