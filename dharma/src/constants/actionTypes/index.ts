export enum TypeKeys {
  LOG_IN = 'LOG_IN',
}

export interface LogInAction {
  authenticated: boolean;
  authToken: string;
  type: TypeKeys.LOG_IN;
}

export type ActionTypes =
  | LogInAction;
