import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  DefaultValuePipe,
  ParseBoolPipe,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { DeleteRoleDto } from "./dto/delete-role.dto";
import { ApiQuery, ApiResponse } from "@nestjs/swagger";
import { DepthQueryDto, FlatQueryDto } from "./dto/find-all-query.dto";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiQuery({ name: "flat", type: FlatQueryDto })
  @ApiQuery({ name: "depth", type: DepthQueryDto })
  @Get()
  findAll(
    @Query("flat", new DefaultValuePipe(false), ParseBoolPipe) isFlat,
    @Query("depth") depth: number,
  ) {
    return this.rolesService.findAll(isFlat, depth);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @ApiResponse({
    status: "2XX",
    description:
      "returns all roles along their associated employees under specified role",
  })
  @Get(":id/employees")
  findEmployeesOfRole(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.findAllDescendants(id);
  }

  @Get(":id/except_descendants")
  getAllRolesExceptDescendants(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.getAllRolesExceptDescendants(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  remove(@Param("id", ParseUUIDPipe) id: string, @Body() body: DeleteRoleDto) {
    return this.rolesService.remove(id, body);
  }
}
