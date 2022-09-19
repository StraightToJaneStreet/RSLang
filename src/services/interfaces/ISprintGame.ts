import { FinishedStage } from "../../model/feature/sprint";

export type StartingParams = {
  group: number;
  page: number;
};

export interface ISprintGame {
  startWithParams(params: StartingParams): void;
  startWithSettingsScreen(): void;

  startGame(): void;

  makeOpinionYes(): void;
  makeOpinionNo(): void;

  selectGroup(value: number): void;
  selectPage(value: number): void;

  haltByTimeout(): void;

  destroy(): void;

  // Прости меня господь за такие решения
  handleVictory(stageParams: FinishedStage): void;
}
