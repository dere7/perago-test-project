import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role } from "./entities/role.entities";
import { InjectRepository } from "@nestjs/typeorm";
import { TreeRepository } from "typeorm";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: TreeRepository<Role>,
  ) {}

  async create({ name, description, parentId }: CreateRoleDto) {
    const role = new Role();
    role.name = name;
    role.description = description;
    role.reportsTo = await this.rolesRepository.findOneBy({ id: parentId });
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
    delete updateRoleDto.parentId;
    await this.rolesRepository.update(id, {
      reportsTo: (await this.findOne(parentId)) || role.reportsTo,
      ...updateRoleDto,
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    role.children?.forEach(async (child) => {
      child.reportsTo = role.reportsTo;
      await this.rolesRepository.save(child);
    });
    await this.rolesRepository.delete(id);
  }
}
