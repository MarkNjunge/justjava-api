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
  ApiUseTags,
  ApiOperation,
  ApiOkResponse,
  ApiImplicitHeader,
  ApiImplicitQuery,
} from "@nestjs/swagger";
import { OrdersService } from "../../shared/orders/orders.service";
import { OrderDto } from "../../shared/orders/dto/Order.dto";
import { AdminGuard } from "../../common/guards/admin.guard";

@Controller("admin/orders")
@ApiUseTags("orders")
@UseGuards(AdminGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
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

  @Put("/:id/cancelAdmin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiOperation({ title: "Cancel an order as an admin" })
  async cancelOrderAdmin(@Param("id") id: string) {
    await this.ordersService.cancelOrderAdmin(id);
  }
}
