import { injectable, inject } from 'inversify';

import DI_TYPES from '../DI/DITypes';

import IAuthService from './interfaces/IAuthService';
import store from '../model/store';
import { FinishedStage, isGameInFinishedStage, selectState as selectGameState, startFromStartScreen, StartScreenStage } from '../model/feature/sprint';
import { userWords as userWordsApi } from '../model/api/private';
import {
  makeOpinionYes,
  makeOpinionNo,
  destroyGame,
  setPage,
  setGroup,
  startGame,
  haltByTimeout,
  IncompletedStep,
  createIncompletedStep,
} from '../model/feature/sprint';

import { ISprintGame, StartingParams } from './interfaces/ISprintGame';
import IAuth from '../core/IAuth';
import { AggregatedWord } from '../model/api/private/userWords';
import { pickWords, pickWordsWithValidation } from './utils/randomPicking';
import { IStatisticsService } from './interfaces/IStatisticService';
import { calculateStreakLength } from './utils/extractStreak';
import IWordsService from './interfaces/IWordsService';

@injectable()
export default class SprintGame implements ISprintGame {
  private userParams: IAuth;

  constructor(
    @inject(DI_TYPES.StatisticsService) private statisticsService: IStatisticsService,
    @inject(DI_TYPES.WordsService) private wordsService: IWordsService,
    @inject(DI_TYPES.AuthService) authService: IAuthService
  ) {
    const auth = authService.getAuth();

    if (auth === null) {
      throw Error('Unauthorized');
    }

    this.userParams = auth;
  }

  async handleVictory({ steps }: FinishedStage): Promise<void> {
    const succesfulWords = steps.filter((step) => step.result);
    const totalCount = steps.length;
    const learnedCount = succesfulWords.length;
    const bestStreak = calculateStreakLength(steps, (step) => step.result);

    this.statisticsService.modifyDayAudioStatistic(totalCount, learnedCount, bestStreak);

    succesfulWords.forEach(
      (word) =>
        this.wordsService.setWordLearnedMarkWithoutStatsModifying(this.userParams.id, word.answer)
    );
  }

  async startWithParams({ group, page }: StartingParams): Promise<void> {
    const steps = await this.createStepsForParams({ group, page });
    store.dispatch(startGame(steps));
  }

  startWithSettingsScreen(): void {
    store.dispatch(startFromStartScreen({ difficulty: 0, page: 0 }));
  }

  async startGame(): Promise<void> {
    const { stage } = selectGameState(store.getState());
    const { group, page } = stage as StartScreenStage;

    const steps = await this.createStepsForParams({ group, page });

    store.dispatch(startGame(steps));
  }

  haltByTimeout(): void {
    store.dispatch(haltByTimeout());

    const state = selectGameState(store.getState());

    if (isGameInFinishedStage(state)) {
      this.handleVictory(state.stage);
    };
  }

  makeOpinionYes(): void {
    store.dispatch(makeOpinionYes());
  }

  makeOpinionNo(): void {
    store.dispatch(makeOpinionNo());
  }

  selectGroup(value: number): void {
    store.dispatch(setGroup(value));
  }

  selectPage(value: number): void {
    store.dispatch(setPage(value));
  }

  destroy(): void {
    store.dispatch(destroyGame());
  }

  private async createStepsForParams({ group, page }: { group: number; page: number }): Promise<IncompletedStep[]> {
    const availableUnlearnedWordsThunk = userWordsApi.endpoints.getUnlearnedWordsForPage.initiate({
      userId: this.userParams.id,
      group,
      page,
    });

    const availableAsVariantWordsThunk = userWordsApi.endpoints.getAggregatedWordsUpToPage.initiate({
      userId: this.userParams.id,
      group,
      page,
    });

    const [{ data: availableUnlearnedWords }, { data: availableAsVariantWords }] = await Promise.all([
      store.dispatch(availableUnlearnedWordsThunk),
      store.dispatch(availableAsVariantWordsThunk),
    ]);

    if (availableUnlearnedWords === undefined || availableAsVariantWords === undefined) {
      throw Error('Cant fetch words for game');
    }

    const answerWrods = pickWords(availableUnlearnedWords, 10);

    const steps = answerWrods.map((answer) => {
      const answerId = answer.id;
      const variantValidator = (variant: AggregatedWord) => variant.id !== answerId;
      const variant: string = pickWordsWithValidation(availableAsVariantWords, 1, variantValidator).map(
        (variant) => variant.id
      )[0];

      return createIncompletedStep({
        answer: answerId,
        variant: Math.floor(Math.random() * 2) ? variant : answerId,
      });
    });

    return steps;
  }
}
