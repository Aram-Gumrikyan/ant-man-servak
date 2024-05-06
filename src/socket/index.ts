import * as http from "http";
import { Server } from "socket.io";
import { AnalyserService } from "../analyser/analyser.service.js";
import VtAnalyser from "../virus-total/vt.analyser.js";
import Url from "../entity/url.js";
import CustomError from "../errors/custom.error.js";
import ERROR_CODES from "../errors/error-codes.js";
import { AnalysisRepository } from "../analyser/analyser.repository.js";
import { Analysis } from "../analyser/analysis.js";

export const setupSocket = async (server: http.Server) => {
  const io = new Server(server);

  const analyserService = new AnalyserService(
    new VtAnalyser(),
    await AnalysisRepository.getInstance()
  );

  io.on("connection", (socket): void => {
    socket.on("analyze", async (data?: { url: string }) => {
      const { url: iUrl = "" } = data || {};

      let url;
      try {
        url = new Url(iUrl);
      } catch (e) {
        console.error(e);

        const error =
          e instanceof CustomError
            ? e
            : new CustomError(ERROR_CODES.FAILED_TO_GET_ANALYSIS);

        socket.emit("analysis", {
          forUrl: iUrl,
          analysis: {
            e: error.getErrorCode(),
          },
        });
        return;
      }

      try {
        const usersCountInRoom = io.sockets.adapter.rooms.get(
          url.getUrl()
        )?.size;

        socket.join(url.getUrl());
        if (usersCountInRoom && usersCountInRoom >= 1) {
          return;
        }

        const analysis = await analyserService.getUrlAnalysis(url);
        io.to(url.getUrl()).emit("analysis", {
          forUrl: url.getUrl(),
          analysis:
            analysis instanceof Analysis ? analysis.toPlainObject() : analysis,
        });
      } catch (e) {
        console.error(e);
        const error =
          e instanceof CustomError
            ? e
            : new CustomError(ERROR_CODES.FAILED_TO_GET_ANALYSIS);

        io.to(url.getUrl()).emit("analysis", {
          forUrl: url.getUrl(),
          analysis: {
            e: error.getErrorCode(),
          },
        });
      } finally {
        io.in(url.getUrl()).socketsLeave(url.getUrl());
      }
    });
  });
};
