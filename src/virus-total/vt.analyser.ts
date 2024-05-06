import _ from "lodash";
import { Analyser } from "../analyser/analyser.js";
import vtRequester from "../axios/vtRequester.js";
import { SECURE_LEVEL } from "../analyser/types.js";
import {
  ResultStatus,
  VtAnalysisResult,
  VtAnalysisStats,
  VtOriginalResult,
} from "./types.js";
import Url from "../entity/url.js";
import Timer from "../timer/timer.js";
import EngineError from "../errors/engine.error.js";
import ERROR_CODES from "../errors/error-codes.js";
import { Analysis } from "../analyser/analysis.js";
import { VtAnalysis } from "./vt.analysis.js";

export default class VtAnalyser implements Analyser {
  /* override */
  public async analyzeUrl(url: Url) {
    const analysisId = await this.getAnalysisId(url);

    const urlIdentifier = analysisId.split("-")[1];
    await this.checkIsAnalysisReady(analysisId);

    const urlAnalysis = await this.getUrlAnalysis(urlIdentifier);

    const secureLevel = this.getReportSecureLevel(
      urlAnalysis.attributes.last_analysis_stats
    );

    return new Analysis(url, secureLevel, new VtAnalysis(urlAnalysis));
  }

  private async getAnalysisId(url: Url): Promise<string> {
    const URL_PATH_NAME = "urls";
    return (
      await vtRequester.post(
        `/${URL_PATH_NAME}`,
        new URLSearchParams({
          url: url.getUrl(),
        }),
        { headers: { "content-type": "application/x-www-form-urlencoded" } }
      )
    ).data.data.id;
  }

  private async checkIsAnalysisReady(analysisId: string) {
    const ANALYSES_PATH_NAME = "analyses";
    let recheckDelay = 1000;

    for (let i = 0; i < 10; i++) {
      const responseTemp: VtAnalysisResult = (
        await vtRequester.get(`/${ANALYSES_PATH_NAME}/${analysisId}`)
      ).data.data;

      const {
        attributes: { status },
      } = responseTemp;

      if (status === ResultStatus.Completed) {
        return;
      }

      await Timer.delay(recheckDelay);
      recheckDelay *= 2;
    }

    throw new EngineError(ERROR_CODES.ANALYSIS_LAST_TO_LATE);
  }

  private async getUrlAnalysis(
    urlIdentifier: string
  ): Promise<VtOriginalResult> {
    return (await vtRequester.get(`/urls/${urlIdentifier}`)).data.data;
  }

  private getReportSecureLevel(stats: VtAnalysisStats): SECURE_LEVEL {
    if (stats.malicious >= 1) {
      return SECURE_LEVEL.NOT_SECURE;
    }

    if (stats.suspicious >= 5) {
      return SECURE_LEVEL.NOT_SECURE;
    }

    if (
      stats.timeout ||
      stats.undetected >= stats.harmless / 2 ||
      stats.suspicious >= 1
    ) {
      return SECURE_LEVEL.NOT_DEFINED;
    }

    return SECURE_LEVEL.SECURE;
  }
}
