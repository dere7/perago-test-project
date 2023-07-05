import { Test, TestingModule } from "@nestjs/testing";
import { EmployeesService } from "./employees.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Employee } from "./entities/employee.entity";
import { RolesModule } from "src/roles/roles.module";

describe("EmployeesService", () => {
  let service: EmployeesService;

  const EMP_REPO_TOKEN = getRepositoryToken(Employee);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: EMP_REPO_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
      imports: [RolesModule],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
