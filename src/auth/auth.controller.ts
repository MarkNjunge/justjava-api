import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { LoginGoogleDto } from "./dto/LoginGoogle.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { FastifyReply } from "fastify";
import { ServerResponse } from "http";
import { LoginResponseDto } from "./dto/LoginResponse.dto";

@Controller("auth")
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

    const sessionExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365); // 1 year
    res.header(
      "Set-Cookie",
      `sessionId=${response.session.sessionId}; Expires=${sessionExpiry}; HttpOnly; path=/`,
    );

    res.send(response);
  }
}
