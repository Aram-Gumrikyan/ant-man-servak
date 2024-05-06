import { VOTE_VARIANT } from "../vote/types.js";

export type VtAnalysisStats = {
  malicious: number;
  suspicious: number;
  undetected: number;
  harmless: number;
  timeout: number;
};

export enum ResultStatus {
  Completed = "completed",
  Queued = "queued",
  InProgress = "in-progress",
}

export type VtAnalysisResult = {
  attributes: {
    status: ResultStatus;
  };
};

export type VtOriginalResult = {
  id: string;
  attributes: {
    total_votes: {
      harmless: number;
      malicious: number;
    };
    last_analysis_results: Record<
      string,
      { category: string; engine_name: string; method: string; result: string }
    >;
    last_analysis_stats: VtAnalysisStats;
  };
};

export type VtResultAnalysis = Record<
  CATEGORY,
  { engineName: string; method: string; result: string }[]
>;

export type VtResult = {
  totalVotes: {
    [key in VOTE_VARIANT]: number;
  };
  analysis: VtResultAnalysis;
};

export enum CATEGORY {
  HARMLESS,
  UNDETECTED,
  SUSPICIOUS,
  MALICIOUS,
}
