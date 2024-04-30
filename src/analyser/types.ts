export enum SECURE_LEVEL {
  SECURE = 0,
  NOT_SECURE = 1,
  NOT_DEFINED = 2,
}

export type AnalyserReturnData<T> = {
  url?: string;
  id?: string;
  secureLevel: SECURE_LEVEL;
  engineName: string;
  enginSpecificInfo: T;
};
