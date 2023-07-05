import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { Repository } from "typeorm";
import { RolesService } from "src/roles/roles.service";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private rolesService: RolesService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeesRepository.create({
      ...createEmployeeDto,
      role: await this.rolesService.findOne(createEmployeeDto.roleId),
    });

    return this.employeesRepository.save(employee);
  }

  findAll() {
    return this.employeesRepository.find({ relations: { role: true } });
  }

  async findOne(id: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!employee)
      throw new NotFoundException(`Can't find employee with id '${id}'`);
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.employeesRepository.preload({
      id,
      ...updateEmployeeDto,
    });

    return this.employeesRepository.save(employee);
  }

  async remove(id: string) {
    await this.employeesRepository.delete({ id });
  }
}
