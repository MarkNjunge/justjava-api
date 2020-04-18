import { Injectable } from "@nestjs/common";
import * as axios from "axios";
import { config } from "../../common/Config";
import * as admin from "firebase-admin";
import { CustomLogger } from "../../common/logging/CustomLogger";
import { NotificationReason } from "./model/NotificationReason";
import { UserEntity } from "../users/entities/User.entity";
import { NotificationEntity } from "./entity/Notification.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class NotificationsService {
  private logger: CustomLogger;

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationssRepository: Repository<NotificationEntity>,
  ) {
    this.logger = new CustomLogger("NotificationsService");
  }

  async connect() {
    try {
      const res = await axios.default.get(config.google.serviceAccountKeyUrl);
      admin.initializeApp({
        credential: admin.credential.cert(res.data),
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
      this.logger.error(`Error sending message: ${error.message}`, "send");
    }
  }
}
