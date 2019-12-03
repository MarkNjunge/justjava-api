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
  ApiUseTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiImplicitHeader,
  ApiImplicitQuery,
} from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { OrderValidationError } from "./dto/OrderValidationError.dto";
import { VerifyOrderDto } from "./dto/VerifyOrder.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { PlaceOrderDto } from "./dto/PlaceOrder.dto";
import { OrderDto } from "./dto/Order.dto";
import { AdminGuard } from "../common/guards/admin.guard";

@Controller("orders")
@ApiUseTags("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ title: "Query for orders" })
  @ApiImplicitHeader({ name: "admin-key", required: true })
  @ApiImplicitQuery({ name: "userId", required: false })
  @ApiOkResponse({ type: OrderDto, isArray: true })
  async query(@Query("userId") userId): Promise<OrderDto> {
    if (typeof userId === "object") {
      userId = undefined;
    }
    return this.ordersService.query(userId);
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({ title: "Get order by id" })
  @ApiImplicitHeader({ name: "session-id" })
  @ApiOkResponse({ type: OrderDto })
  async getOrderById(@Param("session") session, @Param("id") id: number) {
    return this.ordersService.getOrderById(session, id);
  }

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

  @Put("/:id/cancel")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiImplicitHeader({ name: "session-id" })
  @ApiOperation({ title: "Cancel an order" })
  async cancelOrder(@Param("session") s, @Param("id") id: number) {
    await this.ordersService.cancelOrder(s, id);
  }

  @Put("/:id/cancelAdmin")
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiOperation({ title: "Cancel an order as an admin" })
  async cancelOrderAdmin(@Param("id") id: number) {
    await this.ordersService.cancelOrderAdmin(id);
  }
}
