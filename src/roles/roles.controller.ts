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
  ParseIntPipe,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { DeleteRoleDto } from "./dto/delete-role.dto";
import { ApiProperty, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { DepthQueryDto, FlatQueryDto } from "./dto/find-all-query.dto";
import { LimitDto, PageDto } from "src/employees/dto/findall-query.dto";

@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiQuery({ name: "flat", type: FlatQueryDto })
  @ApiQuery({ name: "depth", type: DepthQueryDto })
  @ApiQuery({ name: "page", type: PageDto })
  @ApiQuery({ name: "limit", type: LimitDto })
  @Get()
  findAll(
    @Query("flat", new DefaultValuePipe(false), ParseBoolPipe) isFlat,
    @Query("depth") depth: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.rolesService.findAll(isFlat, depth, page, limit);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @ApiResponse({
    status: "2XX",
    description:
      "returns all roles along their associated employees under them",
  })
  @Get(":id/employees")
  findEmployeesOfRole(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.allEmployeesUnderARole(id);
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
