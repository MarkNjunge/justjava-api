import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as IoRedis from "ioredis";
import { config } from "../../common/Config";
import { SessionDto } from "../../client/auth/dto/Session.dto";
import { CustomLogger } from "../../common/logging/CustomLogger";
import { MpesaAccessTokenDto } from "../payments/mpesa/dto/MpesaAccessToken.dto";
import * as moment from "moment";
import { ResetPasswordTokenDto } from "../../client/auth/dto/ResetPasswordToken.dto";

@Injectable()
export class RedisService {
  private isConnected = false;
  private redis: IoRedis.Redis;
  private logger: CustomLogger;

  constructor() {
    this.logger = new CustomLogger("RedisService");
  }

  async connect() {
    this.redis = new IoRedis(config.redis.url, {
      retryStrategy: times => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on("connect", () => {
      this.logger.log("Connected to redis");
      this.isConnected = true;
    });

    this.redis.on("error", err => {
      if (err.code === "ECONNREFUSED") {
        this.logger.error(
          "Unable to connect to Redis instance. Authentication will not work.",
          "RedisService.connect",
        );
        this.isConnected = false;
      } else if (err.code === "ETIMEDOUT") {
        // Error still happens when connection is valid
      } else {
        this.logger.error(err.message, "RedisService.connect");
      }
    });
  }

  private assertHasConnected() {
    if (!this.isConnected) {
      throw new InternalServerErrorException({
        message: "Unable to authenticate",
        meta: { reason: "A connection to Redis has not been established" },
      });
    }
  }

  async saveSession(session: SessionDto) {
    this.assertHasConnected();

    await this.redis.set(
      `justjava:session:${session.sessionId}`,
      JSON.stringify(session),
    );
  }

  async getSession(sessionId: string): Promise<SessionDto> {
    this.assertHasConnected();

    const res = await this.redis.get(`justjava:session:${sessionId}`);

    if (res) {
      return JSON.parse(res);
    } else {
      return null;
    }
  }

  async updateLastUseDate(session: SessionDto) {
    this.assertHasConnected();

    session.lastUseDate = moment().unix();
    await this.saveSession(session);
  }

  async deleteSession(session: SessionDto) {
    this.assertHasConnected();

    await this.redis.del(`justjava:session:${session.sessionId}`);
  }

  async saveMpesaAccessToken(dto: MpesaAccessTokenDto) {
    await this.redis.set(
      "justjava:mpesa:accessToken",
      dto.access_token,
      "ex",
      dto.expires_in,
    );
  }

  async getMpesaAccessToken(): Promise<string | null> {
    return this.redis.get("justjava:mpesa:accessToken");
  }

  async savePasswordResetToken(dto: ResetPasswordTokenDto) {
    await this.redis.set(
      `justjava:password:${dto.token}`,
      JSON.stringify(dto),
      "ex",
      86400,
    );
  }

  async getPasswordResetToken(token: string): Promise<ResetPasswordTokenDto> {
    this.assertHasConnected();

    const res = await this.redis.get(`justjava:password:${token}`);

    if (res) {
      return JSON.parse(res);
    } else {
      return null;
    }
  }

  async deletePasswordResetToken(token: string) {
    await this.redis.del(`justjava:password:${token}`);
  }
}
