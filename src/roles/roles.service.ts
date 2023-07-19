import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, TreeRepository } from "typeorm";
import { DeleteRoleDto } from "./dto/delete-role.dto";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: TreeRepository<Role>,
  ) {}

  async create({ name, description, parentId }: CreateRoleDto) {
    const role = this.rolesRepository.create({
      name,
      description,
      reportsTo: parentId ? await this.findOne(parentId) : null,
    });
    return this.rolesRepository.save(role);
  }

  countRoles() {
    return this.rolesRepository.count();
  }

  async findAll(isFlat, depth) {
    if (isFlat) {
      return this.rolesRepository.find({
        relations: { employees: true, reportsTo: true },
        order: { name: "ASC" },
      });
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

  async findAllDescendants(id: string, limit = 10, page = 1) {
    const skip = limit * (page - 1);
    const role = await this.findOne(id);
    const descendants = await this.rolesRepository.findDescendants(role, {
      relations: ["employees", "reportsTo"],
    });
    let employees = descendants
      .map(({ employees, reportsTo, ...role }) =>
        employees.map((e) => ({ ...e, role, reportsTo })),
      )
      .flat();
    const total = employees.length;
    const pages = Math.ceil(total / limit);
    employees = employees.slice(skip, skip + limit);
    return { page, limit, pages, total, results: employees };
  }

  // checks if role2 is descendant of role1
  async isDescendant(roleId1: string, roleId2: string) {
    const role = await this.findOne(roleId1);
    const descendants = await this.rolesRepository.findDescendants(role);
    if (descendants.map((d) => d.id).includes(roleId2)) {
      return true;
    }
    return false;
  }

  async update(id: string, { name, description, parentId }: UpdateRoleDto) {
    await this.findOne(id); // check if the role exists
    const reportsTo = parentId ? await this.findOne(parentId) : undefined;
    // checks if the new parent isn't a child of the node to be updated
    // to avoid circular dependency
    if (reportsTo && (await this.isDescendant(id, parentId))) {
      throw new ForbiddenException(
        "can't use descendant of the role to be its parent",
      );
    }
    const updatedRole = await this.rolesRepository.preload({
      id,
      name,
      description,
      reportsTo,
    });
    return this.rolesRepository.save(updatedRole);
  }

  async getAllRolesExceptDescendants(id: string) {
    const role = await this.findOne(id);
    const descendants = await this.rolesRepository.findDescendants(role);
    const descendantIds = descendants
      .map((r) => r.id)
      .filter((id) => id !== role.id);
    return this.rolesRepository.find({
      where: {
        id: Not(In(descendantIds)),
      },
    });
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
      if (await this.isDescendant(id, parentId)) {
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
