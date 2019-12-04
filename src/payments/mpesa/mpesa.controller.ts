import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  Param,
  Body,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiUseTags,
  ApiImplicitHeader,
} from "@nestjs/swagger";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { RequestMpesaDto } from "./dto/RequestMpesa.dto";
import { MpesaService } from "./mpesa.service";

@Controller("payments/mpesa")
@ApiUseTags("payments")
export class MpesaController {
  constructor(private readonly mpesaService: MpesaService) {}

  @Post("/request")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiImplicitHeader({ name: "session-id" })
  @ApiOperation({ title: "Requset an M-Pesa payment" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async request(@Param("session") session, @Body() dto: RequestMpesaDto) {
    return this.mpesaService.request(session, dto);
  }

  @Post("/callback")
  @HttpCode(204)
  @ApiOperation({ title: "Callback for response from Safaricom" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async callback(@Body() body) {
    await this.mpesaService.callback(body);
  }
}
