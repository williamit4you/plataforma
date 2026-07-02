export function getLevelFromXp(xp: number) {
  const level = Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
  const currentLevelBase = Math.pow(level - 1, 2) * 100;
  const nextLevelBase = Math.pow(level, 2) * 100;
  const progress = Math.round(((xp - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100);

  return {
    level,
    currentLevelBase,
    nextLevelBase,
    progress: Math.max(0, Math.min(100, progress)),
  };
}
