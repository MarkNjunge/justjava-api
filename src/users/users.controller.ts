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
} from "@nestjs/common";
import { AdminGuard } from "../common/guards/admin.guard";
import {
  ApiImplicitHeader,
  ApiResponse,
  ApiOperation,
  ApiUseTags,
} from "@nestjs/swagger";
import { UserDto } from "./dto/User.dto";
import { AuthGuard } from "../common/guards/auth.guard";
import { ApiResponseDto } from "../common/dto/ApiResponse.dto";
import { AddressDto } from "./dto/Address.dto";
import { SaveAddressDto } from "./dto/SaveAddress.dto";
import { UsersService } from "./users.service";
import { SessionDto } from "../auth/dto/Session.dto";

@Controller("users")
@ApiUseTags("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("")
  @UseGuards(AdminGuard)
  @ApiOperation({ title: "Get all users" })
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(":id")
  @UseGuards(AdminGuard)
  @ApiOperation({ title: "Get user by id" })
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async getUserById(@Param("id") id: number) {
    return this.usersService.getUserById(id);
  }

  @Get("current")
  @UseGuards(AuthGuard)
  @ApiOperation({ title: "Get the current user" })
  @ApiImplicitHeader({ name: "session-id" })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async getCurrentUser(@Param("session") s) {
    const session = s as SessionDto;
    return this.usersService.getUserById(session.userId);
  }

  @Post("/current/addresses")
  @UseGuards(AuthGuard)
  @ApiOperation({ title: "Save a new address" })
  @ApiImplicitHeader({ name: "session-id" })
  @ApiResponse({ status: 201, type: AddressDto })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async saveAddress(@Body() dto: SaveAddressDto, @Param("session") session) {
    return this.usersService.saveAddress(dto, session);
  }

  @Put("/current/addresses/:id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ title: "Update an address" })
  @ApiImplicitHeader({ name: "session-id" })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async updateAddress(
    @Param("id") id: number,
    @Body() dto: SaveAddressDto,
    @Param("session") session,
  ) {
    return this.usersService.updateAddress(id, dto, session);
  }

  @Delete("/current/addresses/:id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ title: "Delete an address" })
  @ApiImplicitHeader({ name: "session-id" })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async deleteAddress(@Param("id") id: number, @Param("session") session) {
    return this.usersService.deleteAddress(id, session);
  }
}
