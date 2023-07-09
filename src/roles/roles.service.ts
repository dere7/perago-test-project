import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entities";
import { InjectRepository } from "@nestjs/typeorm";
import { TreeRepository } from "typeorm";
import { DeleteRoleDto } from "./dto/delete-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: TreeRepository<Role>,
  ) {}

  async create(roleData: CreateRoleDto) {
    let reportsTo;
    if (roleData.parentId) {
      reportsTo = await this.findOne(roleData.parentId);
    }
    const role = this.rolesRepository.create({
      ...roleData,
      reportsTo,
    });
    return this.rolesRepository.save(role);
  }

  findAll(isFlat: boolean, depth: number) {
    if (isFlat)
      return this.rolesRepository.find({
        relations: { employees: true },
        order: { name: "ASC" },
      });
    return this.rolesRepository.findTrees({ relations: ["employees"], depth });
  }

  async findOne(id: string) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: { children: true, reportsTo: true, employees: true },
    });
    if (!role) {
      throw new NotFoundException(`Can't find role with id '${id}'`);
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Can't find role with id '${id}'`);
    }
    const { parentId } = updateRoleDto;
    delete updateRoleDto.parentId;
    let reportsTo: Role;
    if (parentId) {
      reportsTo = await this.findOne(parentId);
    } else reportsTo = null;

    await this.rolesRepository.update(id, {
      ...updateRoleDto,
      reportsTo,
    });
    return this.findOne(id);
  }

  async remove(id: string, { parentId }: DeleteRoleDto) {
    const role = await this.findOne(id);
    if (role.children.length !== 0) {
      if (!parentId) {
        throw new ForbiddenException(
          "Other roles report to this role. So, update those roles, before deleting this role",
        );
      }
      const newParent = await this.findOne(parentId);
      for await (const child of role.children) {
        child.reportsTo = newParent;
        await this.rolesRepository.save(child);
      }
    }
    await this.rolesRepository.delete(id);
  }
}
