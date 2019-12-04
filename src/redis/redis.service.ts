import { Injectable, HttpStatus } from "@nestjs/common";
import * as IoRedis from "ioredis";
import { config } from "../common/Config";
import { SessionDto } from "src/auth/dto/Session.dto";
import { CustomLogger } from "../common/CustomLogger";
import { ApiException } from "../common/ApiException";
import { MpesaAccessTokenDto } from "../payments/mpesa/dto/MpesaAccessToken.dto";

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
      retryStrategy() {
        return false;
      },
    });

    this.redis.on("connect", () => {
      this.logger.log("Connected to Redis instance");
      this.isConnected = true;
    });

    this.redis.on("error", err => {
      if (err.code === "ECONNREFUSED") {
        this.logger.error(
          "Unable to connect to Redis instance. Authentication will not work.",
          "RedisService.connect",
        );
        this.isConnected = false;
      } else {
        this.logger.error(err.message, "RedisService.connect");
      }
    });
  }

  private assertHasConnected() {
    if (!this.isConnected) {
      throw new ApiException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Unable to authenticate",
        { reason: "A connection to Redis has not been established" },
      );
    }
  }

  async saveSession(session: SessionDto) {
    this.assertHasConnected();

    await this.redis.set(
      `session:${session.userId}:${session.sessionId}`,
      JSON.stringify(session),
    );
  }

  async getSession(sessionId: string): Promise<SessionDto> {
    this.assertHasConnected();

    const res = await this.redis.scan(0, "MATCH", `session:*:${sessionId}`);

    if (res[1][0]) {
      const s = await this.redis.get(res[1][0]);
      return JSON.parse(s);
    } else {
      return null;
    }
  }

  async updateLastUseDate(session: SessionDto) {
    this.assertHasConnected();

    session.lastUseDate = Math.floor(Date.now() / 1000);
    await this.saveSession(session);
  }

  async deleteSession(session: SessionDto) {
    this.assertHasConnected();

    await this.redis.del(`session:${session.userId}:${session.sessionId}`);
  }

  async saveMpesaAccessToken(dto: MpesaAccessTokenDto) {
    await this.redis.set(
      "mpesa:accessToken",
      dto.access_token,
      "ex",
      dto.expires_in,
    );
  }

  async getMpesaAccessToken(): Promise<string | null> {
    return this.redis.get("mpesa:accessToken");
  }
}
