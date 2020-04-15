import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { config, trueBool } from "../../common/Config";
import { OAuth2Client } from "google-auth-library";
import { GoogleTokenPayload } from "./models/GoogleTokenPayload";
import { UserEntity } from "../../shared/users/entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignInMethod } from "./models/SignInMethod";
import { UserDto } from "../../shared/users/dto/User.dto";
import { RedisService } from "../../shared/redis/redis.service";
import * as crypto from "crypto";
import { SessionDto } from "./dto/Session.dto";
import { LoginResponseDto } from "./dto/LoginResponse.dto";
import { SignUpDto } from "./dto/SignUp.dto";
import { PasswordHash } from "../../common/PasswordHash";
import { SignInDto } from "./dto/SignIn.dto";
import * as moment from "moment";
import { ChangePasswordDto } from "./dto/ChangePassword.dto";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";
import { EmailService } from "../../shared/email/email.service";
import { RequestResetPasswordDto } from "./dto/RequestResetPassword.dto";
import { CustomLogger } from "../../common/logging/CustomLogger";
import { ResetPasswordDto } from "./dto/ResetPassword.dto";

@Injectable()
export class AuthService {
  private client: OAuth2Client;
  private logger = new CustomLogger("AuthService");

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {
    this.client = new OAuth2Client(config.google.clientId);
  }

  async signInGoogle(idToken: string): Promise<LoginResponseDto> {
    const payload = await this.verifyToken(idToken);
    payload.email = payload.email.toLowerCase();

    if (payload == null) {
      throw new ForbiddenException({
        message: "Sign in with Google unsuccessful.",
        meta: { reason: "Decoding token failed." },
      });
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

      throw new ConflictException({ message: msg });
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
      throw new NotFoundException({ message: "Email address not in use" });
    }

    // Check if user uses Google Sign in
    if (user.signInMethod === SignInMethod.GOOGLE) {
      throw new ForbiddenException({
        message: "Email address uses Google Sign In",
      });
    }

    // Compare password
    const valid = PasswordHash.validate(dto.password, user.password);
    if (!valid) {
      throw new ForbiddenException({ message: "Incorrect password" });
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

  async signOut(session: SessionDto) {
    await this.redisService.deleteSession(session);
  }

  async changePassword(
    session: SessionDto,
    dto: ChangePasswordDto,
  ): Promise<ApiResponseDto> {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.addresses", "address")
      .addSelect("user.password") // Select password for comparison
      .where("user.id = :id", { id: session.userId })
      .getOne();

    // Check if user exists
    if (!user) {
      throw new NotFoundException({ message: "Email address not in use" });
    }

    // Check if user uses Google Sign in
    if (user.signInMethod === SignInMethod.GOOGLE) {
      throw new ForbiddenException({
        message: "Email address uses Google Sign In",
      });
    }

    // Verify current password
    const valid = PasswordHash.validate(dto.currentPassword, user.password);
    if (!valid) {
      throw new ForbiddenException({
        message: "Current password is incorrect",
      });
    }

    const newPasswordHash = PasswordHash.hash(dto.newPassword);

    await this.usersRepository.update(
      { id: session.userId },
      { password: newPasswordHash },
    );

    return { httpStatus: 200, message: "Password changed successfully" };
  }

  async requestPasswordReset(
    dto: RequestResetPasswordDto,
  ): Promise<ApiResponseDto> {
    this.logger.debug(`Received password reset request for email ${dto.email}`);
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    // Ensure user exists
    if (!user) {
      this.logger.debug(`There is no user with email ${dto.email}`);
      return {
        httpStatus: 200,
        message: "Password reset email sent",
      } as ApiResponseDto;
    }

    // Can't reset passwords for google sign in
    if (user.signInMethod === SignInMethod.GOOGLE) {
      this.logger.debug(`User with email ${dto.email} uses Google sign in`);
      return {
        httpStatus: 200,
        message: "Password reset email sent",
      } as ApiResponseDto;
    }

    const token = this.generateSession();
    this.logger.debug(`Generated token ${token.slice(0, 6)}...`);

    await this.redisService.savePasswordResetToken({
      email: user.email,
      token,
    });

    if (trueBool(config.mailgun.enabled) === true) {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.firstName,
        token,
      );
      this.logger.debug(`Sent password reset email to ${dto.email}`);

      return {
        httpStatus: 200,
        message: "Password reset email sent",
      } as ApiResponseDto;
    } else {
      return {
        httpStatus: 200,
        message: token,
      } as ApiResponseDto;
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const slicedToken = `${dto.token.slice(0, 6)}...`;
    this.logger.debug(`Resetting password using token ${slicedToken}`);
    const resetToken = await this.redisService.getPasswordResetToken(dto.token);

    if (!resetToken) {
      this.logger.debug(`Token ${slicedToken} is not valid`);
      throw new UnauthorizedException("Invalid token");
    }

    const newPasswordHash = PasswordHash.hash(dto.newPassword);

    await this.usersRepository.update(
      { email: resetToken.email },
      { password: newPasswordHash },
    );
    this.logger.debug(`Reset password for user ${resetToken.email}`);

    return { httpStatus: 200, message: "Password changed successfully" };
  }

  private generateSession(): string {
    return crypto.randomBytes(24).toString("hex");
  }
}
