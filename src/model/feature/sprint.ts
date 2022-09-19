import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

type WordId = string;

const STEP_CODE_COMPLETED = 'COMPLETED';
const STEP_CODE_INCOMPLETED = 'INCOMPLETED';

enum GameStageVariant {
  StartScreen = 'start_screen',
  Running = 'running',
  Finished = 'finished',
}

interface StepBase {
  code?: string;
  answer: WordId;
  variant: WordId;
}

export interface IncompletedStep extends StepBase {
  code: typeof STEP_CODE_INCOMPLETED;
}

export interface CompletedStep extends StepBase {
  code: typeof STEP_CODE_COMPLETED;
  result: boolean;
}

export const createCompletedStep = ({ answer, variant, result }: StepBase & { result: boolean }): CompletedStep => ({
  code: STEP_CODE_COMPLETED,
  answer,
  variant,
  result,
});

export const createIncompletedStep = ({ answer, variant }: StepBase): IncompletedStep => ({
  code: STEP_CODE_INCOMPLETED,
  answer,
  variant,
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

type SprintState = {
  stage: null | StartScreenStage | RunningStage | FinishedStage;
};

const initialState: SprintState = {
  stage: null,
};

export const isIncompletedStep = (step: Step): step is IncompletedStep => step.code === STEP_CODE_INCOMPLETED;

export const isCompletedStep = (step: Step): step is CompletedStep => step.code === STEP_CODE_COMPLETED;

export const isGameInStartScreenStage = (state: SprintState): state is { stage: StartScreenStage } =>
  state.stage?.code === GameStageVariant.StartScreen;

export const isGameInRunningStage = (state: SprintState): state is { stage: RunningStage } =>
  state.stage?.code === GameStageVariant.Running;

export const isGameInFinishedStage = (state: SprintState): state is { stage: FinishedStage } =>
  state.stage?.code === GameStageVariant.Finished;

type InitialScreenParams = {
  page: number;
  difficulty: number;
};

export const slice = createSlice({
  name: 'sprint',
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

    makeOpinion(state, { payload: opinion }: PayloadAction<boolean>) {
      if (!isGameInRunningStage(state)) {
        throw Error('Invalid dispatch');
      }

      const { currentStep, steps } = state.stage;
      const { variant, answer } = steps[currentStep];

      const isSuccess = (variant === answer) === opinion;

      const completedStep = createCompletedStep({
        answer,
        variant,
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

    haltByTimeout(state) {
      if (!isGameInRunningStage(state)) {
        throw Error('invalid dispatch');
      }
      const completedSteps = state.stage.steps.filter(isCompletedStep);

      const finishedStage: FinishedStage = {
        code: GameStageVariant.Finished,
        steps: completedSteps,
      };

      return {
        stage: finishedStage,
      };
    },

    destroyGame(state) {
      state.stage = null;
    },
  },
});

export const makeOpinionYes = (): AppThunk => (dispatch) => {
  dispatch(slice.actions.makeOpinion(true));
};

export const makeOpinionNo = (): AppThunk => (dispatch) => {
  dispatch(slice.actions.makeOpinion(false));
};

export const { startFromStartScreen, setGroup, setPage, startGame, haltByTimeout, destroyGame } = slice.actions;

export const selectState = (state: RootState): SprintState => state[slice.name];
