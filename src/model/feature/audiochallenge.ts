import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type WordId = string;

enum GameStageVariant {
  StartScreen = 'start_screen',
  Running = 'running',
  Finished = 'finished',
}

interface StepBase {
  code?: string;
  answer: WordId;
  variants: [WordId, WordId, WordId, WordId];
}

const STEP_CODE_COMPLETED = 'COMPLETED';
const STEP_CODE_INCOMPLETED = 'INCOMPLETED';

export interface IncompletedStep extends StepBase {
  code: typeof STEP_CODE_INCOMPLETED;
}

export interface CompletedStep extends StepBase {
  code: typeof STEP_CODE_COMPLETED;
  result: boolean;
}

export const createCompletedStep = ({ answer, variants, result }: StepBase & { result: boolean }): CompletedStep => ({
  code: STEP_CODE_COMPLETED,
  answer,
  variants,
  result,
});

export const createIncompletedStep = ({ answer, variants }: StepBase): IncompletedStep => ({
  code: STEP_CODE_INCOMPLETED,
  answer,
  variants,
});

export type Step = IncompletedStep | CompletedStep;

export type StartScreenStage = {
  code: GameStageVariant.StartScreen;
  group: number;
  page: number;
};

export type RunningStage = {
  code: GameStageVariant.Running;
  currentStep: number;
  steps: Step[];
};

export type FinishedStage = {
  code: GameStageVariant.Finished;
  steps: CompletedStep[];
};

type AudioChallengeState = {
  stage: null | StartScreenStage | RunningStage | FinishedStage;
};

const initialState: AudioChallengeState = {
  stage: null,
};

export const isIncompletedStep = (step: Step): step is IncompletedStep => step.code === STEP_CODE_INCOMPLETED;

export const isCompletedStep = (step: Step): step is CompletedStep => step.code === STEP_CODE_COMPLETED;

export const isGameInStartScreenStage = (state: AudioChallengeState): state is { stage: StartScreenStage } =>
  state.stage?.code === GameStageVariant.StartScreen;

export const isGameInRunningStage = (state: AudioChallengeState): state is { stage: RunningStage } =>
  state.stage?.code === GameStageVariant.Running;

export const isGameInFinishedStage = (state: AudioChallengeState): state is { stage: FinishedStage } =>
  state.stage?.code === GameStageVariant.Finished;

type InitialScreenParams = {
  page: number;
  difficulty: number;
};

export const slice = createSlice({
  name: 'audiochallenge',
  initialState,
  reducers: {
    startFromStartScreen(state, { payload: { page, difficulty } }: PayloadAction<InitialScreenParams>) {
      if (state.stage !== null) {
        throw Error('Invalid dispatch');
      }

      const startStage: StartScreenStage = {
        code: GameStageVariant.StartScreen,
        page,
        group: difficulty,
      };

      state.stage = startStage;
    },

    setGroup(state, { payload }: PayloadAction<number>) {
      if (!isGameInStartScreenStage(state)) {
        throw Error('Invalid dispatch');
      }

      state.stage.group = payload;
    },

    setPage(state, { payload }: PayloadAction<number>) {
      if (!isGameInStartScreenStage(state)) {
        throw Error('Invalid dispatch');
      }

      state.stage.page = payload;
    },

    startGame(state, { payload }: PayloadAction<Step[]>) {
      if (!isGameInStartScreenStage(state) && state.stage !== null) {
        throw Error('Invalid dispatch');
      }

      const stage: RunningStage = {
        code: GameStageVariant.Running,
        currentStep: 0,
        steps: payload,
      };

      return { stage };
    },

    selectWord(state, { payload: variant }: PayloadAction<WordId>) {
      if (!isGameInRunningStage(state)) {
        throw Error('Invalid dispatch');
      }

      const { currentStep, steps } = state.stage;
      const { variants, answer } = steps[currentStep];

      if (!variants.includes(variant)) {
        throw Error('Invalid variant');
      }

      const isSuccess = variant === answer;

      const completedStep = createCompletedStep({
        answer,
        variants,
        result: isSuccess,
      });

      const updatedSteps = [...state.stage.steps];
      updatedSteps.splice(currentStep, 1, completedStep);

      if (state.stage.currentStep + 1 < state.stage.steps.length) {
        return {
          stage: {
            ...state.stage,
            steps: updatedSteps,
            currentStep: currentStep + 1,
          },
        };
      } else {
        const finishedStage: FinishedStage = {
          code: GameStageVariant.Finished,
          steps: state.stage.steps as CompletedStep[],
        };

        return {
          stage: finishedStage,
        };
      }
    },

    destroyGame(state) {
      state.stage = null;
    },
  },
});

export const { startFromStartScreen, setGroup, setPage, selectWord, startGame, destroyGame } = slice.actions;

export const selectState = (state: RootState): AudioChallengeState => state[slice.name];
