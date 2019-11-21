import { Injectable } from "@nestjs/common";
import * as IoRedis from "ioredis";
import { config } from "../common/Config";
import { SessionDto } from "src/auth/dto/Session.dto";

@Injectable()
export class RedisService {
  private redis: IoRedis.Redis;

  constructor() {
    this.redis = new IoRedis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    });
  }

  async saveSession(session: SessionDto) {
    await this.redis.set(
      `session:${session.userId}:${session.sessionId}`,
      JSON.stringify(session),
    );
  }

  async getSession(sessionId: string): Promise<SessionDto> {
    const res = await this.redis.scan(0, "MATCH", `session:*:${sessionId}`);

    if (res[1][0]) {
      const s = await this.redis.get(res[1][0]);
      return JSON.parse(s);
    } else {
      return null;
    }
  }

  async updateLastUseDate(session: SessionDto) {
    session.lastUseDate = Math.floor(Date.now() / 1000);
    await this.saveSession(session);
  }

  async deleteSession(session: SessionDto) {
    await this.redis.del(`session:${session.userId}:${session.sessionId}`);
  }
}
