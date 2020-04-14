import { Controller, Get, UseGuards, Param } from "@nestjs/common";
import { AdminGuard } from "../../common/guards/admin.guard";
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiSecurity,
} from "@nestjs/swagger";
import { UserDto } from "../../shared/users/dto/User.dto";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";
import { UsersService } from "../../shared/users/users.service";

@Controller("admin/users")
@ApiTags("users")
@UseGuards(AdminGuard)
@ApiSecurity("admin-key")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("")
  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by id" })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async getUserById(@Param("id") id: number) {
    return this.usersService.getUserById(id);
  }
}
