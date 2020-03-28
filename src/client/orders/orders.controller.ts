import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Get,
  Query,
  Put,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiQuery,
} from "@nestjs/swagger";
import { OrdersService } from "../../shared/orders/orders.service";
import { OrderValidationError } from "../../shared/orders/dto/OrderValidationError.dto";
import { VerifyOrderDto } from "../../shared/orders/dto/VerifyOrder.dto";
import { AuthGuard } from "../../common/guards/auth.guard";
import { PlaceOrderDto } from "../../shared/orders/dto/PlaceOrder.dto";
import { OrderDto } from "../../shared/orders/dto/Order.dto";

@Controller("orders")
@ApiTags("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get order by id" })
  @ApiHeader({ name: "session-id" })
  @ApiOkResponse({ type: OrderDto })
  async getOrderById(@Param("session") session, @Param("id") id: number) {
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
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: "session-id" })
  @ApiOperation({ summary: "Place an order" })
  @ApiCreatedResponse({ type: OrderDto, isArray: true })
  async placeOrder(
    @Param("session") s,
    @Body() dto: PlaceOrderDto,
  ): Promise<OrderDto> {
    return this.ordersService.placeOrder(s, dto);
  }

  @Put("/:id/cancel")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({ name: "session-id" })
  @ApiOperation({ summary: "Cancel an order" })
  async cancelOrder(@Param("session") s, @Param("id") id: string) {
    await this.ordersService.cancelOrder(s, id);
  }
}
