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
    const reportsTo = roleData.parentId
      ? await this.findOne(roleData.parentId)
      : undefined;

    const role = this.rolesRepository.create({
      ...roleData,
      reportsTo,
    });
    return this.rolesRepository.save(role);
  }

  countRoles() {
    return this.rolesRepository.count();
  }

  async findAll(isFlat: boolean, depth = Infinity, page = 1, limit = 10) {
    if (isFlat) {
      const skip = (page - 1) * limit,
        take = limit;
      const roles = await this.rolesRepository.find({
        take,
        skip,
        relations: { employees: true, reportsTo: true },
        order: { name: "ASC" },
      });
      return {
        results: roles,
        total: await this.countRoles(),
        page,
        limit,
      };
    }
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

  async update(id: string, { name, description, parentId }: UpdateRoleDto) {
    const role = await this.findOne(id);
    const reportsTo = parentId ? await this.findOne(parentId) : undefined;
    // checks if the new parent isn't a child of the node to be updated
    // to avoid circular dependency
    if (reportsTo) {
      const descendants = await this.rolesRepository.findDescendants(role);
      if (
        descendants
          .map((d) => d.id)
          .some((descendantId) => descendantId === parentId)
      ) {
        throw new ForbiddenException(
          "can't use descendant of the role to be its parent",
        );
      }
    }

    await this.rolesRepository.update(id, {
      name,
      description,
      reportsTo,
    });
    return this.findOne(id);
  }

  async getAllRolesExceptDescendants(id: string) {
    const role = await this.findOne(id);
    const descendants = await this.rolesRepository.findDescendants(role);
    const descendantIds = descendants.map((r) => r.id);
    const allRoles = await this.rolesRepository.find();
    return allRoles.filter((role) => !descendantIds.find((i) => i === role.id));
  }

  async remove(id: string, { parentId }: DeleteRoleDto) {
    const role = await this.findOne(id);
    if (role.children.length !== 0) {
      if (!parentId) {
        throw new ForbiddenException(
          "Other roles report to this role. Provide new parent for those roles in body",
        );
      }
      const newParent = await this.findOne(parentId);
      const validParents = await this.getAllRolesExceptDescendants(id);
      if (validParents.find((r) => r.id === id)) {
        throw new ForbiddenException(
          "Can't use children of this role as a new parent",
        );
      }
      for await (const child of role.children) {
        child.reportsTo = newParent;
        await this.rolesRepository.save(child);
      }
    }
    await this.rolesRepository.delete(id);
  }
}
