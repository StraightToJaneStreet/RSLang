export function calculateStreakLength<T>(items: T[], isSuccess: (item: T) => boolean): number {
  let bestStreak = 0;
  let currentStreak = 0;

  for (let i = 0; i < items.length; i++) {
    if (isSuccess(items[i])) {
      currentStreak++;
    } else {
      bestStreak = Math.max(bestStreak, currentStreak);
      currentStreak = 0;
    }
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  return bestStreak;
}