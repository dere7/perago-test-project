import { ApiProperty, PickType } from "@nestjs/swagger";
import { Role } from "../entities/role.entities";
import { IsOptional, IsUUID } from "class-validator";

export class CreateRoleDto extends PickType(Role, [
  "name",
  "description",
] as const) {
  @ApiProperty({
    required: false,
    description: "It is optional in the case of the topmost role(e.g. CEO)",
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
