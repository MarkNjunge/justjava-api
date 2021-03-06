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
  ApiTags,
  ApiSecurity,
} from "@nestjs/swagger";
import { ApiResponseDto } from "../../shared/dto/ApiResponse.dto";
import { AuthGuard } from "../../../guards/auth.guard";
import { RequestMpesaDto } from "../../shared/payments/mpesa/dto/RequestMpesa.dto";
import { MpesaService } from "../../shared/payments/mpesa/mpesa.service";
import { InitiatePaymentDto } from "../../shared/payments/card/dto/InitiatePayment.dto";
import { CardService } from "../../shared/payments/card/card.service";
import { CheckCardDto } from "../../shared/payments/card/dto/CheckCard.dto";

@Controller("payments")
@ApiTags("payments")
export class PaymentsController {
  constructor(
    private readonly mpesaService: MpesaService,
    private readonly cardService: CardService,
  ) {}

  @Post("mpesa/request")
  @HttpCode(200)
  @ApiOperation({ summary: "Requset an M-Pesa payment" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  @UseGuards(AuthGuard)
  @ApiSecurity("session-id")
  async mpesaRequest(@Param("session") session, @Body() dto: RequestMpesaDto) {
    return this.mpesaService.request(session, dto);
  }

  @Post("mpesa/callback")
  @HttpCode(204)
  @ApiOperation({ summary: "Callback for response from Safaricom" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async mpesaCallback(@Body() body) {
    await this.mpesaService.callback(body);
  }

  @Post("card/check")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Check verification method for card" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  @ApiSecurity("session-id")
  async checkCard(@Param("session") s, @Body() dto: CheckCardDto) {
    return this.cardService.checkCard(s, dto);
  }

  @Post("card/initiate")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Initiate a card payment", deprecated: true })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  @ApiSecurity("session-id")
  async cardInitiate(@Param("session") s, @Body() dto: InitiatePaymentDto) {
    return this.cardService.initiateAddressPayment(s, dto);
  }

  @Post("card/address/initiate")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Initiate an address verified card payment" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  @ApiSecurity("session-id")
  async cardInitiateAddressPayment(
    @Param("session") s,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.cardService.initiateAddressPayment(s, dto);
  }
}
