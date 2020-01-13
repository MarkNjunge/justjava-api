import * as axios from "axios";
import * as Transport from "winston-transport";
import { config } from "./Config";

export class DatadogTransport extends Transport {
  private apiUrl = "";

  constructor(opts) {
    super(opts);

    // tslint:disable-next-line:max-line-length
    this.apiUrl = `https://http-intake.logs.datadoghq.com/v1/input?service=${config.datadog.service}&ddsource=${config.datadog.source}&host=${config.datadog.host}&ddtags=`;
  }

  async log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    const name = info.message.split("[")[1].split("]")[0];
    const message = info.message.split(`[${name}]`)[1].trim();

    let body: any = { name, message, level: info.level };

    // TODO Use optional chaining when available.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining#Browser_compatibility
    if (info.meta) {
      if (info.meta.stacktrace != null) {
        body = {
          ...body,
          error: {
            stack: info.meta.stacktrace,
          },
        };
      }
    }

    // Add request/response details if log is a route log
    if (name === "ROUTE") {
      const method = message.split(" ")[0];
      const urlPath = message
        .split(method)[1]
        .split(" - ")[0]
        .trim();
      const statusCode = parseInt(
        message
          .split(urlPath)[1]
          .split(" - ")[1]
          .trim(),
        10,
      );

      body = {
        ...body,
        method,
        urlPath,
        statusCode,
      };

      const durationMatch = message.match(/\d*ms/g);
      if (durationMatch !== null) {
        body = {
          ...body,
          duration: parseInt(durationMatch[0].split("ms")[0], 10),
        };
      }
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
