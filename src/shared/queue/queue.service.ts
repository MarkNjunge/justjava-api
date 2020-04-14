import { Injectable, Inject, forwardRef } from "@nestjs/common";
import * as Bull from "bull";
import { InjectRepository } from "@nestjs/typeorm";
import { config } from "../../common/Config";
import { CustomLogger } from "../../common/CustomLogger";
import { PaymentEntity } from "../payments/entities/Payment.entity";
import { Repository } from "typeorm";
import { PaymentStatus } from "../payments/models/PaymentStatus";
import { MpesaService } from "../payments/mpesa/mpesa.service";

@Injectable()
export class QueueService {
  private orderQueue: Bull.Queue;
  private mpesaPaymentsQueue: Bull.Queue;
  private logger = new CustomLogger("QueueService");

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
    @Inject(forwardRef(() => MpesaService))
    private readonly mpesaService: MpesaService,
  ) {
    this.orderQueue = new Bull("justjava-order-queue", {
      redis: config.queue.redisUrl,
    });

    this.mpesaPaymentsQueue = new Bull("mpesa-payments-queue", {
      redis: config.queue.redisUrl,
    });

    this.processMpesaPayments();
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

  /**
   * Schedule the payment to be checked after 30s.
   * The callback from Safaricom will sometimes not be sent.
   * @param checkoutRequestId
   */
  async scheduleCheckMpesaPayment(checkoutRequestId: string, attempts = 0) {
    this.logger.debug(
      `Scheduling verification of payment ${checkoutRequestId}`,
    );
    await this.mpesaPaymentsQueue.add(
      {
        attempts,
        checkoutRequestId,
      },
      {
        delay: config.queue.mpesaCheckDelay,
        attempts: 3,
        backoff: { type: "fixed", delay: 2000 },
      },
    );
  }

  async processMpesaPayments() {
    this.mpesaPaymentsQueue.process(async (job, done) => {
      const checkoutRequestId = job.data.checkoutRequestId;
      const attempts = job.data.attempts;

      this.logger.debug(`Checking payment ${checkoutRequestId}`);

      if (attempts >= config.queue.maxMpesaCheckAttempts) {
        this.logger.debug(
          `Payment ${checkoutRequestId} has been checked ${attempts} times. Skipping...`,
        );
        done();
        return;
      }

      const payment = await this.paymentsRepository.findOne({
        transactionRef: checkoutRequestId,
      });

      if (payment.status !== PaymentStatus.PENDING) {
        done();
        return;
      }

      const res = await this.mpesaService.checkPaymentStatus(checkoutRequestId);
      if (res === true) {
        this.logger.debug(`Payment ${checkoutRequestId} has been verified`);
        done();
      } else {
        await this.scheduleCheckMpesaPayment(checkoutRequestId, attempts + 1);
        done();
      }
    });
  }
}
