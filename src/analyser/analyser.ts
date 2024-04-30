import { AnalyserReturnData } from "./types.js";
import IpAddress from "../entity/ip-address.js";
import Url from "../entity/url.js";

type OptionalPromise<T> = T | Promise<T>;

interface Analyser<T> {
  getIpInfo(ipAddress: IpAddress): OptionalPromise<AnalyserReturnData<T>>;
  getUrlInfo(url: Url): OptionalPromise<AnalyserReturnData<T>>;
}

export default Analyser;
