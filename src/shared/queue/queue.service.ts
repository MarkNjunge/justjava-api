import { Injectable } from "@nestjs/common";
import * as Bull from "bull";
import { config } from "../../common/Config";
import { CustomLogger } from "../../common/CustomLogger";

@Injectable()
export class QueueService {
  private orderQueue: Bull.Queue;
  private logger = new CustomLogger("QueueService");

  constructor() {
    this.orderQueue = new Bull("justjava-order-queue", {
      redis: config.queue.redisUrl,
    });
  }

  async startOrderSequence(orderId: string) {
    this.logger.debug(`Adding order ${orderId} to queue`);
    await this.orderQueue.add(
      {
        serviceName: config.queue.serviceName,
        orderId,
        orderStatus: "CONFIRMED",
      },
      {
        attempts: 3,
        backoff: { type: "fixed", delay: 2000 },
      },
    );
  }
}
