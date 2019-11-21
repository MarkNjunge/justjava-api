import { Injectable, HttpStatus } from "@nestjs/common";
import { config } from "../common/Config";
import { OAuth2Client } from "google-auth-library";
import { ApiException } from "../common/ApiException";
import { GoogleTokenPayload } from "./models/GoogleTokenPayload";
import { UserEntity } from "./entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignInMethod } from "./models/SignInMethod";
import { UserDto } from "./dto/User.dto";
import { RedisService } from "../redis/redis.service";
import * as crypto from "crypto";
import { SessionDto } from "./dto/Session.dto";
import { LoginResponseDto } from "./dto/LoginResponse.dto";

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {
    this.client = new OAuth2Client(config.google.clientId);
  }

  async signInGoogle(idToken: string): Promise<LoginResponseDto> {
    const payload = await this.verifyToken(idToken);

    if (payload == null) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        "Sign in with Google unsuccessful.",
        { reason: "Decoding token failed." },
      );
    }

    const existing = await this.usersRepository.findOne({
      where: { email: payload.email },
    });

    const userDto = existing
      ? (existing as unknown) as UserDto
      : await this.createGoogleUser(payload);

    const sessionDto = new SessionDto(
      userDto.id,
      this.generateSession(),
      Math.floor(Date.now() / 1000),
    );
    await this.redisService.saveSession(sessionDto);

    return { user: userDto, session: sessionDto };
  }

  private async verifyToken(idToken: string): Promise<GoogleTokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: config.google.clientId,
      });

      return new GoogleTokenPayload(ticket.getPayload());
    } catch (e) {
      return null;
    }
  }

  private async createGoogleUser(
    payload: GoogleTokenPayload,
  ): Promise<UserDto> {
    const user = new UserEntity();
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.signInMethod = SignInMethod.GOOGLE;
    user.createdAt = Math.floor(Date.now() / 1000);

    const saved = await this.usersRepository.save(user);
    delete saved.password;

    // Must first assert to unknown then to DTO due to 'lacking sufficient overlap'
    return (saved as unknown) as UserDto;
  }

  private generateSession() {
    return crypto.randomBytes(24).toString("hex");
  }
}
