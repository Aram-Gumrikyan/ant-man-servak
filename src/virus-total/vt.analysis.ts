import _ from "lodash";
import { IEngineAnalysis } from "../analyser/types.js";
import { CATEGORY, VtOriginalResult, VtResult } from "./types.js";
import { VOTE_VARIANT } from "../vote/types.js";

export class VtAnalysis implements IEngineAnalysis {
  private engineName: string = "virusTotal";
  private result: VtResult;

  constructor(urlAnalysis: VtOriginalResult) {
    this.result = this.mapAnalysisResults(urlAnalysis.attributes);
  }

  toPlainObject() {
    return { engineName: this.engineName, result: this.result };
  }

  private mapAnalysisResults({
    total_votes: { harmless, malicious },
    last_analysis_results,
  }: VtOriginalResult["attributes"]) {
    const filterAnalysisResults = (categoryName: string) => {
      return _.map(
        _.filter(last_analysis_results, (r) => r.category === categoryName),
        (r) => ({
          engineName: r.engine_name,
          method: r.method,
          result: r.result,
        })
      );
    };

    return {
      totalVotes: {
        [VOTE_VARIANT.HARMLESS]: harmless,
        [VOTE_VARIANT.MALICIOUS]: malicious,
      },
      analysis: {
        [CATEGORY.HARMLESS]: [],
        [CATEGORY.UNDETECTED]: [],
        [CATEGORY.SUSPICIOUS]: filterAnalysisResults("suspicious"),
        [CATEGORY.MALICIOUS]: filterAnalysisResults("malicious"),
      },
    };
  }
}
