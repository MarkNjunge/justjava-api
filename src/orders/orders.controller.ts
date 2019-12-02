import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
} from "@nestjs/common";
import {
  ApiUseTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiImplicitHeader,
} from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { OrderValidationError } from "./dto/OrderValidationError.dto";
import { VerifyOrderDto } from "./dto/VerifyOrder.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { PlaceOrderDto } from "./dto/PlaceOrder.dto";
import { OrderDto } from "./dto/Order.dto";

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

  @Post("/place")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiImplicitHeader({ name: "session-id" })
  @ApiOperation({ title: "Place an order" })
  @ApiCreatedResponse({ type: OrderDto, isArray: true })
  async placeOrder(
    @Param("session") s,
    @Body() dto: PlaceOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.placeOrder(s, dto);
  }
}
