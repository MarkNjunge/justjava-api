import {
  Controller,
  Get,
  UseGuards,
  Param,
  Body,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
} from "@nestjs/common";
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from "@nestjs/swagger";
import { UserDto } from "../../shared/users/dto/User.dto";
import { AuthGuard } from "../../../guards/auth.guard";
import { ApiResponseDto } from "../../shared/dto/ApiResponse.dto";
import { AddressDto } from "../../shared/users/dto/Address.dto";
import { SaveAddressDto } from "../../shared/users/dto/SaveAddress.dto";
import { UsersService } from "../../shared/users/users.service";
import { SessionDto } from "../auth/dto/Session.dto";
import { OrderDto } from "../../shared/orders/dto/Order.dto";
import { OrdersService } from "../../shared/orders/orders.service";
import { UpdateUserDto } from "../../shared/users/dto/UpdateUser.dto";
import { UpdateFcmTokenDto } from "../../shared/users/dto/UpdateFcmToken.dto";

@Controller("users")
@ApiTags("users")
@UseGuards(AuthGuard)
@ApiSecurity("session-id")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get("current")
  @ApiOperation({ summary: "Get the current user" })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async getCurrentUser(@Param("session") s) {
    const session = s as SessionDto;

    return this.usersService.getUserById(session.userId);
  }

  @Patch("current")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Update a user's details" })
  @ApiResponse({ status: 204 })
  async updateUser(@Param("session") session, @Body() dto: UpdateUserDto) {
    await this.usersService.updateUser(session, dto);
  }

  @Patch("current/fcm")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Update a user's Firebase messaging token" })
  @ApiResponse({ status: 204 })
  async updateFcmToken(
    @Param("session") session,
    @Body() dto: UpdateFcmTokenDto,
  ) {
    await this.usersService.updateFcmToken(session, dto);
  }

  @Delete("current")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete a user" })
  @ApiResponse({ status: 204 })
  async deleteUser(@Param("session") session) {
    await this.usersService.deleteUser(session);
  }

  @Post("/current/addresses")
  @ApiOperation({ summary: "Save a new address" })
  @ApiResponse({ status: 201, type: AddressDto })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async saveAddress(@Body() dto: SaveAddressDto, @Param("session") session) {
    return this.usersService.saveAddress(dto, session);
  }

  @Put("/current/addresses/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Update an address" })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async updateAddress(
    @Param("id") id: number,
    @Body() dto: SaveAddressDto,
    @Param("session") session,
  ) {
    await this.usersService.updateAddress(id, dto, session);
  }

  @Delete("/current/addresses/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete an address" })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async deleteAddress(@Param("id") id: number, @Param("session") session) {
    await this.usersService.deleteAddress(id, session);
  }

  @Get("/current/orders")
  @ApiOperation({ summary: "Query for orders" })
  @ApiOkResponse({ type: OrderDto, isArray: true })
  async query(@Param("session") session): Promise<OrderDto> {
    return this.ordersService.query(session.userId);
  }
}
