import { Injectable } from "@nestjs/common";
import * as axios from "axios";
import { config } from "../common/Config";
import * as admin from "firebase-admin";
import { CustomLogger } from "../common/CustomLogger";
import { NotificationReason } from "./model/NotificationReason";

@Injectable()
export class NotificationsService {
  private logger: CustomLogger;

  constructor() {
    this.logger = new CustomLogger("NotificationsService");
  }

  async connect() {
    const res = await axios.default.get(config.serviceAccountKeyUrl);
    admin.initializeApp({
      credential: admin.credential.cert(res.data),
      databaseURL: "https://justjava-android.firebaseio.com",
    });
  }

  async send(
    token: string,
    reason: NotificationReason,
    message: string,
    extra: any = {},
  ) {
    const payload = {
      data: {
        reason,
        message,
        ...extra,
      },
    };

    try {
      await admin.messaging().sendToDevice(token, payload);
      this.logger.debug("Message sent");
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`, "send");
    }
  }
}
