import { inject, injectable } from 'inversify';

import DI_TYPES from '../DI/DITypes';

import IAuthService from './interfaces/IAuthService';
import { IStatisticsService } from './interfaces/IStatisticService';

import IAuth from '../core/IAuth';
import Statistics, { DailyGameStatistics } from '../core/Statistics';

import store from '../model/store';
import { statistic as statisticApi } from '../model/api/private';
import { StatisticsShema } from '../model/api/shemas';
import GameType from '../core/GameType';

export const DAILY_STATS_KEEPING_MARKER = 'keep';

const createEmptyGameStatistic = (): DailyGameStatistics => ({
  learnedWordsCount: 0,
  totalWordsCount: 0,
  bestSession: 0,
})

@injectable()
export default class StatisticService implements IStatisticsService {
  private userParams: IAuth;

  constructor(@inject(DI_TYPES.AuthService) authService: IAuthService) {
    const auth = authService.getAuth();
    if (auth === null) {
      throw Error('unauth');
    }

    this.userParams = auth;
  }

  async initializeStatistics(): Promise<boolean> {
    try {
      await this.getStatistics();
    } catch {
      const body: StatisticsShema = {
        optional: {
          daysWords: {
            [DAILY_STATS_KEEPING_MARKER]: {
              learnedWordsCount: 0,
              totalWordsCount: 0,
              sprintGame: createEmptyGameStatistic(),
              audioGame: createEmptyGameStatistic(),
            },
          },
        },
      };
      
      this.updateStatistics(body);
    }

    return true;
  }

  async incrementLearnedWordsForDay(): Promise<boolean> {
    const oldStatistics = await this.getStatistics();
    const currentDay = new Date().toLocaleDateString();
    if (currentDay in oldStatistics.daysWords) {
      const {
        daysWords: {
          [currentDay]: { learnedWordsCount, ...rest3 },
          ...rest2
        },
        ...rest1
      } = oldStatistics;

      const updated: Statistics = {
        daysWords: {
          [currentDay]: {
            learnedWordsCount: 1 + learnedWordsCount,
            ...rest3,
          },
          ...rest2,
        },
        ...rest1,
      };
      const updatedBody = {
        optional: updated,
      };

      return this.updateStatistics(updatedBody);
    } else {
      const { daysWords, ...rest1 } = oldStatistics;

      const updated: Statistics = {
        daysWords: {
          [currentDay]: {
            learnedWordsCount: 1,
            totalWordsCount: 0,
            audioGame: createEmptyGameStatistic(),
            sprintGame: createEmptyGameStatistic(),
          },
          ...daysWords,
        },
        ...rest1,
      };
      const updatedBody = {
        optional: updated,
      };

      return this.updateStatistics(updatedBody);
    }
  }

  async modifyDaySprintStatistic(wordsCount: number, positiveCount: number, bestSeries: number): Promise<boolean> {
    return this.modifyGameStatistic(GameType.Sprint, wordsCount, positiveCount, bestSeries);
  }

  async modifyDayAudioStatistic(wordsCount: number, positiveCount: number, bestSeries: number): Promise<boolean> {
    return this.modifyGameStatistic(GameType.AudioChallenge, wordsCount, positiveCount, bestSeries);
  }

  private async modifyGameStatistic(
    gameKey: GameType,
    wordsCount: number,
    positiveCount: number,
    bestSeries: number
  ) {
    const oldStatistics = await this.getStatistics();
    const currentDay = new Date().toLocaleDateString();
    const isSprint = (value: GameType): value is GameType.Sprint => value === GameType.Sprint;
    const { daysWords: dailyStats, ...rest1 } = oldStatistics;

    if (currentDay in dailyStats) {
      const {
        [currentDay]: { sprintGame: oldSprintStats, audioGame: oldAudioStats, ...dayRestStat },
        ...daysRest
      } = dailyStats;

      const {
        learnedWordsCount,
        totalWordsCount,
        bestSession: oldBestSeries,
      } = isSprint(gameKey) ? oldSprintStats : oldAudioStats;

      const updatedBody = {
        daysWords: {
          [currentDay]: {
            ...(isSprint(gameKey)
              ? {
                  sprintGame: {
                    learnedWordsCount: learnedWordsCount + positiveCount,
                    totalWordsCount: totalWordsCount + wordsCount,
                    bestSession: Math.max(bestSeries, oldBestSeries),
                  },
                  audioGame: oldAudioStats,
                }
              : {
                  audioGame: {
                    learnedWordsCount: learnedWordsCount + positiveCount,
                    totalWordsCount: totalWordsCount + wordsCount,
                    bestSession: Math.max(bestSeries, oldBestSeries),
                  },
                  sprintGame: oldSprintStats,
                }),
            ...dayRestStat,
          },
          ...daysRest,
        },
        ...rest1,
      };

      return this.updateStatistics({ optional: updatedBody });
    } else {
      const updatedBody = {
        daysWords: {
          [currentDay]: {
            ...(isSprint(gameKey)
              ? {
                  sprintGame: {
                    learnedWordsCount: positiveCount,
                    totalWordsCount: wordsCount,
                    bestSession: bestSeries,
                  },
                  audioGame: { learnedWordsCount: 0, totalWordsCount: 0, bestSession: 0 },
                }
              : {
                  audioGame: {
                    learnedWordsCount: positiveCount,
                    totalWordsCount: wordsCount,
                    bestSession: bestSeries,
                  },
                  sprintGame: { learnedWordsCount: 0, totalWordsCount: 0, bestSession: 0 },
                }),
            learnedWordsCount: 0,
            totalWordsCount: 0,
          },
          ...dailyStats,
        },
        ...rest1,
      };

      return this.updateStatistics({ optional: updatedBody });
    }
  }

  public async getStatistics(): Promise<Statistics> {
    const { data } = await store.dispatch(statisticApi.endpoints.getStatistic.initiate({ userId: this.userParams.id }));
    if (data === undefined) {
      throw Error('Undefined behavior');
    }

    const { optional } = data;

    return JSON.parse(JSON.stringify(optional));
  }

  private async updateStatistics(newBody: StatisticsShema): Promise<boolean> {
    const mutationThunk = statisticApi.endpoints.updateStatistic.initiate({
      userId: this.userParams.id,
      payload: newBody,
    });

    return store.dispatch(mutationThunk).then((response) => !('error' in response));
  }
}
