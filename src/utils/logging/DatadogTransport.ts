import * as axios from "axios";
import * as Transport from "winston-transport";
import { config } from "../Config";
import { removeSensitiveParams } from "./remove-sensitive";

export class DatadogTransport extends Transport {
  private apiUrl = "";

  constructor(opts) {
    super(opts);

    this.apiUrl = `https://http-intake.logs.datadoghq.com/v1/input?service=${config.datadog.service}&ddsource=${config.datadog.source}&host=${config.datadog.host}&ddtags=`;
  }

  // TODO Shorten
  // eslint-disable-next-line max-lines-per-function
  async log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    let body = {
      ...info.data,
      message: info.message.split("] ")[1],
      timestamp: info.timestamp,
      level: info.level,
    };

    if (info?.data?.meta?.stacktrace) {
      body = {
        ...body,
        error: {
          stack: info.data.meta.stacktrace,
        },
      };

      delete body.meta.stacktrace;
    }
    body = removeSensitiveParams(body);

    await axios.default({
      method: "POST",
      url: this.apiUrl,
      headers: {
        "Content-Type": "application/json",
        "DD-API-KEY": config.datadog.apiKey,
      },
      data: JSON.stringify(body),
    });

    callback();
  }
}
