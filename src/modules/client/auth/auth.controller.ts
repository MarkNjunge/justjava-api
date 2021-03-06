import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Delete,
  UseGuards,
  Param,
  Patch,
  Req,
} from "@nestjs/common";
import { LoginGoogleDto } from "./dto/LoginGoogle.dto";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
  ApiSecurity,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginResponseDto } from "./dto/LoginResponse.dto";
import { SignUpDto } from "./dto/SignUp.dto";
import { ApiResponseDto } from "../../shared/dto/ApiResponse.dto";
import { SignInDto } from "./dto/SignIn.dto";
import * as dayjs from "dayjs";
import { AuthGuard } from "../../../guards/auth.guard";
import { ChangePasswordDto } from "./dto/ChangePassword.dto";
import { RequestResetPasswordDto } from "./dto/RequestResetPassword.dto";
import { ResetPasswordDto } from "./dto/ResetPassword.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/google")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      "Authenticate with Google. Signs in if there is an account, creates an account if not.",
  })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async signInGoogle(@Req() req, @Body() dto: LoginGoogleDto) {
    const response = await this.authService.signInGoogle(dto.idToken);

    const sessionExpiry = dayjs().add(1, "year")
      .unix();
    // eslint-disable-next-line max-len
    req._cookies = `session-id=${response.session.sessionId}; Expires=${sessionExpiry}; HttpOnly; path=/`;

    return response;
  }

  @Post("/signup")
  @ApiOperation({ summary: "Create an account" })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseDto })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ApiResponseDto,
    description: "The email address is already in use",
  })
  async signUp(@Req() req, @Body() dto: SignUpDto) {
    dto.email = dto.email.toLowerCase();
    const response = await this.authService.signUp(dto);

    const sessionExpiry = dayjs().add(1, "year")
      .unix();
    // eslint-disable-next-line max-len
    req._cookies = `session-id=${response.session.sessionId}; Expires=${sessionExpiry}; HttpOnly; path=/`;

    return response;
  }

  @Post("/signin")
  @ApiOperation({ summary: "Sign into an account" })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: ApiResponseDto,
    description: "Email address not in use",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ApiResponseDto,
    description: "Email address uses Google Sign In | Incorrect password",
  })
  async signIn(@Req() req, @Body() dto: SignInDto) {
    dto.email = dto.email.toLowerCase();
    const response = await this.authService.signIn(dto);

    const sessionExpiry = dayjs().add(1, "year")
      .unix();
    // eslint-disable-next-line max-len
    req._cookies = `session-id=${response.session.sessionId}; Expires=${sessionExpiry}; HttpOnly; path=/`;

    return response;
  }

  @Delete("/signout")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Sign out of a session" })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204 })
  @ApiSecurity("session-id")
  async signOut(@Param("session") session) {
    await this.authService.signOut(session);
  }

  @Patch("/changePassword")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Change password" })
  @ApiHeader({ name: "session-id" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async changePassword(
    @Param("session") session,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(session, dto);
  }

  @Post("/requestPasswordReset")
  @ApiOperation({ summary: "Request password reset email" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async requestPasswordReset(@Body() dto: RequestResetPasswordDto) {
    return this.authService.requestPasswordReset(dto);
  }

  @Post("/resetPassword")
  @ApiOperation({ summary: "Reset password using token" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
