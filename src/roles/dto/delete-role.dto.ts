import { PickType } from "@nestjs/swagger";
import { UpdateRoleDto } from "./update-role.dto";

export class DeleteRoleDto extends PickType(UpdateRoleDto, []) {}
