import { PickType } from "@nestjs/swagger";
import { Role } from "../entities/role.entities";

export class CreateRoleDto extends PickType(Role, [
  "name",
  "description",
  "parentId",
] as const) {}
