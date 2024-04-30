import _ from "lodash";
import Analyser from "../analyser/analyser.js";
import { VOTE_VARIANT } from "../vote/types.js";
import vtRequester from "../axios/vtRequester.js";
import IpAddress from "../entity/ip-address.js";
import { AnalyserReturnData, SECURE_LEVEL } from "../analyser/types.js";
import {
  CATEGORY,
  ResultStatus,
  VtAnalysisResult,
  VtAnalysisStats,
  VtOriginalResult,
  VtResult,
} from "./types.js";
import Url from "../entity/url.js";
import Timer from "../timer/timer.js";
import EngineError from "../errors/engine.error.js";
import ERROR_CODES from "../errors/error-codes.js";

export default class VtAnalyser implements Analyser<VtResult> {
  private engineName: string = "virusTotal";

  /* override */
  public async getIpInfo(
    ipAddress: IpAddress
  ): Promise<AnalyserReturnData<VtResult>> {
    const PATH_NAME = "ip_addresses";
    const response: { data: VtOriginalResult } = await vtRequester.get(
      `/${PATH_NAME}/${encodeURIComponent(ipAddress.getAddress())}`
    );

    const { attributes } = response.data;
    const { last_analysis_stats } = attributes;
    const mappedResponse = this.mapResult(attributes);

    return {
      id: ipAddress.getAddress(),
      secureLevel: this.getReportSecureLevel(last_analysis_stats),
      engineName: this.engineName,
      enginSpecificInfo: mappedResponse,
    };
  }

  /* override */
  public async getUrlInfo(url: Url): Promise<AnalyserReturnData<VtResult>> {
    const analysisId = await this.getAnalysisId(url);

    await this.checkIsAnalysisReady(analysisId);

    const { data }: { data: VtOriginalResult } = (
      await vtRequester.get(`/urls/${analysisId.split("-")[1]}`)
    ).data;
    const { attributes } = data;

    const mappedResponse = this.mapResult(data.attributes);

    return {
      id: url.getUrl(),
      secureLevel: this.getReportSecureLevel(attributes.last_analysis_stats),
      engineName: this.engineName,
      enginSpecificInfo: mappedResponse,
    };
  }

  private async getAnalysisId(url: Url): Promise<string> {
    const URL_PATH_NAME = "urls";
    const {
      data: { data },
    }: { data: { data: { id: string } } } = await vtRequester.post(
      `/${URL_PATH_NAME}`,
      new URLSearchParams({
        url: url.getUrl(),
      }),
      { headers: { "content-type": "application/x-www-form-urlencoded" } }
    );

    return data.id;
  }

  private async checkIsAnalysisReady(analysisId: string) {
    const ANALYSES_PATH_NAME = "analyses";

    for (let i = 0; i < 5; i++) {
      const {
        data: { data: responseTemp },
      }: { data: { data: VtAnalysisResult } } = await vtRequester.get(
        `/${ANALYSES_PATH_NAME}/${analysisId}`
      );

      const {
        attributes: { status },
      } = responseTemp;

      if (status === ResultStatus.Completed) {
        return;
      }

      await Timer.delay(1000);
    }

    throw new EngineError(ERROR_CODES.ANALYSIS_LAST_TO_LATE);
  }

  private mapResult({
    total_votes: { harmless, malicious },
    last_analysis_results,
  }: VtOriginalResult["attributes"]): VtResult {
    //
    const filterAnalysisResults = (categoryName: string) => {
      return _.map(
        _.filter(last_analysis_results, (r) => r.category === categoryName),
        (r) => ({ engineName: r.engine_name, method: r.method })
      );
    };

    return {
      totalVotes: {
        [VOTE_VARIANT.HARMLESS]: harmless,
        [VOTE_VARIANT.MALICIOUS]: malicious,
      },
      analysis: {
        [CATEGORY.HARMLESS]: filterAnalysisResults("harmless"),
        [CATEGORY.SUSPICIOUS]: filterAnalysisResults("suspicious"),
        [CATEGORY.MALICIOUS]: filterAnalysisResults("malicious"),
        [CATEGORY.UNDETECTED]: filterAnalysisResults("undetected"),
      },
    };
  }

  private getReportSecureLevel(stats: VtAnalysisStats): SECURE_LEVEL {
    if (stats.malicious >= 1) {
      return SECURE_LEVEL.NOT_SECURE;
    }

    if (stats.suspicious >= 5) {
      return SECURE_LEVEL.NOT_SECURE;
    }

    if (stats.timeout || stats.undetected >= stats.harmless / 2) {
      return SECURE_LEVEL.NOT_DEFINED;
    }

    return SECURE_LEVEL.SECURE;
  }
}
