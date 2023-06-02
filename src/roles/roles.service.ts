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
    role.parent = await this.rolesRepository.findOneBy({ id: parentId });
    return this.rolesRepository.save(role);
  }

  findAll() {
    return this.rolesRepository.findTrees();
  }

  async findOne(id: number) {
    const role = await this.rolesRepository.findOneBy({ id });
    if (role) return role;
    throw new NotFoundException(`Can't find role with id '${id}'`);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.rolesRepository.update(id, updateRoleDto);
    const role = await this.rolesRepository.findOneBy({ id });
    if (role) return role;
    throw new NotFoundException(`Can't find role with id '${id}'`);
  }

  remove(id: number) {
    this.rolesRepository.delete(id);
  }
}
