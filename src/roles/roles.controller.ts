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
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { DeleteRoleDto } from "./dto/delete-role.dto";
import { ApiTags } from "@nestjs/swagger";
import { FindAllQueryDto, PaginationQueryDto } from "./dto/find-all-query.dto";

@ApiTags("roles")
@Controller("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() { flat, depth }: FindAllQueryDto) {
    return this.rolesService.findAll(flat, depth);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  /**
   * returns all roles along their associated employees under specified role
   */
  @Get(":id/employees")
  findEmployeesOfRole(
    @Param("id", ParseUUIDPipe) id: string,
    @Query() { limit, page }: PaginationQueryDto,
  ) {
    return this.rolesService.findAllDescendants(id, limit, page);
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
