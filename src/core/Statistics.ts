import GameType from './GameType';

type GameStatistics = {
  learnedWordsCount: number;
  totalWordsCount: number;
  bestSession: number;
};

export type DailyGameStatistics = GameStatistics;

export type GlobalGameStatistics = GameStatistics;

export type DailyStatistics = {
  learnedWordsCount: number;
  totalWordsCount: number;
  [GameType.Sprint]: DailyGameStatistics;
  [GameType.AudioChallenge]: DailyGameStatistics;
};

type Statistics = {
  daysWords: {
    [key: string]: DailyStatistics;
  };
};

export default Statistics;
