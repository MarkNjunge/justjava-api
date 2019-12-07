import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { LoginGoogleDto } from "./dto/LoginGoogle.dto";
import { ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { LoginResponseDto } from "./dto/LoginResponse.dto";
import { SignUpDto } from "./dto/SignUp.dto";
import { ApiResponseDto } from "../common/dto/ApiResponse.dto";
import { SignInDto } from "./dto/SignIn.dto";
import * as moment from "moment";

@Controller("auth")
@ApiUseTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/google")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    title:
      "Authenticate with Google. Signs in if there is an account, creates an account if not.",
  })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async signInGoogle(
    @Body() dto: LoginGoogleDto,
    @Res() res: FastifyReply<ServerResponse>,
  ) {
    const response = await this.authService.signInGoogle(dto.idToken);

    const sessionExpiry = moment()
      .add(1, "year")
      .unix();
    res.header(
      "Set-Cookie",
      `session-id=${response.session.sessionId}; Expires=${sessionExpiry}; HttpOnly; path=/`,
    );

    res.send(response);
  }

  @Post("/signup")
  @ApiOperation({ title: "Create an account" })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseDto })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    type: ApiResponseDto,
    description: "The email address is already in use",
  })
  async signUp(
    @Body() dto: SignUpDto,
    @Res() res: FastifyReply<ServerResponse>,
  ) {
    const response = await this.authService.signUp(dto);

    const sessionExpiry = moment()
      .add(1, "year")
      .unix();
    res.header(
      "Set-Cookie",
      `session-id=${response.session.sessionId}; Expires=${sessionExpiry}; HttpOnly; path=/`,
    );

    res.send(response);
  }

  @Post("/signin")
  @ApiOperation({ title: "Sign into an account" })
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
  async signIn(
    @Body() dto: SignInDto,
    @Res() res: FastifyReply<ServerResponse>,
  ) {
    const response = await this.authService.signIn(dto);

    const sessionExpiry = moment()
      .add(1, "year")
      .unix();
    res.header(
      "Set-Cookie",
      `session-id=${response.session.sessionId}; Expires=${sessionExpiry}; HttpOnly; path=/`,
    );

    res.status(200).send(response);
  }
}
