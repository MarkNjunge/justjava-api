import { Injectable } from "@nestjs/common";
import { config } from "../../../utils/Config";
import * as admin from "firebase-admin";
import { Logger } from "../../../utils/logging/Logger";
import { NotificationReason } from "./model/NotificationReason";
import { UserEntity } from "../users/entities/User.entity";
import { NotificationEntity } from "./entity/Notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class NotificationsService {
  private logger: Logger;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationssRepository: Repository<NotificationEntity>,
  ) {
    this.logger = new Logger("NotificationsService");
  }

  async connect() {
    try {
      const serviceAccountKeyPath = path.resolve("./service-account-key.json");
      if (!fs.existsSync(serviceAccountKeyPath)) {
        throw new Error(
          `Service account file was expected at '${serviceAccountKeyPath} but was not found`);
      }

      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath).toString());
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: config.google.databaseURL,
      });
    } catch (e) {
      this.logger.error(e.message, e);
    }
  }

  async send(
    user: UserEntity,
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
      await admin.messaging().sendToDevice(user.fcmToken, payload);
      this.logger.debug("Message sent");

      const entity = new NotificationEntity();
      entity.userId = user.id;
      entity.token = user.fcmToken;
      entity.reason = reason.valueOf();
      entity.message = message;
      entity.extra = JSON.stringify(extra);
      await this.notificationssRepository.save(entity);
      this.logger.debug("Notification saved to db");
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`, { context: "send" });
    }
  }
}
