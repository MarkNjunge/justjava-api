import { Injectable } from "@nestjs/common";
import * as axios from "axios";
import { config } from "../../common/Config";
import { CustomLogger } from "../../common/logging/CustomLogger";

@Injectable()
export class EmailService {
  private logger = new CustomLogger("EmailService");

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const params = new URLSearchParams();
    params.append("from", config.mailgun.from);
    params.append("to", email);
    params.append("subject", "Reset JustJava Password");
    params.append("template", "reset-password");
    params.append(
      "h:X-Mailgun-Variables",
      `{"token":"${token}", "name":"${name}"}`,
    );

    this.logger.debug(`Sending password reset email to ${email}`);
    const res = await axios.default({
      auth: {
        username: "api",
        password: config.mailgun.apiKey,
      },
      method: "POST",
      url: `https://api.mailgun.net/v3/${config.mailgun.domain}/messages`,
      data: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    this.logger.debug(JSON.stringify(res.data));
  }
}
