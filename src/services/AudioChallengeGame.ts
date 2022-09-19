import { inject, injectable } from 'inversify';

import store from '../model/store';

import { userWords as userWordsApi } from '../model/api/private';

import {
  destroyGame,
  startFromStartScreen,
  setPage,
  setGroup,
  selectWord,
  startGame,
  selectState as selectGameState,
  StartScreenStage,
  createIncompletedStep,
  IncompletedStep,
  FinishedStage,
  isGameInFinishedStage,
} from '../model/feature/audiochallenge';

import DI_TYPES from '../DI/DITypes';
import IAuthService from './interfaces/IAuthService';
import IAuth from '../core/IAuth';

import { IAudioChallengeGame, StartingParams } from './interfaces/IAudioChallengeGame';
import { AggregatedWord } from '../model/api/private/userWords';
import { pickWords, pickWordsWithValidation, shuffle } from './utils/randomPicking';
import { calculateStreakLength } from './utils/extractStreak';
import { IStatisticsService } from './interfaces/IStatisticService';
import IWordsService from './interfaces/IWordsService';

@injectable()
export default class AudioChallengeGame implements IAudioChallengeGame {
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

  async startWithParams({ group, page }: StartingParams) {
    const steps = await this.createStepsForParams({ group, page });
    store.dispatch(startGame(steps));
  }

  startWithSettingsScreen(): void {
    store.dispatch(startFromStartScreen({ difficulty: 0, page: 0 }));
  }

  async setGroup(value: number) {
    store.dispatch(setGroup(value));
    const { stage } = selectGameState(store.getState());
    const { page, group } = stage as StartScreenStage;

    const thunk = userWordsApi.endpoints.getUnlearnedWordsForPage.initiate({
      userId: this.userParams.id,
      page,
      group,
    });

    const sub = store.dispatch(thunk);

    sub.then((response) => {
      console.log(response?.data ?? []);
    });
  }

  setPage(value: number) {
    store.dispatch(setPage(value));
  }

  async startGame() {
    const { stage } = selectGameState(store.getState());
    const { group, page } = stage as StartScreenStage;

    const steps = await this.createStepsForParams({ group, page });

    store.dispatch(startGame(steps));
  }

  destroy() {
    store.dispatch(destroyGame());
  }

  selectAnswerVariant(wordId: string) {
    store.dispatch(selectWord(wordId));
    const state = selectGameState(store.getState());
    if (isGameInFinishedStage(state)) {
      this.handleVictory(state.stage);
    };
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
      const variants: [string, string, string, string] = pickWordsWithValidation(
        availableAsVariantWords,
        3,
        variantValidator
      )
        .map((variant) => variant.id)
        .concat(answerId) as [string, string, string, string];

      shuffle(variants);

      return createIncompletedStep({
        answer: answerId,
        variants: variants,
      });
    });

    return steps;
  }
}
