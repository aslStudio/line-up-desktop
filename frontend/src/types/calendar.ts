import { EventData } from "./index";

export enum PlanStatus {
  Applications = "applications",
  Pending = "pending",
  Private = "private",
}

export const statusTranslate: { [status in PlanStatus]: string } = {
  [PlanStatus.Applications]: "Есть заявки",
  [PlanStatus.Pending]: "На рассмотрении",
  [PlanStatus.Private]: "Личное событие",
};

export interface IDay {
  date: Date;
  plans: EventData[];
}

export interface IMonth {
  days: IDay[];
}
