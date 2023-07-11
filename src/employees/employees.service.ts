import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { Like, QueryFailedError, Repository } from "typeorm";
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

    try {
      const newEmployee = await this.employeesRepository.save(employee);
      return newEmployee;
    } catch (err: unknown) {
      if (
        err instanceof QueryFailedError &&
        err.driverError?.code === "23505"
      ) {
        if ((err.driverError?.detail as string).includes("email"))
          throw new BadRequestException(
            "Employee with this email already exists.",
          );
        else
          throw new BadRequestException(
            "Employee with this phone number already exists.",
          );
      }
      throw err;
    }
  }

  async countAll() {
    return this.employeesRepository.count();
  }

  async findAll(q = "", page = 1, limit = 10) {
    const skip = (page - 1) * limit,
      take = limit;

    const results = await this.employeesRepository.find({
      skip,
      take,
      where: {
        fullName: Like(`%${q}%`),
      },
      order: {
        fullName: "ASC",
      },
      relations: {
        role: {
          reportsTo: true,
        },
      },
    });

    return {
      page,
      limit,
      total: await this.countAll(),
      results,
    };
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
