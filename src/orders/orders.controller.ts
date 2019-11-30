import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiUseTags, ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { OrderValidationError } from "./dto/OrderValidationError.dto";
import { VerifyOrderDto } from "./dto/VerifyOrder.dto";

@Controller("orders")
@ApiUseTags("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post("/verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ title: "Verify an order's items and choices are valid" })
  @ApiOkResponse({ type: OrderValidationError, isArray: true })
  async verify(@Body() dto: VerifyOrderDto): Promise<OrderValidationError[]> {
    return this.ordersService.verifyOrderItems(dto);
  }
}
