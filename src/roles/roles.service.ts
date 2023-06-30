import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entities";
import { InjectRepository } from "@nestjs/typeorm";
import { TreeRepository, UpdateDateColumn } from "typeorm";

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

  findAll() {
    return this.rolesRepository.findTrees();
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: { reportsTo: true, children: true },
    });
    if (!role) {
      throw new NotFoundException(`Can't find role with id '${id}'`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Can't find role with id '${id}'`);
    }
    const { parentId } = updateRoleDto;
    let reportsTo: Role;
    if (parentId) {
      reportsTo = await this.findOne(parentId);
      delete updateRoleDto.parentId;
    }

    await this.rolesRepository.update(id, {
      ...updateRoleDto,
      reportsTo,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    for await (const child of role.children) {
      child.reportsTo = role.reportsTo;
      await this.rolesRepository.save(child);
    }
    await this.rolesRepository.delete(id);
  }
}
