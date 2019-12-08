import { Injectable, HttpStatus } from "@nestjs/common";
import { config } from "../common/Config";
import { OAuth2Client } from "google-auth-library";
import { ApiException } from "../common/ApiException";
import { GoogleTokenPayload } from "./models/GoogleTokenPayload";
import { UserEntity } from "../users/entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignInMethod } from "./models/SignInMethod";
import { UserDto } from "../users/dto/User.dto";
import { RedisService } from "../redis/redis.service";
import * as crypto from "crypto";
import { SessionDto } from "./dto/Session.dto";
import { LoginResponseDto } from "./dto/LoginResponse.dto";
import { SignUpDto } from "./dto/SignUp.dto";
import { PasswordHash } from "../common/PasswordHash";
import { SignInDto } from "./dto/SignIn.dto";
import * as moment from "moment";

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
      ? ((existing as unknown) as UserDto)
      : await this.createGoogleUser(payload);

    const sessionDto = new SessionDto(
      userDto.id,
      this.generateSession(),
      moment().unix(),
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
    user.createdAt = moment().unix();

    const saved = await this.usersRepository.save(user);
    delete saved.password;
    saved.addresses = [];

    // Must first assert to unknown then to DTO due to 'lacking sufficient overlap'
    return (saved as unknown) as UserDto;
  }

  async signUp(dto: SignUpDto): Promise<LoginResponseDto> {
    // Check for existing user
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      const msg =
        existing.signInMethod === SignInMethod.GOOGLE
          ? "Email aleady is use using Google Sign In."
          : "Email aleady is use.";

      throw new ApiException(HttpStatus.CONFLICT, msg);
    }

    // Create user db entity
    const user = new UserEntity();
    user.firstName = dto.firstName;
    user.lastName = dto.lastName;
    user.email = dto.email;
    user.mobileNumber = dto.mobileNumber;
    user.password = PasswordHash.hash(dto.password);
    user.signInMethod = SignInMethod.PASSWORD;
    user.createdAt = moment().unix();

    // Save entity and remove password from object
    const saved = await this.usersRepository.save(user);
    delete saved.password;
    user.addresses = [];

    // Create and save session
    const sessionDto = new SessionDto(
      saved.id,
      this.generateSession(),
      moment().unix(),
    );
    await this.redisService.saveSession(sessionDto);

    return { user: saved, session: sessionDto };
  }

  async signIn(dto: SignInDto): Promise<LoginResponseDto> {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.addresses", "address")
      .addSelect("user.password") // Select password for comparison
      .where("user.email = :email", { email: dto.email })
      .getOne();

    // Check if user exists
    if (!user) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Email address not in use");
    }

    // Check if user uses Google Sign in
    if (user.signInMethod === SignInMethod.GOOGLE) {
      throw new ApiException(
        HttpStatus.FORBIDDEN,
        "Email address uses Google Sign In",
      );
    }

    // Compare password
    const valid = PasswordHash.validate(dto.password, user.password);
    if (!valid) {
      throw new ApiException(HttpStatus.FORBIDDEN, "Incorrect password");
    }
    delete user.password; // Remove password for response

    // Create and save session
    const sessionDto = new SessionDto(
      user.id,
      this.generateSession(),
      moment().unix(),
    );
    await this.redisService.saveSession(sessionDto);

    return { user, session: sessionDto };
  }

  private generateSession(): string {
    return crypto.randomBytes(24).toString("hex");
  }
}
