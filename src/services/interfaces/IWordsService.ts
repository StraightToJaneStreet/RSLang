import { AggregatedWord } from '../../model/api/private/userWords';

export type UserWordParameters = {
  isDifficult: boolean;
  isLearned: boolean;
};

export type GetUnlearnedWordsForPage = {
  userId: string;
  group: number;
  page: number;
};

export type GetUnlearnedWordsUpToPage = {
  userId: string;
  group: number;
  page: number;
};

interface IWordsService {
  setWordHardMark(userId: string, wordId: string): Promise<boolean>;
  removeWordDifficultMark(userId: string, wordId: string): Promise<boolean>;

  setWordLearnedMark(userId: string, wordId: string): Promise<boolean>;
  removeWordLearnedMark(userId: string, wordId: string): Promise<boolean>;

  setWordLearnedMarkWithoutStatsModifying(userId: string, wordId: string): Promise<boolean>;  

  getUnlearnedWordsForPage(params: GetUnlearnedWordsForPage): Promise<AggregatedWord[]>;
  getUnlearnedWordsUpToPage(params: GetUnlearnedWordsUpToPage): Promise<AggregatedWord[]>;
}

export default IWordsService;
