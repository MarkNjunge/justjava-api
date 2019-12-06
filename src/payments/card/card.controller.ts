import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import {
  ApiUseTags,
  ApiOperation,
  ApiImplicitHeader,
  ApiResponse,
} from "@nestjs/swagger";
import { InitiatePaymentDto } from "./dto/InitiatePayment.dto";
import { CardService } from "./card.service";
import { AuthGuard } from "../../common/guards/auth.guard";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";

@Controller("payments/card")
@ApiUseTags("payments")
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post("initiate")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiOperation({ title: "Initiate a card payment" })
  @ApiImplicitHeader({ name: "session-id" })
  @ApiResponse({ status: 200, type: ApiResponseDto })
  async initiate(@Param("session") s, @Body() dto: InitiatePaymentDto) {
    return this.cardService.initiate(s, dto);
  }
}
