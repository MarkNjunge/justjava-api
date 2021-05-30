import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
  Get,
  Query,
  Put,
  Body,
  Post,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiSecurity,
} from "@nestjs/swagger";
import { OrdersService } from "../../shared/orders/orders.service";
import { OrderDto } from "../../shared/orders/dto/Order.dto";
import { UpdateOrderStatusDto } from "../../shared/orders/dto/UpdateOrderStatus.dto";
import { AdminGuard } from "../../../guards/admin.guard";
import { ApiResponseDto } from "../../shared/dto/ApiResponse.dto";

@Controller("admin/orders")
@ApiTags("admin/orders")
@UseGuards(AdminGuard)
@ApiSecurity("admin-key")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "Query for orders" })
  @ApiQuery({ name: "userId", required: false })
  @ApiOkResponse({ type: OrderDto, isArray: true })
  async query(@Query("userId") userId): Promise<OrderDto> {
    if (typeof userId === "object") {
      userId = undefined;
    }

    return this.ordersService.query(userId);
  }

  @Post("/:id/orderStatus")
  @HttpCode(200)
  @ApiOkResponse({ type: ApiResponseDto })
  async updateOrderStatus(
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<ApiResponseDto> {
    await this.ordersService.updateOrderStatus(id, dto);

    return { httpStatus: 200, message: "Order status updated" };
  }

  @Put("/:id/cancelAdmin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Cancel an order as an admin" })
  async cancelOrderAdmin(@Param("id") id: string) {
    await this.ordersService.cancelOrderAdmin(id);
  }
}
