export enum SECURE_LEVEL {
  SECURE = 0,
  NOT_SECURE = 1,
  NOT_DEFINED = 2,
}

export interface IEngineAnalysis {
  toPlainObject: () => Object;
}
