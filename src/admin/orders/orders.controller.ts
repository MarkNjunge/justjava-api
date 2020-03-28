import {
  Controller,
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
  ApiQuery,
  ApiSecurity,
} from "@nestjs/swagger";
import { OrdersService } from "../../shared/orders/orders.service";
import { OrderDto } from "../../shared/orders/dto/Order.dto";
import { AdminGuard } from "../../common/guards/admin.guard";

@Controller("admin/orders")
@ApiTags("orders")
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

  @Put("/:id/cancelAdmin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Cancel an order as an admin" })
  async cancelOrderAdmin(@Param("id") id: string) {
    await this.ordersService.cancelOrderAdmin(id);
  }
}
