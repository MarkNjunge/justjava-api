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
import { RequestMpesaDto } from "../../shared/payments/mpesa/dto/RequestMpesa.dto";
import { MpesaService } from "../../shared/payments/mpesa/mpesa.service";
import { InitiatePaymentDto } from "../../shared/payments/card/dto/InitiatePayment.dto";
import { CardService } from "../../shared/payments/card/card.service";

@Controller("payments")
@ApiUseTags("payments")
export class PaymentsController {
  constructor(
    private readonly mpesaService: MpesaService,
    private readonly cardService: CardService,
  ) {}

  @Post("mpesa/request")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiImplicitHeader({ name: "session-id" })
  @ApiOperation({ title: "Requset an M-Pesa payment" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async mpesaRequest(@Param("session") session, @Body() dto: RequestMpesaDto) {
    return this.mpesaService.request(session, dto);
  }

  @Post("mpesa/callback")
  @HttpCode(204)
  @ApiOperation({ title: "Callback for response from Safaricom" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async mpesaCallback(@Body() body) {
    await this.mpesaService.callback(body);
  }

  @Post("card/initiate")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiOperation({ title: "Initiate a card payment" })
  @ApiImplicitHeader({ name: "session-id" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async cardInitiate(@Param("session") s, @Body() dto: InitiatePaymentDto) {
    return this.cardService.initiate(s, dto);
  }
}
