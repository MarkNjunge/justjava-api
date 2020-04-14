import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Get,
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiSecurity,
} from "@nestjs/swagger";
import { OrdersService } from "../../shared/orders/orders.service";
import { OrderValidationError } from "../../shared/orders/dto/OrderValidationError.dto";
import { VerifyOrderDto } from "../../shared/orders/dto/VerifyOrder.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PlaceOrderDto } from "../../shared/orders/dto/PlaceOrder.dto";
import { OrderDto } from "../../shared/orders/dto/Order.dto";
import { ChangePaymentMethodDto } from "../../shared/orders/dto/ChangePaymentMethod.dto";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";

@Controller("orders")
@ApiTags("orders")
@UseGuards(AuthGuard)
@ApiSecurity("session-id")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(":id")
  @ApiOperation({ summary: "Get order by id" })
  @ApiOkResponse({ type: OrderDto })
  async getOrderById(@Param("session") session, @Param("id") id: string) {
    return this.ordersService.getOrderById(session, id);
  }

  @Post("/verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify an order's items and choices are valid" })
  @ApiOkResponse({ type: OrderValidationError, isArray: true })
  async verify(@Body() dto: VerifyOrderDto): Promise<OrderValidationError[]> {
    return this.ordersService.verifyOrderItems(dto);
  }

  @Post("/place")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Place an order" })
  @ApiCreatedResponse({ type: OrderDto, isArray: true })
  async placeOrder(
    @Param("session") s,
    @Body() dto: PlaceOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.placeOrder(s, dto);
  }

  @Post(":id/paymentMethod")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change the payment method of an order" })
  @ApiCreatedResponse({ type: ApiResponseDto })
  async changePaymentMethod(
    @Param("session") s,
    @Param("id") id: string,
    @Body() dto: ChangePaymentMethodDto,
  ): Promise<ApiResponseDto> {
    return this.ordersService.changePaymentMethod(s, id, dto);
  }

  @Put("/:id/cancel")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Cancel an order" })
  async cancelOrder(@Param("session") s, @Param("id") id: string) {
    await this.ordersService.cancelOrder(s, id);
  }
}
