import * as axios from "axios";
import * as Transport from "winston-transport";
import { config } from "./Config";

export class DatadogTransport extends Transport {
  private apiUrl = "";

  constructor(opts) {
    super(opts);

    this.apiUrl = `https://http-intake.logs.datadoghq.com/v1/input?service=${config.datadog.service}&ddsource=${config.datadog.source}&host=${config.datadog.host}&ddtags=`;
  }

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

    if (info.data.stacktrace) {
      body = {
        ...body,
        error: {
          stack: info.data.stacktrace,
        },
      };

      delete body.stacktrace;
    }

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
