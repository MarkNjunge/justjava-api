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
import { AdminGuard } from "../../common/guards/admin.guard";
import {
  ApiImplicitHeader,
  ApiResponse,
  ApiOperation,
  ApiUseTags,
} from "@nestjs/swagger";
import { UserDto } from "../../shared/users/dto/User.dto";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";
import { UsersService } from "../../shared/users/users.service";

@Controller("admin/users")
@ApiUseTags("users")
@UseGuards(AdminGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("")
  @ApiOperation({ title: "Get all users" })
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(":id")
  @ApiOperation({ title: "Get user by id" })
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, type: ApiResponseDto })
  async getUserById(@Param("id") id: number) {
    return this.usersService.getUserById(id);
  }
}
