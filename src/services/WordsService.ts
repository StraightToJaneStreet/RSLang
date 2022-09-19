import { inject, injectable } from 'inversify';

import DI_TYPES from '../DI/DITypes';

import store from '../model/store';
import { userWords } from '../model/api/private';

import IWordsService, { GetUnlearnedWordsForPage, GetUnlearnedWordsUpToPage } from './interfaces/IWordsService';

import { WordDifficulty } from '../core/WordDifficulty';
import { AggregatedWord, GetUserWordResponse } from '../model/api/private/userWords';
import { IStatisticsService } from './interfaces/IStatisticService';

type CreateArgs = {
  id: string;
  wordId: string;
  difficulty: WordDifficulty;
}

type UpdateArgs = {
  id: string;
  wordId: string;
  difficulty: WordDifficulty;
}

@injectable()
export default class WordsService implements IWordsService {
  constructor(@inject(DI_TYPES.StatisticsService) private statisticService: IStatisticsService) {}

  async setWordHardMark(userId: string, wordId: string): Promise<boolean> {
    return this.setWordDifficulty(userId, wordId, WordDifficulty.HARD);
  }

  async setWordLearnedMark(userId: string, wordId: string): Promise<boolean> {
    const promise = this.setWordDifficulty(userId, wordId, WordDifficulty.LEARNED);
    return promise;
  }
  async setWordLearnedMarkWithoutStatsModifying(userId: string, wordId: string): Promise<boolean> {
    const promise = this.setWordDifficultyWithoutStatsModifying(userId, wordId, WordDifficulty.LEARNED);
    return promise;
  }

  async removeWordDifficultMark(userId: string, wordId: string): Promise<boolean> {
    return this.setWordDifficulty(userId, wordId, WordDifficulty.NONE);
  }

  async removeWordLearnedMark(userId: string, wordId: string): Promise<boolean> {
    return this.setWordDifficulty(userId, wordId, WordDifficulty.NONE);
  }

  async getUnlearnedWordsForPage({ userId, group, page }: GetUnlearnedWordsForPage): Promise<AggregatedWord[]> {
    const thunk = userWords.endpoints.getAggregatedWordsForPage.initiate({ userId, group: group, page });
    const sub = store.dispatch(thunk);
    return sub.then((response) => response?.data ?? []);
  }

  async getUnlearnedWordsUpToPage({ userId, group, page }: GetUnlearnedWordsUpToPage): Promise<AggregatedWord[]> {
    const thunk = userWords.endpoints.getAggregatedWordsForPage.initiate({ userId, group, page });
    const sub = store.dispatch(thunk);
    return sub.then((response) => response?.data ?? []);
  }

  private async setWordDifficulty(userId: string, wordId: string, difficulty: WordDifficulty): Promise<boolean> {
    const word = await this.getUserWord(userId, wordId);
    if (word === null) {
      return this.createUserWord({
        id: userId,
        wordId,
        difficulty,
      });
    } else if (word.difficulty !== difficulty) {
      return this.unsafeUpdateWordWithStatsIncrementing({ id: userId, wordId, difficulty });
    } else {
      return false;
    }
  }

  private async setWordDifficultyWithoutStatsModifying(userId: string, wordId: string, difficulty: WordDifficulty): Promise<boolean> {
    const word = await this.getUserWord(userId, wordId);
    if (word === null) {
      return this.createUserWordWithoutStatsModifying({
        id: userId,
        wordId,
        difficulty,
      });
    } else if (word.difficulty !== difficulty) {
      return this.unsafeUpdateWordWithoutStatsIncrementing({ id: userId, wordId, difficulty });
    } else {
      return false;
    }
  }

  private async getUserWord(userId: string, wordId: string): Promise<GetUserWordResponse | null> {
    const getUserWordThunk = userWords.endpoints.readUserWord.initiate({ id: userId, wordId });
    const getUserWordSub = store.dispatch(getUserWordThunk);

    try {
      const { data } = await getUserWordSub;
      return data ?? null;
    } catch {
      return null;
    }
  }

  private async unsafeUpdateWord(
    {
      id,
      wordId,
      difficulty,
    }: UpdateArgs,
    withStatsIncrementing: boolean
  ) {
    const wordUpdateThunk = userWords.endpoints.updateUserWord.initiate({
      id,
      wordId,
      difficulty,
    });

    if (withStatsIncrementing && difficulty === WordDifficulty.LEARNED) {
      this.statisticService.incrementLearnedWordsForDay();
    }

    return store.dispatch(wordUpdateThunk).then((response) => {
      return !('error' in response);
    });
  }

  private async unsafeUpdateWordWithStatsIncrementing(params: UpdateArgs) {
    return this.unsafeUpdateWord(params, true);
  }

  private async unsafeUpdateWordWithoutStatsIncrementing(params: UpdateArgs) {
    return this.unsafeUpdateWord(params, false);
  }

  private async createUserWord({ id, wordId, difficulty }: CreateArgs) {
    const createUserWordThunk = userWords.endpoints.createUserWord.initiate({
      id,
      wordId,
      difficulty,
    });

    if (difficulty === WordDifficulty.LEARNED) {
      this.statisticService.incrementLearnedWordsForDay();
    }

    return store.dispatch(createUserWordThunk).then((response) => {
      return !('error' in response);
    });
  }

  private async createUserWordWithoutStatsModifying({ id, wordId, difficulty }: CreateArgs) {
    const createUserWordThunk = userWords.endpoints.createUserWord.initiate({
      id,
      wordId,
      difficulty,
    });

    return store.dispatch(createUserWordThunk).then((response) => {
      return !('error' in response);
    });
  }
}
